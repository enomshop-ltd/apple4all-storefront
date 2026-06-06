import { define } from "../lib/utils.ts";
import { Header } from "../components/Header.tsx";
import { Footer } from "../components/Footer.tsx";
import { Partial } from "fresh/runtime";
import TopProgressBarIsland from "../islands/TopProgressBarIsland.tsx";
import { STORE_NAME } from "../lib/utils.ts";

export default define.page(function App({ Component, state }) {
  const title = (state.title as string) || `${STORE_NAME} - More than a Mac Repair Shop`;
  const description =
    (state.description as string) ||
    "Discover certified refurbished devices and unbeatable prices on both new and pre-owned Apple products.";

  // console.log("App state categories:", state?.categories);

  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="view-transition" content="same-origin" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content={`${STORE_NAME} - More than a Mac Repair Shop`} />
        <meta
          property="og:description"
          content="Discover certified refurbished devices and unbeatable prices on both new and pre-owned Apple products."
        />
        <meta property="og:type" content="website" />
      </head>
      <body
        f-client-nav
        f-view-transition
        class={`min-h-screen bg-[#F6F7F8] font-sans text-gray-900 flex flex-col ${state?.hideLayout ? 'print:bg-white bg-white' : ''}`}
      >
        {!state?.hideLayout && <TopProgressBarIsland />}
        {!state?.hideLayout && (
          <Header 
            categories={(state?.categories as any[]) || []} 
            isLoggedIn={!!state?.isLoggedIn}
          />
        )}
        <Partial name="main">
          <Component />
        </Partial>
        {!state?.hideLayout && <Footer />}
      </body>
    </html>
  );
});
