import { define } from "../utils.ts";
import { Checkout } from "../islands/Checkout.tsx";
import { medusa } from "../lib/sdk.ts";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";
import { HttpTypes } from "@medusajs/types";
import { page } from "fresh";
import { Head } from "fresh/runtime";

export const handler = define.handlers({
  async GET(ctx) {
    let cart = null;
    let customer = null;
    let shippingOptions = [];
    const cookies = getCookies(ctx.req.headers);
    const cartId = cookies["_medusa_cart_id"];
    const token = cookies["_medusa_jwt"];

    if (cartId) {
      try {
        const headers: Record<string, string> = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const res = await medusa.store.cart.retrieve(cartId, {
          fields:
            "*items,*items.variant,*items.variant.product,*shipping_address,*billing_address,*region,*region.countries",
        }, headers);
        cart = res.cart;

        // Fetch customer data and addresses if logged in
        if (token) {
          try {
            const response = await medusa.store.customer.retrieve({
              fields: "*addresses",
            }, headers);
            customer = response.customer;
          } catch (e) {
            console.error(
              "User not authenticated or error fetching customer",
              e,
            );
          }
        }

        // Fetch available delivery methods
        const { shipping_options } = await medusa.store.fulfillment
          .listCartOptions({ cart_id: cartId }, headers);
        shippingOptions = shipping_options || [];
      } catch (e) {
        console.error("Error fetching cart/addresses for checkout:", e);
      }
    }

    if (!cart) {
      return new Response("", {
        status: 302,
        headers: { Location: "/cart" },
      });
    }

    ctx.state.cart = cart;
    ctx.state.title = `Checkout - Apple4All`;
    ctx.state.description = `Complete your purchase securely at Apple4All.`;

    return page({ cart, customer, shippingOptions });
  },
});

export default define.page(function CheckoutPage(props) {
  const { cart, customer, shippingOptions } = props.data as {
    cart: HttpTypes.StoreCart;
    customer: HttpTypes.StoreCustomer | null;
    shippingOptions: unknown[];
  };

  return (
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
      <Head>
        <title>{props.state.title as string}</title>
        <meta name="description" content={props.state.description as string} />
      </Head>
      <h1 class="text-3xl font-bold mb-8">Checkout</h1>
      <Checkout
        initialCart={cart}
        customer={customer}
        shippingOptions={shippingOptions}
      />
    </main>
  );
});
