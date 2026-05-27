import { define } from "../../lib/utils.ts";
import { medusa } from "../../lib/sdk.ts";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";

export const handler = define.handlers({
  GET: async (ctx) => {
    try {
      const cookies = getCookies(ctx.req.headers);
      const cartId = cookies["_medusa_cart_id"];
      const token = cookies["_medusa_jwt"];

      if (!cartId) {
        return new Response(JSON.stringify({ cart: null }), { status: 200 });
      }

      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const { cart } = await medusa.store.cart.retrieve(cartId, {}, headers);

      return new Response(JSON.stringify({ cart }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e: unknown) {
      console.error("Cart retrieve error:", e);
      return new Response(
        JSON.stringify({
          error: e instanceof Error ? e.message : "Failed to retrieve cart",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },
  POST: async (ctx) => {
    try {
      const cookies = getCookies(ctx.req.headers);
      let cartId = cookies["_medusa_cart_id"];
      const token = cookies["_medusa_jwt"];
      const body = await ctx.req.json();

      let cart;
      const resHeaders = new Headers();
      resHeaders.set("Content-Type", "application/json");

      const reqHeaders: Record<string, string> = {};
      if (token) {
        reqHeaders.Authorization = `Bearer ${token}`;
      }

      if (!cartId) {
        let region_id = body.region_id;
        if (!region_id) {
          const { regions } = await medusa.store.region.list();
          region_id = regions?.[0]?.id;
        }
        
        let email;
        
        if (token) {
            try {
               const { customer } = await medusa.store.customer.retrieve({}, { Authorization: `Bearer ${token}` });
               if (customer) {
                   email = customer.email;
               }
            } catch (err) {
               console.error("Failed to retrieve customer for cart creation", err);
            }
        }

        // Create new cart
        const { cart: newCart } = await medusa.store.cart.create(
          {
            region_id,
            email
          },
          {},
          reqHeaders,
        );
        cart = newCart;
        cartId = cart.id;
        resHeaders.set(
          "Set-Cookie",
          `_medusa_cart_id=${cartId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`,
        );
      } else {
        // Retrieve existing cart
        const { cart: existingCart } = await medusa.store.cart.retrieve(
          cartId,
          {},
          reqHeaders,
        );
        cart = existingCart;
      }

      // Add item to cart
      if (body.variant_id && body.quantity) {
        const { cart: updatedCart } = await medusa.store.cart.createLineItem(
          cartId,
          {
            variant_id: body.variant_id,
            quantity: body.quantity,
          },
          {},
          reqHeaders,
        );
        cart = updatedCart;
      }

      return new Response(JSON.stringify({ cart }), {
        status: 200,
        headers: resHeaders,
      });
    } catch (e: unknown) {
      console.error("Cart update error:", e);
      return new Response(
        JSON.stringify({
          error: e instanceof Error ? e.message : "Failed to update cart",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },
});
