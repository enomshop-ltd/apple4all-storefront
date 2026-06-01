import { define } from "../../../../lib/utils.ts";
import { medusa } from "../../../../lib/sdk.ts";
import { getCookies } from "jsr:@std/http@0.224.0/cookie";

export const handler = define.handlers({
  POST: async (ctx) => {
    try {
      const cookies = getCookies(ctx.req.headers);
      const cartId = cookies["_medusa_cart_id"];
      const token = cookies["_medusa_jwt"];
      const itemId = ctx.params.id;
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

      const { cart } = await medusa.store.cart.updateLineItem(
        cartId,
        itemId,
        {
          quantity: body.quantity,
        },
        {},
        reqHeaders,
      );

      return new Response(JSON.stringify({ cart }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e: unknown) {
      console.error("Cart item update error:", e);
      return new Response(
        JSON.stringify({
          error: e instanceof Error ? e.message : "Failed to update item",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },
  DELETE: async (ctx) => {
    try {
      const cookies = getCookies(ctx.req.headers);
      const cartId = cookies["_medusa_cart_id"];
      const token = cookies["_medusa_jwt"];
      const itemId = ctx.params.id;

      if (!cartId) {
        return new Response(JSON.stringify({ error: "Cart not found" }), {
          status: 404,
        });
      }

      const reqHeaders: Record<string, string> = {};
      if (token) {
        reqHeaders.Authorization = `Bearer ${token}`;
      }

      const { parent: cart } = await medusa.store.cart.deleteLineItem(
        cartId,
        itemId,
        {},
        reqHeaders,
      );

      return new Response(JSON.stringify({ cart }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e: unknown) {
      console.error("Cart item delete error:", e);
      return new Response(
        JSON.stringify({
          error: e instanceof Error ? e.message : "Failed to delete item",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },
});
