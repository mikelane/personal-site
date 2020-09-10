export interface ParsedGMFrontMatter {
  readonly title: string;
  readonly slug: string;
}

export interface ParsedGMPost {
  readonly content: string;
  readonly data: ParsedGMFrontMatter;
  readonly isEmpty?: boolean;
  readonly excerpt?: string;
}

export interface getPostQuery {
  readonly '__typename': string
  readonly title: string
  readonly slug: string
  readonly createdAt: string
  readonly updatedAt: string
  readonly html: string
}

export interface getPostResolver {
  readonly getPost: getPostQuery
}

export interface PostRow {
  readonly postId: number
  readonly slug: string
  readonly title: string
  readonly postMd: string
  readonly createdAt: string
  readonly updatedAt: string
  readonly deletedAt: string
  readonly isDeleted: number
}
