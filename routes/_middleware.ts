import { FreshContext } from "fresh";
import { getCategories } from "../lib/data.ts";

export async function handler(
  _req: Request,
  ctx: FreshContext,
) {
  try {
    const categories = await getCategories();
    ctx.state.categories = categories;
  } catch (_e) {
    ctx.state.categories = [];
  }
  return await ctx.next();
}
