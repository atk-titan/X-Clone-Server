import axios from "axios";
import { prismaClient } from "../../client/db";
import JWTService from "../../services/jwt";
import { GraphqlContext, JWTUser } from "../../types/interfaces";
import { User } from '@prisma/client';

interface googleTokenResult {
    iss?: string;
    azp?: string;
    aud?: string;
    sub?: string;
    email: string;
    email_verified: string;
    nbf?: string;
    name: string;
    picture?: string;
    given_name: string;
    family_name?: string;
    iat?: string;
    exp?: string;
    jti?: string;
    alg?: string;
    kid?: string;
    typ?: string;
}

export const resolvers = {
    verifyGoogleToken : async ( parent : any , { token } : { token : string }) => {
        const googleToken = token;
        // console.log(googleToken);
        const googleOauthURL = new URL("https://oauth2.googleapis.com/tokeninfo");
        
        googleOauthURL.searchParams.set('id_token', googleToken);

        const { data } = await axios.get<googleTokenResult>(googleOauthURL.toString(),{
            responseType: 'json'
        });

        let user = await prismaClient.user.findUnique({
            where:{
                email : data.email,
            }
        });

        if(!user){
            user = await prismaClient.user.create({
                data:{
                    email:data.email,
                    firstname:data.given_name,
                    lastname:data.family_name,
                    profileImageURL:data.picture || '' , 
                }
            });
        }

        const userToken = await JWTService.generateTokenForUser(user);
        
        return userToken;
    },
    getCurrentUser : async ( parent : any , args : any , context : GraphqlContext ) => {
        // console.log(context);
        const user = await prismaClient.user.findUnique({
            where:{
                id:context.user?.id
            }
        });
        // console.log(user);
        return user;
    },
    getUserById : async ( parent : any , { id }:{ id: string } , context : GraphqlContext ) => {
        const user = await prismaClient.user.findUnique({
            where:{
                id:id
            }
        });

        return user;
    }
}

export const extraResolver = {
    User:{
        tweets: async (parent:User ) => prismaClient.tweet.findMany({ where : { authorId : parent.id }})
    }
}