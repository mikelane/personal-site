import Database from 'better-sqlite3';
import { Max, Min } from 'class-validator';
import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';
import * as path from 'path';
import {
  Args, ArgsType, Field, Int, Query, Resolver,
} from 'type-graphql';
import { Post } from '../schema';
import type { PostRow } from '../types';

const md: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${
          hljs.highlight(lang, str, true).value
        }</code></pre>`;
      } catch (err) {
        console.error(err.message);
      }
    }

    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  },
});

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
    const statement = this.db.prepare(`
    SELECT
        * 
    FROM
        posts 
    WHERE
        slug = ? 
        AND isDeleted = 0`).bind(slug);
    const {
      postMd, title, createdAt, updatedAt,
    } = statement.get() as PostRow;
    console.info(
      `Retrieved Post:
      title: ${title}
      postMd: ${postMd}
      createdAt: ${createdAt}
      updatedAt: ${updatedAt}`,
    );
    const html = md.render(postMd);
    return new Post(title, slug, html, createdAt, updatedAt);
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
      postId BETWEEN ? AND ? 
      AND isDeleted = 0;`)
      .bind(startId, endId);

    const rows: PostRow[] = statement.all();
    console.log(rows);
    const posts: Post[] = [];

    rows.forEach(({
      title, slug, postMd, createdAt, updatedAt,
    }: PostRow) => {
      console.info(
        `Retrieved Post:
      title: ${title}
      postMd: ${postMd}
      createdAt: ${createdAt}
      updatedAt: ${updatedAt}`,
      );

      const html = md.render(postMd);
      posts.push(new Post(title, slug, html, createdAt, updatedAt));
    });

    return posts;
  }
}
