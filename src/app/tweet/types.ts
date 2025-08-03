export const types=  `#graphql
    input CreateTweetData{
        content: String!
        imageURL: [String]
        videoURL: String
    }
    type Tweet{
        id: ID!
        content: String!
        imageURL: [String]
        videoURL: String
        
        author: User

        createdAt: String
        updatedAt: String
    }
`;