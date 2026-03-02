import { createClient } from 'redis';

const client = createClient();


client.on('error', (err) => {
  console.error('Redis error:', err);
});

client.on('connect', () => {
  console.log('Redis connected');
});


await client.connect();
client.set("name", "joseph")
client.hSet("cache:users:25", {
  name: "Joseph",
  age: 34,
  job: "professor"
});
