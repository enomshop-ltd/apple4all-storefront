import { FreshContext } from "fresh";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";

export async function handler(ctx: FreshContext) {
  const cookies = getCookies(ctx.req.headers);
  const token = cookies["_medusa_jwt"];

  if (!token) {
    const url = new URL(ctx.req.url);
    url.pathname = "/login";
    return Response.redirect(url, 302);
  }

  // Pass the token to the state
  ctx.state.token = token;

  const resp = await ctx.next();
  return resp;
}
