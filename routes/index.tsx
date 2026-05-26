import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import Shop from "../islands/Shop.tsx";

export default define.page(function StorePage() {
  return (
    <main class="flex-1">
      <Head>
        <title>Store - Apple4All</title>
        <meta
          name="description"
          content="Shop all our refurbished tech products."
        />
        <meta property="og:title" content="Store - Apple4All" />
        <meta
          property="og:description"
          content="Shop all our refurbished tech products."
        />
      </Head>

      <Shop />
    </main>
  );
});
