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

interface frontMatterQuery {
  readonly '__typename': string
  readonly title: string
  readonly slug?: string
}

export interface getPostQuery {
  readonly '__typename': string
  readonly content: string
  readonly data: frontMatterQuery
}

export interface getPostResolver {
  readonly getPost: getPostQuery
}
