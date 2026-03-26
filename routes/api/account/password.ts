import { define } from "../../../utils.ts";
import { medusa } from "../../../lib/sdk.ts";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";

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

      // In Medusa v2, updating password might require a specific auth endpoint or customer update
      // We attempt to update the auth identity first, falling back to customer update if needed.
      try {
        await medusa.auth.updateProvider("customer", "emailpass", {
          password: body.new_password,
        }, token);
      } catch (authError) {
        console.warn(
          "Auth update failed, falling back to customer update",
          authError,
        );
        await medusa.store.customer.update(
          {
            password: body.new_password,
          },
          {},
          {
            Authorization: `Bearer ${token}`,
          },
        );
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e: unknown) {
      console.error("Password update error:", e);
      return new Response(
        JSON.stringify({
          error: e instanceof Error ? e.message : "Failed to update password",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },
});
