import { prismaClient } from "../client/db";
import { redisClient } from "../redis";
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

        await redisClient.del('tweets:all');

        return tweet;
    }

    public static async getAllTweets(){
        const cached = await redisClient.get("tweets:all");
        if(cached) return cached;

        const tweets = await prismaClient.tweet.findMany({
            orderBy:{
                createdAt:"desc"
            }
        });

        await redisClient.set(`tweets:all`,JSON.stringify(tweets))

        return tweets;
    }
}

export default TweetService;