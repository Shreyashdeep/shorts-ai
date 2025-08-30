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

    // const imageLinks = [
    //     'https://shorts699.s3.eu-north-1.amazonaws.com/e8b6b1a2-ce75-4b2c-8c10-2f05c49e5782.png',
    //     'https://shorts699.s3.eu-north-1.amazonaws.com/298d6f3b-db2a-410f-95ad-290cd3390ce3.png',
    //     'https://shorts699.s3.eu-north-1.amazonaws.com/2fc71ade-0dd2-4496-ac6d-404b4f72bc4a.png',
    //     'https://shorts699.s3.eu-north-1.amazonaws.com/2b72fedc-4884-4bcf-b02c-30a5457e88e5.png',
    //     'https://shorts699.s3.eu-north-1.amazonaws.com/ede07e29-dbd4-40ee-83d6-910a6153ae15.png',
    //     'https://shorts699.s3.eu-north-1.amazonaws.com/635dbdf6-147b-42db-90cd-5f9586411082.png',
    //     'https://shorts699.s3.eu-north-1.amazonaws.com/4fbb42f2-917f-4cae-8409-70091b43e272.png'
    // ]
    const imageLinks = [
        'https://ai-shorts69.s3.us-east-1.amazonaws.com/80d7de49-7595-42ca-a770-c6cf6398f719.png',
        'https://ai-shorts69.s3.us-east-1.amazonaws.com/7f35d701-86dd-423b-9ae7-002493fff57c.png',
        'https://ai-shorts69.s3.us-east-1.amazonaws.com/a5c2be8c-32c4-4a56-a61b-8aefe205581c.png',
        'https://ai-shorts69.s3.us-east-1.amazonaws.com/aa5242c2-5616-4445-8c47-3c077a796235.png',
        'https://ai-shorts69.s3.us-east-1.amazonaws.com/77253c06-bf7d-431a-9b5a-1c825e264cee.png',
        'https://ai-shorts69.s3.us-east-1.amazonaws.com/4267e1c4-9a97-4e47-9447-b1428e52ae98.png'
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
