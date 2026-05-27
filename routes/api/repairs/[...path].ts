import { define } from "../../../lib/utils.ts";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";

async function proxyRepairRequest(ctx: any) {
  const req = ctx.req;
  const path = ctx.params.path || "";
  const url = new URL(req.url);
  
  const backendUrl = Deno.env.get("MEDUSA_BACKEND_URL")?.replace(/\/$/, "") || "http://localhost:9000";
  const pubKey = Deno.env.get("MEDUSA_PUBLISHABLE_KEY") || "";
  
  // Reconstruct the target URL, preserving any query parameters
  const targetUrl = `${backendUrl}/store/repairs/${path}${url.search}`;
  
  console.debug(`[Catch-All Proxy] 🔄 Forwarding ${req.method} request to: ${targetUrl}`);

  const cookies = getCookies(req.headers);
  const token = cookies["_medusa_jwt"];
  
  const headers = new Headers();
  headers.set("x-publishable-api-key", pubKey);
  
  // Attach content type if it exists
  if (req.headers.has("Content-Type")) {
    headers.set("Content-Type", req.headers.get("Content-Type")!);
  } else {
    headers.set("Content-Type", "application/json");
  }
  
  // Attach user auth if logged in to prevent 401s
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const fetchOptions: RequestInit = {
      method: req.method,
      headers,
    };

    // Forward the body for POST/PUT requests
    if (req.method !== "GET" && req.method !== "HEAD") {
      fetchOptions.body = await req.text();
    }

    const response = await fetch(targetUrl, fetchOptions);

    console.debug(`[Catch-All Proxy] 📥 Medusa responded with status: ${response.status}`);

    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", response.headers.get("Content-Type") || "application/json");
    
    // Critical for allowing PDF Quote/Invoice downloads to pass through
    if (response.headers.has("Content-Disposition")) {
      responseHeaders.set("Content-Disposition", response.headers.get("Content-Disposition")!);
    }

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error(`[Catch-All Proxy] ❌ Error forwarding to /store/repairs/${path}:`, error);
    return new Response(JSON.stringify({ error: "Internal Proxy Error" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// Fresh v2.3 compliant handler definition
export const handler = define.handlers({
  GET: proxyRepairRequest,
  POST: proxyRepairRequest,
  PUT: proxyRepairRequest,
  DELETE: proxyRepairRequest,
});