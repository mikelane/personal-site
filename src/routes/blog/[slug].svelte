<script context="module">
  export async function preload(this: {fetch: typeof fetch}, page) {
    const {slug} = page.params;
    const res = await this.fetch(`blog/${slug}.json`);
    if(res.status === 200) {
      const post = await res.json();
      return {post}
    }

    this.error(404, 'Not found');

  }
</script>

<script lang="ts">
  import type {getPostQuery} from '../../graphql/types'

  export let post: getPostQuery
</script>

<h1>{post.title}</h1>

<p>{@html post.html}</p>
