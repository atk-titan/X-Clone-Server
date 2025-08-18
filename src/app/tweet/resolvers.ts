import { GraphqlContext } from "../../types/interfaces";
import { prismaClient } from "../../client/db";
import { Tweet } from "@prisma/client";
import { S3Client , PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import dotenv from "dotenv";
dotenv.config();

interface Payload{
    content: string;
    imageURL: string[];
    videoURL?: string;
}

const s3Client = new S3Client({
    region: "ap-south-1",
    credentials:{
        accessKeyId: process.env.S3_Access as string,
        secretAccessKey: process.env.S3_Secret as string
    }
})

export const queryResolver = {
    getAllTweets: async ( parent: any ) => await prismaClient.tweet.findMany(),
    getSignedUrlForTweet: async ( parent: any , { imageType }:{ imageType: string } , ctx: GraphqlContext ) => {
        if( !ctx.user || !ctx.user.id )
            throw new Error("User Not Authenticated.");
        
        const allowedMediaTypes = [
            "jpg", "jpeg", "png", "webp",
            "heif", "heic",
            "mp4", "mov", "webm"
        ];

        if( !allowedMediaTypes.includes(imageType))
            throw new Error("Unsupported image or video type");

        const putOjectCommand = new PutObjectCommand({
            Bucket: "twiiter-dev",
            Key: `uploads/${ctx.user.id}/tweets/${Date.now().toString()}.${imageType}`
        });

        const signedURL = await getSignedUrl(s3Client,putOjectCommand);

        return signedURL;
    }
}

export const resolvers = {
    createTweet: async (
        parent: any ,
        { payload }:{ payload:Payload },
        context: GraphqlContext
    ) => {
        if(!context.user) throw new Error("User not Authenticated");
        const tweet = await prismaClient.tweet.create({
            data:{
                content: payload.content,
                imageURL: payload.imageURL,
                videoURL: payload.videoURL,
                author: { connect: { id:context.user.id } },
            },
        });

        return tweet;
    },
}

export const extraResolver = {
    Tweet : {
        author: ( parent: Tweet ) => 
            prismaClient.user.findUnique({where:{ id: parent.authorId }})
    }
}