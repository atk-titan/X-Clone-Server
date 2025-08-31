import { types } from "./types";
import { queries } from "./queries";
import { extraResolver, mutationres, resolvers } from "./resolvers";
import { mutations } from "./mutations";

export const User = {
    types, queries, mutations, resolvers, extraResolver , mutationres
};