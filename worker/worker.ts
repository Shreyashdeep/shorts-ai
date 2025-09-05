import Redis from "ioredis";
import { Job, Worker } from "bullmq";
import { processes } from "@/app/actions/processes";
import { prisma } from "@/app/lib/db";
import { log } from "node:console";
const connection = new Redis({
  host: process.env.UPSTASH_REDIS_HOST,
  port: 6379,
  password: process.env.UPSTASH_REDIS_PASSWORD,
  tls: {},
  maxRetriesPerRequest: null,
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



