import Database from 'better-sqlite3';
import { Max, Min } from 'class-validator';
import * as fs from 'fs';
import grayMatter from 'gray-matter';
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

    const result = new Post(content, title, slug);
    console.log(result);

    return result;
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

  get startIndex(): number {
    return this.skip;
  }

  get endIndex(): number {
    return this.skip + this.take;
  }
}

@Resolver()
export class PostsResolver {
  // TODO make this a database call
  postsPath = path.resolve('content', 'blog-posts');
  posts: Post[] = fs.readdirSync(this.postsPath).map(postFileName => {
    const postString = fs.readFileSync(path.join(this.postsPath, postFileName), 'utf-8');
    const { content, data: { title, slug } } = grayMatter(postString) as unknown as ParsedGMPost;
    const result = new Post(content, title, slug);
    console.log(result);
    return result;
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query(_returns => [Post], { description: 'Get multiple posts' })
  async getPosts(@Args() { slug, startIndex, endIndex }: GetPostsArgs): Promise<Array<Post>> {
    let blogPosts = this.posts;
    if (slug) {
      blogPosts = blogPosts.filter(blogPost => blogPost.data.slug === slug);
    }
    blogPosts = blogPosts.slice(startIndex, endIndex);
    return blogPosts;
  }
}
