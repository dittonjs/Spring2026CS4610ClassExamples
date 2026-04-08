import { Queue, QueueEvents } from "bullmq";


const queue = new Queue("background_job")

queue.add("do work", {hello: "World"});
queue.add("download",  "asdfasdf");
const job = await queue.add("indexing", [1,2,3,4]);


const queueEvents = new QueueEvents("background_job")

queueEvents.on('completed', ({jobId}) => {
  console.log(jobId)
});

queueEvents.on('error', ({jobId}) => {
  console.log(jobId, "Errored")
})

queueEvents.on('resumed', ({jobId}) => {
  console.log('resumed', jobId)
})

queueEvents.on('failed', ({jobId}) => {
  console.log("Job failed", jobId)
})
