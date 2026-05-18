import { define } from "../utils.ts";
import { Header } from "../components/Header.tsx";
import { Footer } from "../components/Footer.tsx";
import { Partial } from "fresh/runtime";
import TopProgressBarIsland from "../islands/TopProgressBarIsland.tsx";

export default define.page(function App({ Component, state }) {
  const title = (state.title as string) || "Apple4All - Refurbished Tech";
  const description =
    (state.description as string) ||
    "Discover certified refurbished devices and unbeatable prices on both new and pre-owned Apple products.";

  console.log("App state categories:", state?.categories);

  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="view-transition" content="same-origin" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="Apple4All - Refurbished Tech" />
        <meta
          property="og:description"
          content="Discover certified refurbished devices and unbeatable prices on both new and pre-owned Apple products."
        />
        <meta property="og:type" content="website" />
      </head>
      <body
        f-client-nav
        f-view-transition
        class="min-h-screen bg-[#F9FAFB] font-sans text-gray-900 flex flex-col"
      >
        <TopProgressBarIsland />
        <Header categories={(state?.categories as any[]) || []} />
        <Partial name="main">
          <Component />
        </Partial>
        <Footer />
      </body>
    </html>
  );
});
