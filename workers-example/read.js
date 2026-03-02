import { createClient } from 'redis';

const client = createClient();


client.on('error', (err) => {
  console.error('Redis error:', err);
});

client.on('connect', () => {
  console.log('Redis connected');
});

await client.connect();
const name = await client.get("name");

const user = await client.hGetAll("cache:users:25");
console.log(user)
console.log(name);
