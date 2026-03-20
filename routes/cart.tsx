import { Partial } from "fresh/runtime";
import { define } from "../utils.ts";
import { Head } from "fresh/runtime";
import { Header } from "../components/Header.tsx";
import { Footer } from "../components/Footer.tsx";
import { Cart } from "../islands/Cart.tsx";
import { medusa } from "../lib/sdk.ts";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";
import { HttpTypes } from "@medusajs/types";

export default define.page(async function CartPage(ctx) {
  let cart: HttpTypes.StoreCart | null = null;

  try {
    const cookies = getCookies(ctx.req.headers);
    const cartId = cookies["_medusa_cart_id"];
    
    if (cartId) {
      const res = await medusa.store.cart.retrieve(cartId, {
        fields: "*items,*items.variant,*items.variant.product"
      });
      cart = res.cart;
    }
  } catch (e) {
    console.error("Failed to fetch cart", e);
  }

  return (
    <div class="min-h-screen bg-[#F9FAFB] font-sans text-gray-900 flex flex-col">
      <Head>
        <title>Cart - Apple4All</title>
        <meta name="description" content="View your shopping cart and proceed to checkout." />
      </Head>

      <Header />

      <Partial name="main">
        <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
          <h1 class="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          <Cart initialCart={cart} />
        </main>
      </Partial>

      <Footer />
    </div>
  );
});