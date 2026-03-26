import { App, staticFiles } from "fresh";
import { define, type State } from "./utils.ts";

export const app = new App<State>();

app.use(staticFiles());

// Pass a shared value from a middleware
app.use(async (ctx) => {
  ctx.state.shared = "hello";

  // 1. Await the response from the server
  const resp = await ctx.next();

  // 2. Remove the strict CSP header specifically on the checkout route
  // so Paystack's dynamic inline scripts and blobs can execute. Please sort this out. Its a security risk but Paystack doesn't work without it. I've tried everything else.
  const url = new URL(ctx.req.url);
  if (url.pathname === "/checkout") {
    resp.headers.delete("Content-Security-Policy");
  }

  return resp;
});

// this is the same as the /api/:name route defined via a file. feel free to delete this!
app.get("/api2/:name", (ctx) => {
  const name = ctx.params.name;
  return new Response(
    `Hello, ${name.charAt(0).toUpperCase() + name.slice(1)}!`,
  );
});

// this can also be defined via a file. feel free to delete this!
const exampleLoggerMiddleware = define.middleware((ctx) => {
  console.log(`${ctx.req.method} ${ctx.req.url}`);
  return ctx.next();
});
app.use(exampleLoggerMiddleware);

// Include file-system based routes here
app.fsRoutes();
