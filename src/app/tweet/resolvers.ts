import { GraphqlContext } from "../../types/interfaces";
import { prismaClient } from "../../client/db";
import { Tweet } from "@prisma/client";

interface Payload{
    content: string;
    imageURL: string[];
    videoURL?: string;
}

export const queryResolver = {
    getAllTweets: async ( parent: any ) => await prismaClient.tweet.findMany()
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
    }
}

export const extraResolver = {
    Tweet : {
        author: ( parent: Tweet ) => 
            prismaClient.user.findUnique({where:{ id: parent.authorId }})
    }
}