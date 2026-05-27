import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import Shop from "../islands/Shop.tsx";
import { STORE_NAME } from "../utils.ts";

export default define.page(function StorePage() {
  return (
    <main class="flex-1">
      <Head>
        <title>Store - {STORE_NAME}</title>
        <meta
          name="description"
          content="Shop all our refurbished tech products."
        />
        <meta property="og:title" content={`Store - ${STORE_NAME}`} />
        <meta
          property="og:description"
          content="Shop all our refurbished tech products."
        />
      </Head>

      <Shop />
    </main>
  );
});
