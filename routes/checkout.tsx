import { define } from "../lib/utils.ts";
import Checkout from "../islands/Checkout.tsx";
import { medusa } from "../lib/sdk.ts";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";
import { HttpTypes } from "@medusajs/types";
import { page } from "fresh";
import { Head } from "fresh/runtime";
import { STORE_NAME } from "../lib/utils.ts";

export const handler = define.handlers({
  async GET(ctx) {
    let cart = null;
    let customer = null;
    let shippingOptions: any[] = [];
    let paymentProviders: any[] = [];
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
        const { shipping_options: rawOptions } = await medusa.store.fulfillment
          .listCartOptions({ cart_id: cartId }, headers);
        
        shippingOptions = rawOptions?.filter((o: any) => o.amount !== null && o.amount !== undefined) || [];

        // Fetch payment providers
        paymentProviders = [];
        const envProviders = Deno.env.get("PAYMENT_PROVIDERS");
        
        if (envProviders) {
          // Format expected: "pp_system_default:Pay on Delivery,pp_paystack_paystack:Paystack"
          try {
            paymentProviders = envProviders.split(",").map(p => {
              const [id, ...nameParts] = p.split(":");
              return { id: id.trim(), name: nameParts.join(":").trim() || id.trim() };
            }).filter(p => p.id);
          } catch(e) {
            console.error("Error parsing PAYMENT_PROVIDERS env var", e);
          }
        } else {
          try {
            const { payment_providers } = await medusa.store.payment.listPaymentProviders({ region_id: cart.region_id }, headers);
            paymentProviders = (payment_providers || []).map((p: any) => {
              let name = p.id;
              if (p.id.includes("manual") || p.id === "pp_system_default") {
                name = "Pay on Delivery (Manual)";
              } else if (p.id.includes("paystack")) {
                name = "Paystack";
              } else if (p.id.includes("stripe")) {
                name = "Credit Card (Stripe)";
              }
              return { id: p.id, name };
            });
          } catch (e) {
            console.error("Error fetching payment providers", e);
          }
        }
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
    ctx.state.title = `Checkout - ${STORE_NAME}`;
    ctx.state.description = `Complete your purchase securely at {STORE_NAME}.`;

    return page({ cart, customer, shippingOptions, paymentProviders });
  },
});

export default define.page(function CheckoutPage(props) {
  const { cart, customer, shippingOptions, paymentProviders } = props.data as {
    cart: HttpTypes.StoreCart;
    customer: HttpTypes.StoreCustomer | null;
    shippingOptions: unknown[];
    paymentProviders: unknown[];
  };

  return (
    <main class="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
      <Head>
        <title>{props.state.title as string}</title>
        <meta name="description" content={props.state.description as string} />
      </Head>
      <h1 class="text-3xl font-bold mb-8">Checkout</h1>
      <Checkout
        initialCart={cart}
        customer={customer}
        shippingOptions={shippingOptions}
        paymentProviders={paymentProviders}
      />
    </main>
  );
});
