import { Worker } from "bullmq";
import IORedis from 'ioredis';

new Worker("background_job", async (job) => {
  console.log(job);
}, {
  connection: new IORedis({ maxRetriesPerRequest: null })
});


