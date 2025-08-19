import { GraphqlContext } from "../../types/interfaces";
import { prismaClient } from "../../client/db";
import { Tweet } from "@prisma/client";
import { S3Client , PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import UserService from "../../services/user";
import TweetService, { Payload } from "../../services/tweet";


const s3Client = new S3Client({
    region: "ap-south-1",
    credentials:{
        accessKeyId: process.env.S3_Access as string,
        secretAccessKey: process.env.S3_Secret as string
    }
})

export const queryResolver = {
    getAllTweets: async ( parent: any ) => await TweetService.getAllTweets(),
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
        ctx: GraphqlContext
    ) => {
        if(!ctx.user) throw new Error("User not Authenticated");

        const tweet = await TweetService.createTweet({
            ...payload,
            userId: ctx.user.id
        })
    },
}

export const extraResolver = {
    Tweet : {
        author: ( parent: Tweet ) => UserService.getUserById(parent.authorId)
    }
}