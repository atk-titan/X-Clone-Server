import { prismaClient } from "../client/db";
import JWT from "jsonwebtoken";
import { sign } from './../../node_modules/@types/jsonwebtoken/index.d';
import { User } from "@prisma/client";

class JWTService{
    public static async generateTokenForUser(user:User){

        const payload = {
            id:user?.id,
            email:user?.email
        };

        const token = JWT.sign(payload,'secret');

        return token;
    }
}

export default JWTService;