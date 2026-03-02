import { Queue } from "bullmq";


const queue = new Queue("background_job")

queue.add("do work", {hello: "World"});
queue.add("download",  "asdfasdf");
queue.add("indexing", [1,2,3,4]);
