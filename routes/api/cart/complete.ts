import { define } from "../../../utils.ts";
import { medusa } from "../../../lib/sdk.ts";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";

export const handler = define.handlers({
  POST: async (ctx) => {
    try {
      const cookies = getCookies(ctx.req.headers);
      const cartId = cookies["_medusa_cart_id"];
      const token = cookies["_medusa_jwt"];

      if (!cartId) {
        return new Response(JSON.stringify({ error: "Cart not found" }), {
          status: 404,
        });
      }

      const reqHeaders: Record<string, string> = {};
      if (token) {
        reqHeaders.Authorization = `Bearer ${token}`;
      }

      let body: any = {};
      const text = await ctx.req.text();
      if (text) {
        try { body = JSON.parse(text); } catch (e) {}
      }

      // If we received transaction data, update the payment session to guarantee the backend has the reference
      if (body.transaction && body.transaction.reference) {
        try {
          const { cart } = await medusa.store.cart.retrieve(cartId, { fields: "*payment_collection,*payment_collection.payment_sessions" }, reqHeaders);
          const session = cart.payment_collection?.payment_sessions?.find((s: any) => s.provider_id.includes("paystack"));
          
          if (session) {
            await medusa.store.payment.initiatePaymentSession(
              cart,
              {
                provider_id: session.provider_id,
                data: {
                  ...session.data,
                  reference: body.transaction.reference,
                  transaction: body.transaction
                }
              },
              {},
              reqHeaders
            );
          }
        } catch (err) {
          console.warn("Could not update session before complete:", err);
        }
      }

      // Complete cart to create order (Initialization is now handled by /initialize-payment API)
      const result = await medusa.store.cart.complete(cartId, {}, reqHeaders);

      if (result.type === "cart") {
        return new Response(
          JSON.stringify({
            error: result.error?.message || "Failed to complete checkout",
            cart: result.cart,
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Clear cart cookie
      const headers = new Headers();
      headers.set("Content-Type", "application/json");
      headers.set(
        "Set-Cookie",
        `_medusa_cart_id=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
      );

      return new Response(
        JSON.stringify({ type: result.type, order: result.order }),
        {
          status: 200,
          headers,
        },
      );
    } catch (e: unknown) {
      console.error("Checkout error:", e);
      return new Response(
        JSON.stringify({
          error: e instanceof Error ? e.message : "Failed to complete checkout",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },
});
