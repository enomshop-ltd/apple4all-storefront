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
      const { customer } = await medusa.store.customer.create(
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

      const cookiesStr = ctx.req.headers.get("cookie");
      let cartId = null;
      if (cookiesStr) {
        const matches = cookiesStr.match(/_medusa_cart_id=([^;]+)/);
        if (matches) cartId = matches[1];
      }

      if (cartId && customer?.id) {
        try {
          await medusa.store.cart.update(
            cartId,
            { customer_id: customer.id, email: customer.email },
            { Authorization: `Bearer ${token}` },
          );
        } catch (err) {
          console.error("Failed to associate cart with new customer:", err);
        }
      }

      // Do not set the authentication cookie for auto-login
      const headers = new Headers();
      headers.set("Content-Type", "application/json");

      return new Response(
        JSON.stringify({
          success: true,
          message: "Registration successful. Please check your email and verify your account to log in.",
        }),
        {
          status: 200,
          headers,
        },
      );
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
