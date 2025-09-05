import Redis from "ioredis";
import { Job, Worker } from "bullmq";
import { processes } from "@/app/actions/processes";
import { prisma } from "@/app/lib/db";


const connection = new Redis(
  "redis://default:AfKUAAIncDE3NDhhNjFmZTFkNzQ0OTg4YjIwZTI4MDAwMGMzMjc0ZXAxNjIxMDA@select-stallion-62100.upstash.io:6379",
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

const worker = new Worker("video-processing", async (job) => {
  const { videoId } = job.data;
  console.log(`processing video ${videoId}`);
  try {
    await processes(videoId);
    console.log(`sucessfully processed the video ${videoId}`);
  } catch (error) {
    console.log(`error while processing the video ${videoId}`);
    await prisma.video.update({
      where: {
        videoId: videoId,
      },
      data: {
        processing: false,
        failed: true,
      },
    });
    throw error;
  }
},{
    connection,
    concurrency: 2
});

worker.on("completed", (job) => {
  console.log(`${job?.id} completed`);
});
worker.on("failed", (job, err) => {
  console.log(`${job?.id} failed`, err.message);
});
worker.on("error", (err) => {
  console.log("Worker error: ", err);
});



