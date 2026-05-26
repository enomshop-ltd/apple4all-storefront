import { FreshContext } from "fresh";

export const handler = {
  GET(_req: Request, ctx: FreshContext) {
    return Response.redirect(new URL("/services/repairs", _req.url).href, 302);
  },
};
