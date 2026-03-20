import { Partial } from "fresh/runtime";
import { define } from "../utils.ts";
import { Head } from "fresh/runtime";
import { Header } from "../components/Header.tsx";
import { Footer } from "../components/Footer.tsx";
import { Checkout } from "../islands/Checkout.tsx";
import { medusa } from "../lib/sdk.ts";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";
import { HttpTypes } from "@medusajs/types";

export const handler = define.handlers({
  async GET(ctx) {
    let cart = null;
    const cookies = getCookies(ctx.req.headers);
    const cartId = cookies["_medusa_cart_id"];

    if (cartId) {
      try {
        const res = await medusa.store.cart.retrieve(cartId, {
          fields: "*items,*items.variant,*items.variant.product,*shipping_address,*billing_address,*region"
        });
        cart = res.cart;
      } catch (e) {
        console.error("Error fetching cart for checkout:", e);
      }
    }

    if (!cart) {
      return new Response("", {
        status: 302,
        headers: { Location: "/cart" },
      });
    }

    ctx.state.cart = cart;
    return ctx.render();
  }
});

export default define.page(function CheckoutPage(ctx) {
  const cart = ctx.state.cart as HttpTypes.StoreCart;

  return (
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <Head>
        <title>Checkout - Apple4All</title>
        <meta name="description" content="Complete your purchase securely at Apple4All." />
      </Head>
      <Header />
      <Partial name="main">
        <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
          <h1 class="text-3xl font-bold mb-8">Checkout</h1>
          <Checkout initialCart={cart} />
        </main>
      </Partial>
      <Footer />
    </div>
  );
});