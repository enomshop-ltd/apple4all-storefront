import { define } from "../../../utils.ts";
import { medusa } from "../../../lib/sdk.ts";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";

export const handler = define.handlers({
  POST: async (ctx) => {
    try {
      const cookies = getCookies(ctx.req.headers);
      const cartId = cookies["_medusa_cart_id"];
      const token = cookies["_medusa_jwt"];
      const body = await ctx.req.json();

      if (!cartId) {
        return new Response(JSON.stringify({ error: "Cart not found" }), {
          status: 404,
        });
      }

      const reqHeaders: Record<string, string> = {};
      if (token) {
        reqHeaders.Authorization = `Bearer ${token}`;
      }

      const { cart: existingCart } = await medusa.store.cart.retrieve(cartId, {
        fields: "*region",
      }, reqHeaders);

      // FIX 1: Capture the result of the cart update to ensure we aren't using a stale cart object
      const { cart: updatedCart } = await medusa.store.cart.update(
        cartId,
        {
          email: body.email,
          shipping_address: body.shipping_address,
          billing_address: body.shipping_address,
          region_id: existingCart.region_id,
        },
        {},
        reqHeaders,
      );

      let currentCart = updatedCart; // Use the freshly updated cart instead of existingCart

      if (body.shipping_option_id) {
        try {
          const { cart } = await medusa.store.cart.addShippingMethod(
            cartId,
            {
              option_id: body.shipping_option_id,
            },
            {},
            reqHeaders,
          );
          currentCart = cart;
        } catch (err) {
          console.warn("Shipping method may already exist", err);
          const { cart } = await medusa.store.cart.retrieve(
            cartId,
            {},
            reqHeaders,
          );
          currentCart = cart;
        }
      } else {
        const { shipping_options } = await medusa.store.fulfillment
          .listCartOptions({ cart_id: cartId }, reqHeaders);
        if (shipping_options && shipping_options.length > 0) {
          try {
            const { cart } = await medusa.store.cart.addShippingMethod(
              cartId,
              {
                option_id: shipping_options[0].id,
              },
              {},
              reqHeaders,
            );
            currentCart = cart;
          } catch (err) {
            const { cart } = await medusa.store.cart.retrieve(
              cartId,
              {},
              reqHeaders,
            );
            currentCart = cart;
          }
        }
      }

      const providerId = body.payment_method === "paystack" ||
          body.payment_method === "pp_paystack"
        ? "pp_paystack"
        : "pp_system_default";

      // FIX: Destructure `payment_collection` directly from the response
      const { payment_collection } = await medusa.store.payment
        .initiatePaymentSession(
          currentCart,
          {
            provider_id: providerId,
            data: { email: body.email },
          },
          {},
          reqHeaders,
        );

      // Attach the returned payment collection to the cart object 
      // so the frontend still receives the complete cart state
      currentCart.payment_collection = payment_collection;

      // Extract the initialized Paystack session data
      const paymentSession = payment_collection?.payment_sessions?.find((
        s: { provider_id: string; data: unknown },
      ) => s.provider_id === providerId);

      return new Response(
        JSON.stringify({
          success: true,
          cart: currentCart, // <-- Return currentCart instead of cartWithPayment
          paymentSession: paymentSession?.data || {},
          publicKey: Deno.env.get("PAYSTACK_PUBLIC_KEY") || "",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (e: unknown) {
      console.error("Initialize payment error:", e);
      // Safely unwrap the error message if it's an API wrapper error
      const errMsg = (e as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || (e as { message?: string })?.message ||
        "Failed to initialize payment";
      return new Response(JSON.stringify({ error: errMsg }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});
