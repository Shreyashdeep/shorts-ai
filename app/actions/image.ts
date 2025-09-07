import { prisma } from "../lib/db";
import Replicate from "replicate";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

interface ReplicateOutput {
  url: () => URL;
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const bucketName = process.env.S3_BUCKET_NAME;

const processImage = async (img: string) => {
  try {
    const input = {
      prompt: img,
      resolution: "None",
      style_type: "Realistic",
      aspect_ratio: "9:16",
      magic_prompt_option: "On",
    };
    const output = (await replicate.run("ideogram-ai/ideogram-v3-turbo", {
      input,
    })) as ReplicateOutput;
    const image = output.url();
    const imageUrl = image.href;
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = `${randomUUID()}.png`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: "image/png",
    });

    await s3Client.send(command);
    const s3Url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    return s3Url;
  } catch (error) {
    console.error("error while generating image from replicate", error);
    throw error;
  }
};

export const generateImages = async (videoId: string) => {
  try {
    // const video = await prisma.video.findUnique({
    //   where: {
    //     videoId: videoId,
    //   },
    // });
    // if (!video) {
    //   return null;
    // }

    // const imagePromises = video.imagePrompts.map((img) => processImage(img));

    // const imageLinks = await Promise.all(imagePromises)

    const imageLinks = [
      "https://ai-shorts69.s3.us-east-1.amazonaws.com/3a6e27d7-61b1-4f11-9d1b-67f0016980e5.png",
      "https://ai-shorts69.s3.us-east-1.amazonaws.com/e0853058-c925-499a-b8e7-2b69d2ebaf91.png",
      "https://ai-shorts69.s3.us-east-1.amazonaws.com/7ab437e6-3090-4314-bb65-0386e7567b8d.png",
      "https://ai-shorts69.s3.us-east-1.amazonaws.com/5461da71-438c-4457-b3bb-80899d105e30.png",
      "https://ai-shorts69.s3.us-east-1.amazonaws.com/a93979e4-6a22-4932-8cfa-29d6576ad8b6.png",
      "https://ai-shorts69.s3.us-east-1.amazonaws.com/de85e7f0-dafc-4cec-8e2f-c841e6d5d9e1.png",
    ];

    console.log(imageLinks);
    await prisma.video.update({
      where: {
        videoId: videoId,
      },
      data: {
        imageLinks: imageLinks,
        thumbnail: imageLinks[0],
      },
    });

    // const response = await processImage('Leo messi celebrating his 8th ballondor')
    // console.log(response);
  } catch (error) {
    console.error("error while generating image:", error);
    throw error;
  }
};
