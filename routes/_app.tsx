import { define } from "../utils.ts";
import { Partial } from "fresh/runtime";

export default define.page(function App({ Component }) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Apple4All - Refurbished Tech</title>
        <meta name="description" content="Discover certified refurbished devices and unbeatable prices on both new and pre-owned Apple products." />
        <meta property="og:title" content="Apple4All - Refurbished Tech" />
        <meta property="og:description" content="Discover certified refurbished devices and unbeatable prices on both new and pre-owned Apple products." />
        <meta property="og:type" content="website" />
      </head>
      <body f-client-nav>
        <Partial name="body">
          <Component />
        </Partial>
      </body>
    </html>
  );
});
