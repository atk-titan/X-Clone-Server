import { prismaClient } from "../client/db";
import { GraphqlContext } from "../types/interfaces";

export interface Payload{
    content: string;
    imageURL: string[];
    videoURL?: string;
    userId: string
}

class TweetService{
    public static async createTweet( payload: Payload ){
        
        const tweet = await prismaClient.tweet.create({
            data:{
                content: payload.content,
                imageURL: payload.imageURL,
                videoURL: payload.videoURL,
                author: { connect: { id: payload.userId } },
            },
        });

        return tweet;
    }

    public static async getAllTweets(){
        const tweets = await prismaClient.tweet.findMany({
            orderBy:{
                createdAt:"desc"
            }
        });

        return tweets;
    }
}

export default TweetService;