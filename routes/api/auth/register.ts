import { define } from "../../../utils.ts";
import { medusa } from "../../../lib/sdk.ts";

export const handler = define.handlers({
  POST: async (ctx) => {
    try {
      const body = await ctx.req.json();

      const regResult = await medusa.auth.register("customer", "emailpass", {
        email: body.email,
        password: body.password,
      });

      const token =
        typeof regResult === "string" ? regResult : (regResult as any).token;

      if (!token) {
        throw new Error("Registration failed - no token returned");
      }

      // Create the customer record using the registration token
      await medusa.store.customer.create(
        {
          email: body.email,
          first_name: body.first_name,
          last_name: body.last_name,
        },
        {},
        {
          Authorization: `Bearer ${token}`,
        },
      );

      const headers = new Headers();
      headers.set("Content-Type", "application/json");
      headers.set(
        "Set-Cookie",
        `_medusa_jwt=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`,
      );

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers,
      });
    } catch (e: unknown) {
      console.error("Registration error:", e);
      return new Response(
        JSON.stringify({
          error: e instanceof Error ? e.message : "Failed to register",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },
});
