import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'Blog post model' })
export class Post {
  constructor(title: string, slug: string, html: string, createdAt: string, updatedAt: string) {
    this.title = title;
    this.slug = slug;
    this.html = html;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  @Field({ description: 'Blog post html' })
  html!: string;

  @Field({ description: 'Blog post title' })
  title!: string;

  @Field({ description: 'Blog post slug' })
  slug!: string;

  @Field({ description: 'Blog post creation time string' })
  createdAt!: string

  @Field({ description: 'Blog post updated time string' })
  updatedAt!: string
}
