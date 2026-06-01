import { define } from "../lib/utils.ts";
import { Head } from "fresh/runtime";
import Cart from "../islands/Cart.tsx";
import { medusa } from "../lib/sdk.ts";
import { getCookies } from "jsr:@std/http@0.224.0/cookie";
import { HttpTypes } from "@medusajs/types";
import { STORE_NAME } from "../lib/utils.ts";

export default define.page(async function CartPage(ctx) {
  let cart: HttpTypes.StoreCart | null = null;

  try {
    const cookies = getCookies(ctx.req.headers);
    const cartId = cookies["_medusa_cart_id"];
    const token = cookies["_medusa_jwt"];

    if (cartId) {
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await medusa.store.cart.retrieve(cartId, {
        fields: "*items,*items.variant,*items.variant.product",
      }, headers);
      cart = res.cart;
    }
  } catch (e) {
    console.error("Failed to fetch cart", e);
  }

  return (
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
      <Head>
        <title>Cart - {STORE_NAME}</title>
        <meta
          name="description"
          content="View your shopping cart and proceed to checkout."
        />
      </Head>

      <h1 class="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      <Cart initialCart={cart} />
    </main>
  );
});
