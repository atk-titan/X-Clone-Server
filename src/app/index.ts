// app.ts
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import cors from 'cors';
import { User } from "./user";
import { GraphqlContext } from "../types/interfaces";
import JWTService from "../services/jwt";
import { Tweet } from "./tweet";
import { resolvers } from './user/resolvers';

export async function initServer() {
  const app = express();
  
  app.use(cors());
  app.use(bodyParser.json());
  
  const graphqlServer = new ApolloServer<GraphqlContext>({
    typeDefs: `
    ${User.types}
    ${Tweet.types}
    type Query {
      ${User.queries}
      ${Tweet.queries}
      }
    type Mutation {
      ${Tweet.mutation}
      ${User.mutations}
      }
      `,
      resolvers: {
        Query: {
          ...User.resolvers,
          ...Tweet.queryResolver
        },
        Mutation: {
          ...Tweet.resolvers,
          ...User.mutationres
        },
        ...Tweet.extraResolver,
        ...User.extraResolver
      }
    });
    
    await graphqlServer.start();
    
    app.use("/graphql", expressMiddleware(graphqlServer,{
      context: async ({req,res}) =>{
        return { user: req.headers.authorization ? await JWTService.decodeToken(req.headers.authorization) : undefined }
      }
    }));

  return app;
}