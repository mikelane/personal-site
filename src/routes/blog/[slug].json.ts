import {
  ApolloClient, ApolloQueryResult, gql, HttpLink, InMemoryCache,
} from '@apollo/client';
import fetch from 'cross-fetch';
import type * as express from 'express';
import type { getPostResolver } from '../../graphql/types';

export const get = async (req: express.Request, res: express.Response): Promise<void> => {
  const { slug } = req.params;

  const client = new ApolloClient({
    link: new HttpLink({ uri: 'http://localhost:3000/graphql', fetch }),
    cache: new InMemoryCache(),
  });

  const GET_POST = gql`query getPost($slug:String!){
      getPost(slug:$slug) {
          title
          slug
          createdAt
          updatedAt
          html
      }
  }`;

  try {
    const response: ApolloQueryResult<getPostResolver> = await client.query({
      query: GET_POST,
      variables: { slug },
    });
    console.info(`WOW ${JSON.stringify(response)}`);
    console.info(`typeof data: ${typeof response.data}`);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response.data?.getPost));
  } catch (e) {
    console.error(`ERROR: ${e.message}`);
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not found' }));
  }
};
