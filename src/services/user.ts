import axios from "axios";
import { prismaClient } from "../client/db";
import JWTService from "./jwt";
import { GraphqlContext } from "../types/interfaces";

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

class UserService{
    public static async verifyGoogleAuthToken(token:string){
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
    }

    public static async getUserById(id:string){
        const user = await prismaClient.user.findUnique({
            where:{
                id:id
            }
        });

        return user;
    }
}

export default UserService;