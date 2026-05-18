import { define } from "../../../utils.ts";
import { medusa } from "../../../lib/sdk.ts";

export const handler = define.handlers({
  POST: async (ctx) => {
    try {
      const { email, password } = await ctx.req.json();

      // Medusa v2 authentication
      const result = await medusa.auth.login("customer", "emailpass", {
        email,
        password,
      });

      if (typeof result !== "string") {
        return new Response(JSON.stringify({ error: "Invalid credentials" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      const token = result;

      const cookies = ctx.req.headers.get("cookie");
      let cartId = null;
      if (cookies) {
        const matches = cookies.match(/_medusa_cart_id=([^;]+)/);
        if (matches) cartId = matches[1];
      }

      if (cartId) {
        try {
          const { customer } = await medusa.store.customer.retrieve(
            {},
            { Authorization: `Bearer ${token}` },
          );

          if (customer?.id) {
            await medusa.store.cart.update(
              cartId,
              { customer_id: customer.id, email: customer.email },
              { Authorization: `Bearer ${token}` },
            );
          }
        } catch (err) {
          console.error("Failed to associate cart with customer:", err);
        }
      }

      // Set cookie
      const headers = new Headers();
      headers.set("Content-Type", "application/json");
      headers.set(
        "Set-Cookie",
        `_medusa_jwt=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`,
      );

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers,
      });
    } catch (e: unknown) {
      console.error("Login error:", e);
      return new Response(
        JSON.stringify({
          error: e instanceof Error ? e.message : "Login failed",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },
});
