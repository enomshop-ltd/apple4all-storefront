import { getCookies } from "jsr:@std/http@0.224.0/cookie";
import { FreshContext } from "fresh";

export async function handler(ctx: FreshContext) {
  const req = ctx.req;
  const url = new URL(req.url);
  const path = url.pathname;

  const cookies = getCookies(req.headers);
  const sessionToken = cookies["_medusa_jwt"] || cookies["connect.sid"];
  ctx.state.isLoggedIn = !!sessionToken;

  // Track doesn't strictly need auth (it uses token or we handle auth inside)
  // Dashboard (/) and Book need auth.
  if (path === "/repairs" || path === "/repairs/" || path === "/repairs/book") {
    if (!sessionToken) {
      // Redirect to login
      const redirectUrl = new URL("/login", url.origin);
      redirectUrl.searchParams.set("redirect", path);
      return Response.redirect(redirectUrl.href, 302);
    }
  }

  return await ctx.next();
}
