import { Queue } from "bullmq";
import Redis from "ioredis";

const connection = new Redis(
  "rediss://default:AfKUAAIncDE3NDhhNjFmZTFkNzQ0OTg4YjIwZTI4MDAwMGMzMjc0ZXAxNjIxMDA@select-stallion-62100.upstash.io:6379",
  {
    maxRetriesPerRequest: null,
  }
);
connection.on("connect", () => {
  console.log("Redis connected successfully");
});
connection.on("error", (err) => {
  console.log("Redis connection error: ", err);
});
connection.on("ready", () => {
  console.log("Redis is ready");
});
export const videoQueue = new Queue("video", {
  connection,
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 10,
  },
});
