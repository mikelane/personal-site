import { ApolloServer } from 'apollo-server-express';
import * as path from 'path';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { ErrorInterceptor } from './middleware';
import { PostResolver, PostsResolver } from './resolvers';

export const createApolloServer = async (): Promise<ApolloServer> => {
  const schema = await buildSchema({
    emitSchemaFile: path.resolve('src', 'graphql', 'schema.graphql'),
    resolvers: [PostsResolver, PostResolver],
    globalMiddlewares: [ErrorInterceptor],
  });

  return new ApolloServer({
    schema,
    playground: true,
    introspection: true,
  });
};
