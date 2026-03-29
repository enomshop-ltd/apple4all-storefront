import { define } from "../../../../utils.ts";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";

export const handler = define.handlers({
  POST: async (ctx) => {
    try {
      const orderId = ctx.params.id;
      const body = await ctx.req.json();
      
      const cookies = getCookies(ctx.req.headers);
      const token = cookies["_medusa_jwt"];

      const backendUrl = Deno.env.get("MEDUSA_BACKEND_URL") || "http://localhost:9000";
      const publishableKey = Deno.env.get("MEDUSA_PUBLISHABLE_KEY") || "";

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "x-publishable-api-key": publishableKey,
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Forward to your custom Medusa plugin route
      const response = await fetch(`${backendUrl}/store/orders/${orderId}/paystack-payment`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return new Response(JSON.stringify({ error: errorData.message || "Failed to initialize installment" }), {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        });
      }

      const data = await response.json();
      
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});