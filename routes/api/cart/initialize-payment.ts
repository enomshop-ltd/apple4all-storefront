import { define } from "../../../lib/utils.ts";
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

      const debugLog = async (msg: string, data?: any) => {
        const line = `[${new Date().toISOString()}] ${msg} ${data ? JSON.stringify(data) : ""}\n`;
        try {
          await Deno.writeTextFile("/tmp/medusa_checkout_debug.log", line, { append: true });
        } catch(e) {}
      };

      await debugLog("Starting initialize-payment for cart", cartId);
      await debugLog("Body received:", body);

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

      await debugLog("Cart after update:", updatedCart.id);

      let currentCart = updatedCart; // Use the freshly updated cart instead of existingCart

      // Step A: Fetch available shipping options for the Cart's updated region/address
      const { shipping_options } = await medusa.store.fulfillment.listCartOptions({ cart_id: cartId }, reqHeaders);
      
      let finalShippingOptionId = body.shipping_option_id;

      // Verify the provided option is still valid for this updated address
      const isValidOption = shipping_options && shipping_options.find(o => o.id === finalShippingOptionId);
      
      if (!isValidOption && shipping_options && shipping_options.length > 0) {
        // If invalid or none provided, fallback to the first available option for this address
        finalShippingOptionId = shipping_options[0].id;
      }

      if (finalShippingOptionId) {
        try {
          await debugLog("Attempting to add valid shipping method:", finalShippingOptionId);
          // Step B: Attach the selected option to the Cart
          const { cart } = await medusa.store.cart.addShippingMethod(
            cartId,
            { option_id: finalShippingOptionId },
            { fields: "*shipping_methods" },
            reqHeaders,
          );
          currentCart = cart;
          await debugLog("Successfully added shipping method. Cart now has methods:", cart.shipping_methods);
        } catch (err: any) {
          console.error("Failed to add shipping method:", err);
          const detail = err?.response?.data?.message || err?.message || "";
          await debugLog("Failed to add shipping method error:", detail);
          throw new Error(`Failed to add shipping method: ${detail}`);
        }
      }

      const providerId = body.payment_method || "pp_system_default";

      // FIX: Destructure `payment_collection` directly from the response
      const { payment_collection } = await medusa.store.payment
        .initiatePaymentSession(
          currentCart,
          {
            provider_id: providerId,
            data: {
              email: body.email,
              cart_id: currentCart.id,
              callback_url: body.callback_url,
            },
          },
          {},
          reqHeaders,
        );

      // Attach the returned payment collection to the cart object
      // so the frontend still receives the complete cart state
      currentCart.payment_collection = payment_collection;

      // Extract the initialized payment session data if needed
      const paymentSession = payment_collection?.payment_sessions?.find((
        s: { provider_id: string; data: unknown },
      ) => s.provider_id === providerId);

      return new Response(
        JSON.stringify({
          success: true,
          cart: currentCart, // <-- Return currentCart instead of cartWithPayment
          paymentSession: paymentSession?.data || {},
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (e: unknown) {
      console.error("Initialize payment error:", e);
      // Safely unwrap the error message if it's an API wrapper error
      const errMsg =
        (e as { response?: { data?: { message?: string } }; message?: string })
          ?.response?.data?.message ||
        (e as { message?: string })?.message ||
        "Failed to initialize payment";
      return new Response(JSON.stringify({ error: errMsg }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});
