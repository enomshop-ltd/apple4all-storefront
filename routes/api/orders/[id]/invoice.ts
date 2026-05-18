import { define } from "../../../../utils.ts";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const orderId = ctx.params.id;
    const cookies = getCookies(ctx.req.headers);
    const token = cookies["_medusa_jwt"];

    if (!token) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      const backendUrl = Deno.env.get("MEDUSA_BACKEND_URL") ||
        "http://localhost:9000";
      const publishableKey = Deno.env.get("MEDUSA_PUBLISHABLE_KEY") || "";

      const response = await fetch(
        `${backendUrl}/store/customers/me/orders/${orderId}/invoice`,
        {
          headers: {
            "x-publishable-api-key": publishableKey,
            "Authorization": `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return new Response(
          JSON.stringify({
            message: errorData.message ||
              "Invoice not found or not generated yet",
          }),
          {
            status: response.status,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      const data = await response.json();

      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Failed to fetch invoice:", error);
      return new Response(
        JSON.stringify({ message: "Internal Server Error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },
});
