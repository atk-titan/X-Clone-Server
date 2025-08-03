import { types } from './types';
import { mutation } from './mutation';
import { extraResolver, queryResolver, resolvers } from './resolvers';
import { queries } from './queries';

export const Tweet = { types , queries , mutation , resolvers , extraResolver , queryResolver};