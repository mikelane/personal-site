import * as sapper from '@sapper/server'; // eslint-disable-line import/no-unresolved
import Database from 'better-sqlite3';
import compression from 'compression';
import express, { Express } from 'express';
import path from 'path';
import sirv from 'sirv';
import { createApolloServer } from './graphql';

const PORT = process.env.PORT; // eslint-disable-line prefer-destructuring
const mode = process.env.NODE_ENV;
const dev = mode === 'development';

const createSapperAndApolloServer = async (graphqlPath: string): Promise<Express> => {
  const db = new Database(path.resolve('content', 'personal-site.db'), { verbose: console.log });
  try {
    db.prepare(`CREATE TABLE IF NOT EXISTS posts (
    post_id INTEGER PRIMARY KEY,
    slug TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    deleted_on DATE,
    is_deleted BOOLEAN NOT NULL,
    post_mdsvex TEXT NOT NULL
  )`).run();
  } catch (e) {
    console.error(e.message);
  }

  const app = express();

  const apolloServer = await createApolloServer();

  apolloServer.applyMiddleware({ app, path: graphqlPath });

  app.use(
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    sapper.middleware(),
  );

  return app;
};

createSapperAndApolloServer('/graphql').then(app => {
  app.listen( PORT, ( err?: any ): void => { // eslint-disable-line
    if (err) {
      console.log('error', err);
    }
  });
});
