#!/usr/bin/env -S deno run -A --watch=static/,routes/

import "npm:preact@10.29.1/jsx-runtime";
import "npm:preact@10.29.1/jsx-dev-runtime";
import { Builder } from "fresh/dev";

const builder = new Builder();

if (Deno.args.includes("build")) {
  await builder.build();
} else {
  await builder.listen(() => import("./main.ts"));
}
