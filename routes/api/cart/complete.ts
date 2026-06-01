import { define } from "../../../lib/utils.ts";
import { medusa } from "../../../lib/sdk.ts";
import { getCookies } from "jsr:@std/http@0.224.0/cookie";

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

      // Directly complete the cart.
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
