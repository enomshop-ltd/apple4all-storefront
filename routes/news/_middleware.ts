import { FreshContext } from "fresh";
import { getPosts } from "../../utils/news.ts";

export async function handler(
  _req: Request,
  ctx: FreshContext
) {
  const posts = await getPosts();
  ctx.state.posts = posts;
  return await ctx.next();
}
