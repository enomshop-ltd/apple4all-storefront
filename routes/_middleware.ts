import { FreshContext } from "fresh";
import { getCategories } from "../lib/data.ts";
import { getCookies } from "jsr:@std/http@0.224.0/cookie";

export async function handler(ctx: FreshContext) {
  const cookies = getCookies(ctx.req.headers);
  ctx.state.isLoggedIn = !!cookies["_medusa_jwt"];

  try {
    const categories = await getCategories();
    ctx.state.categories = categories;
  } catch (_e) {
    ctx.state.categories = [];
  }
  return await ctx.next();
}
