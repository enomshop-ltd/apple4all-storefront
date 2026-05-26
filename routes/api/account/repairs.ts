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

      const backendUrl = Deno.env.get("MEDUSA_BACKEND_URL")!;

      const response = await fetch(`${backendUrl}/store/customers/me/repairs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
    } catch (e: unknown) {
      console.error("Fetch repairs error:", e);
      return new Response(
        JSON.stringify({
          error: e instanceof Error ? e.message : "Fetch repairs failed",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },
});
