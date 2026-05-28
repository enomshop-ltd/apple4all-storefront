import { FreshContext } from "fresh";
import { getPosts } from "../../lib/news.ts";

export async function handler(
  ctx: FreshContext
) {
  const posts = await getPosts();
  ctx.state.posts = posts;
  return await ctx.next();
}
