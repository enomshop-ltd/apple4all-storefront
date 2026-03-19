import { Head } from "fresh/runtime";
import { Partial } from "fresh/runtime";
import { define } from "../utils.ts";
import { Header } from "../components/Header.tsx";
import { Footer } from "../components/Footer.tsx";
import Shop from "../islands/Shop.tsx";

export default define.page(function StorePage() {
  return (
    <div class="min-h-screen bg-[#F9FAFB] font-sans text-gray-900 flex flex-col">
      <Head>
        <title>Store - Apple4All</title>
        <meta name="description" content="Shop all our refurbished tech products." />
        <meta property="og:title" content="Store - Apple4All" />
        <meta property="og:description" content="Shop all our refurbished tech products." />
      </Head>

      <Header />

      <Partial name="main">
        <main class="flex-1">
          <Shop />
        </main>
      </Partial>

      <Footer />
    </div>
  );
});
