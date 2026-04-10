import { tool } from "@langchain/core/tools";
import * as z from "zod";
import fs from "fs/promises";
import path from "path";

export const readFileTool = tool(
  async ({ filePath }) => {
    try {
      const content = await fs.readFile(filePath, "utf-8");
      return content;
    } catch (err) {
      return `Error reading file: ${err.message}`;
    }
  },
  {
    name: "readFile",
    description: "Reads the contents of a file at the given path and returns it as a string",
    schema: z.object({
      filePath: z.string().describe("The path to the file to read"),
    }),
  }
);

export const writeFileTool = tool(
  async ({ filePath, content }) => {
    try {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, content, "utf-8");
      return `Successfully wrote to ${filePath}`;
    } catch (err) {
      return `Error writing file: ${err.message}`;
    }
  },
  {
    name: "writeFile",
    description:
      "Writes content to a file at the given path. Creates the file and any parent directories if they don't exist.",
    schema: z.object({
      filePath: z.string().describe("The path to the file to write"),
      content: z.string().describe("The content to write to the file"),
    }),
  }
);

export const listDirectoryTool = tool(
  async ({ dirPath }) => {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      const listing = entries.map((entry) => {
        const type = entry.isDirectory() ? "[dir]" : "[file]";
        return `${type} ${entry.name}`;
      });
      return listing.join("\n");
    } catch (err) {
      return `Error listing directory: ${err.message}`;
    }
  },
  {
    name: "listDirectory",
    description:
      "Lists the files and folders in a directory. Each entry is prefixed with [dir] or [file].",
    schema: z.object({
      dirPath: z.string().describe("The path to the directory to list"),
    }),
  }
);

export const executeCommandTool = tool(
  async ({ command, args = [] }) => {
    try {
      const { execFile } = await import("child_process");
      const { promisify } = await import("util");
      const execFileAsync = promisify(execFile);

      const result = await execFileAsync(command, args, {
        timeout: 30_000,
        maxBuffer: 10 * 1024 * 1024,
      });

      return [result.stdout, result.stderr].filter(Boolean).join("\n").trim() || "Command completed with no output.";
    } catch (err) {
      const stderr = err?.stderr ? `\n${err.stderr}` : "";
      return `Error executing command: ${err.message}${stderr}`;
    }
  },
  {
    name: "executeCommand",
    description:
      "Executes a shell command with optional arguments. Use with human-in-the-loop approval before running potentially dangerous commands.",
    schema: z.object({
      command: z.string().describe("The command to execute, e.g. 'node' or 'npm'"),
      args: z.array(z.string()).default([]).describe("Arguments to pass to the command"),
    }),
  }
);
