import Database from 'better-sqlite3';
import { Max, Min } from 'class-validator';
import * as fs from 'fs';
import grayMatter from 'gray-matter';
import { compile } from 'mdsvex';
import * as path from 'path';
import {
  Args, ArgsType, Field, Int, Query, Resolver,
} from 'type-graphql';
import { Post } from '../schema';
import type { ParsedGMPost } from '../types';

@Resolver()
export class HelloWorldResolver {
  @Query(() => String, { description: 'Example thing to query' })
  async helloWorld(): Promise<string> {
    return 'Hello world!';
  }
}

@ArgsType()
export class GetPostArgs {
  @Field({ nullable: false })
  slug!: string
}

@Resolver()
export class PostResolver {
  db = new Database(path.resolve('content', 'personal-site.db'), { verbose: console.log });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query(_response => Post, { description: 'Get a single post.' })
  async getPost(@Args() { slug }: GetPostArgs): Promise<Post> {
    const statement = this.db.prepare('SELECT * FROM posts WHERE slug = ?').bind(slug);
    const row = statement.get();
    const postString = row.post_mdsvex;
    console.info(`postString: ${postString}`);
    const { content, data: { title } } = grayMatter(postString) as unknown as ParsedGMPost;

    const mdsvexResult = await compile(content, {});

    console.log(mdsvexResult);
    if (mdsvexResult) {
      return new Post(mdsvexResult.code, title, slug);
    }
    throw new Error('Error getting post');
  }
}

@ArgsType()
export class GetPostsArgs {
  @Field({ nullable: true })
  slug?: string

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field(_type => Int)
  @Min(0)
  skip = 0

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field(_type => Int)
  @Min(1)
  @Max(10)
  take = 10

  get startId(): number {
    return this.skip + 1;
  }

  get endId(): number {
    return this.skip + this.take;
  }
}

@Resolver()
export class PostsResolver {
  db = new Database(path.resolve('content', 'personal-site.db'), { verbose: console.log });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query(_returns => [Post], { description: 'Get multiple posts' })
  async getPosts(@Args() { startId, endId }: GetPostsArgs): Promise<Array<Post>> {
    const statement = this.db.prepare(`
    SELECT 
      * 
    FROM 
      posts 
    WHERE 
      post_id BETWEEN ? AND ? 
      AND is_deleted != 1;`)
      .bind(Math.trunc(startId), Math.trunc(endId));
    const rows = statement.all();
    const posts: Post[] = [];
    rows.map(row => {
      const { content, data: { title, slug } } = grayMatter(
        row.post_mdsvex,
      ) as unknown as ParsedGMPost;

      let code: string | undefined;
      compile(content, {})
        .then(data => {
          console.debug(data);
          code = data?.code as string;
          posts.push(new Post(code, title, slug));
        })
        .catch(err => {
          console.error(err.message);
          throw new Error(err);
        });
      return 'wow';
    });
    return posts;
  }
}
