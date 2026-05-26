import { FreshContext } from "fresh";

export const handler = {
  GET(ctx: FreshContext) {
    return Response.redirect(new URL("/services/repairs", ctx.req.url).href, 302);
  },
};
