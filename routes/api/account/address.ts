import { define } from "../../../lib/utils.ts";
import { medusa } from "../../../lib/sdk.ts";
import { getCookies } from "jsr:@std/http@0.224.0/cookie";

export const handler = define.handlers({
  POST: async (ctx) => {
    try {
      const cookies = getCookies(ctx.req.headers);
      const token = cookies["_medusa_jwt"];

      if (!token) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
        });
      }

      const body = await ctx.req.json();
      
      let customer;
      // if address id provided, update
      if (body.id) {
        const addressId = body.id;
        delete body.id;
        const res = await medusa.store.customer.updateAddress(addressId, body, undefined, {
          Authorization: `Bearer ${token}`,
        });
        customer = res.customer;
      } else {
        const res = await medusa.store.customer.createAddress(body, undefined, {
          Authorization: `Bearer ${token}`,
        });
        customer = res.customer;
      }

      return new Response(JSON.stringify({ customer }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e: unknown) {
      console.error("Address update error:", e);
      return new Response(
        JSON.stringify({
          error: e instanceof Error ? e.message : "Update failed",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },
});
