import JWT from "jsonwebtoken";
import { User } from "@prisma/client";
import { JWTUser } from "../types/interfaces";

const JWT_secret = process.env.JWT_secret || "";

class JWTService{
    public static async generateTokenForUser(user:User){
        
        const payload : JWTUser = {
            id:user?.id,
            email:user?.email
        };
        
        const token = JWT.sign(payload,JWT_secret);

        return token;
    }
    public static async decodeToken(token:string){
        // console.log(token);
        try{     
            const user = JWT.verify(token.split(" ")[1] , JWT_secret) as JWTUser;

            return user; 
        }catch(err){
            return null;
        }
    }
}

export default JWTService;