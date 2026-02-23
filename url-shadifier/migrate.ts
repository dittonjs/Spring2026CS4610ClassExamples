import { readdir, mkdir, readFile } from "fs/promises";
import { join } from "path";
import * as pg from "pg";

const { Client } = pg;

const MIGRATIONS_DIR = join(process.cwd(), "migrations");

async function ensureMigrationsDir() {
  try {
    await mkdir(MIGRATIONS_DIR, { recursive: true });
  } catch {
    // already exists
  }
}

async function ensureMigrationsTable(client: pg.Client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name TEXT PRIMARY KEY,
      run_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function getPendingMigrations(client: pg.Client): Promise<string[]> {
  const { rows } = await client.query<{ name: string }>(
    "SELECT name FROM _migrations"
  );
  const run = new Set(rows.map((r: { name: string }) => r.name));

  const files = await readdir(MIGRATIONS_DIR);
  const sqlFiles = files
    .filter((f) => f.endsWith(".sql"))
    .sort();

  return sqlFiles.filter((f) => !run.has(f));
}

async function runMigration(client: pg.Client, name: string) {
  const path = join(MIGRATIONS_DIR, name);
  const sql = await readFile(path, "utf-8");
  await client.query("BEGIN");
  try {
    await client.query(sql);
    await client.query("INSERT INTO _migrations (name) VALUES ($1)", [name]);
    await client.query("COMMIT");
    console.log(`Ran: ${name}`);
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  }
}

async function main() {
  const connectionString =
    process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/url_shadifier";

  await ensureMigrationsDir();

  const client = new Client({ connectionString });
  await client.connect();

  try {
    await ensureMigrationsTable(client);
    const pending = await getPendingMigrations(client);

    if (pending.length === 0) {
      console.log("No pending migrations.");
      return;
    }

    for (const name of pending) {
      await runMigration(client, name);
    }
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
