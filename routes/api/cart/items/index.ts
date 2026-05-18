import { define } from "../../../../utils.ts";
import { medusa } from "../../../../lib/sdk.ts";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";

export const handler = define.handlers({
  POST: async (ctx) => {
    try {
      const cookies = getCookies(ctx.req.headers);
      let cartId = cookies["_medusa_cart_id"];
      const token = cookies["_medusa_jwt"];
      const body = await ctx.req.json();

      const reqHeaders: Record<string, string> = {};
      if (token) {
        reqHeaders.Authorization = `Bearer ${token}`;
      }

      if (!cartId) {
        // Fetch region to get region_id
        const { regions } = await medusa.store.region.list();
        const region_id = regions?.[0]?.id;
        
        let customer_id;
        let email;
        
        if (token) {
            try {
               const { customer } = await medusa.store.customer.retrieve({}, { Authorization: `Bearer ${token}` });
               if (customer) {
                   customer_id = customer.id;
                   email = customer.email;
               }
            } catch (err) {
               console.error("Failed to retrieve customer for cart creation", err);
            }
        }

        // Create a new cart if one doesn't exist
        const res = await medusa.store.cart.create(
          { region_id, customer_id, email },
          {},
          reqHeaders,
        );
        cartId = res.cart.id;
      }

      const { cart } = await medusa.store.cart.createLineItem(
        cartId,
        {
          variant_id: body.variant_id,
          quantity: body.quantity,
        },
        {},
        reqHeaders,
      );

      const headers = new Headers();
      headers.set("Content-Type", "application/json");
      headers.set(
        "Set-Cookie",
        `_medusa_cart_id=${cartId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`,
      );

      return new Response(JSON.stringify({ cart }), {
        status: 200,
        headers,
      });
    } catch (e: unknown) {
      console.error("Cart item add error:", e);
      return new Response(
        JSON.stringify({
          error: e instanceof Error ? e.message : "Failed to add item",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },
});
