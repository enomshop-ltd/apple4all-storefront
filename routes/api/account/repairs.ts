import { define } from "../../../utils.ts";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";

export const handler = define.handlers({
  GET: async (ctx) => {
    try {
      const cookies = getCookies(ctx.req.headers);
      const token = cookies["_medusa_jwt"];

      if (!token) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      const backendUrl = Deno.env.get("MEDUSA_BACKEND_URL")!.replace(/\/$/, "");
      const pubKey = Deno.env.get("MEDUSA_PUBLISHABLE_KEY") || "";

      // We attach BOTH the customer auth token and the publishable API key
      const response = await fetch(`${backendUrl}/store/customers/me/repairs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "x-publishable-api-key": pubKey,
        },
      });

      if (!response.ok) {
        return new Response(await response.text(), {
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
      console.error("[Fresh API] Error fetching repairs proxy:", e);
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});