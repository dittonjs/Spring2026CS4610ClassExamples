import { Worker } from "bullmq";
import IORedis from 'ioredis';

new Worker("background_job", async (job) => {
  console.log(job.name, job.data);
  const promise = new Promise((res, rej) => setTimeout(rej, 3000))
  await promise;
}, {
  connection: new IORedis({ maxRetriesPerRequest: null })
});


