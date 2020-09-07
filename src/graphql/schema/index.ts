import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'Blog post metadata model' })
export class FrontMatter {
  @Field({ description: 'Blog post title' })
  title!: string;

  @Field({ description: 'Blog post slug' })
  slug!: string;
}

@ObjectType({ description: 'Blog post model' })
export class Post {
  @Field({ description: 'Blog post Content' })
  content!: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field(_type => FrontMatter, { description: 'Blog most metadata' })
  data!: FrontMatter;

  constructor(content: string, title: string, slug: string) {
    this.content = content;
    this.data = { title, slug };
  }
}
