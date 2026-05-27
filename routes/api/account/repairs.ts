import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    console.debug("[Fresh API Proxy] 🔄 Intercepting request for customer repairs...");

    // 1. Grab environment variables (Server-side only, completely secure)
    const backendUrl = Deno.env.get("MEDUSA_BACKEND_URL")?.replace(/\/$/, "") || "http://localhost:9000";
    const publishableKey = Deno.env.get("MEDUSA_PUBLISHABLE_KEY");
    
    // 2. Extract the secure HttpOnly cookie from the incoming browser request
    const cookieHeader = req.headers.get("cookie");

    if (!publishableKey) {
      console.error("[Fresh API Proxy] ❌ MEDUSA_PUBLISHABLE_KEY is missing in the environment!");
      return new Response("Server configuration error", { status: 500 });
    }

    try {
      const targetUrl = `${backendUrl}/store/customers/me/repairs`;
      console.debug(`[Fresh API Proxy] 🚀 Forwarding request to: ${targetUrl}`);

      // 3. Forward the request to Medusa with BOTH the cookie and the API key
      const medusaRes = await fetch(targetUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": publishableKey,
          "cookie": cookieHeader || "", // This passes the customer auth session
        },
      });

      console.debug(`[Fresh API Proxy] 📥 Medusa responded with status: ${medusaRes.status}`);

      // 4. Pass the exact response (and status) back to the Island
      if (!medusaRes.ok) {
        const errorText = await medusaRes.text();
        console.error(`[Fresh API Proxy] ⚠️ Upstream error from Medusa:`, errorText);
        
        return new Response(errorText, { 
          status: medusaRes.status,
          headers: { "Content-Type": "application/json" }
        });
      }

      // 5. Success! Parse and return the data
      const data = await medusaRes.json();
      console.info(`[Fresh API Proxy] ✅ Successfully retrieved repair data. Sending to client.`);
      
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

    } catch (error) {
      console.error("[Fresh API Proxy] ❌ Network/Fetch exception:", error);
      return new Response(JSON.stringify({ error: "Failed to connect to backend system" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};