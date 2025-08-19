import axios from "axios";
import { prismaClient } from "../../client/db";
import JWTService from "../../services/jwt";
import { GraphqlContext, JWTUser } from "../../types/interfaces";
import { User } from '@prisma/client';
import UserService from "../../services/user";


export const resolvers = {
    verifyGoogleToken : async ( parent : any , { token } : { token : string }) => {
        const resultToken = await UserService.verifyGoogleAuthToken(token);

        return resultToken;
    },
    getCurrentUser : async ( parent : any , args : any , ctx : GraphqlContext ) => {
        const id = ctx.user?.id;
        if(!id) return null;

        const user = await UserService.getUserById(id);

        return user;
    },
    getUserById : async ( parent : any , { id }:{ id: string } , context : GraphqlContext ) => {
        const user = await UserService.getUserById(id);

        return user;
    }
}

export const extraResolver = {
    User:{
        tweets: async (parent:User ) => prismaClient.tweet.findMany({ where : { authorId : parent.id }})
    }
}