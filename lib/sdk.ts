import Medusa from "@medusajs/js-sdk";

// Use environment variables for configuration
const PUBLISHABLE_KEY = globalThis.Deno?.env?.get("MEDUSA_PUBLISHABLE_KEY");
const BACKEND_URL = globalThis.Deno?.env?.get("MEDUSA_BACKEND_URL");

const isProd = globalThis.Deno?.env?.get("DENO_ENV") === "production" ||
  globalThis.Deno?.env?.get("NODE_ENV") === "production";

if (isProd && (!PUBLISHABLE_KEY || !BACKEND_URL)) {
  throw new Error(
    "CRITICAL: MEDUSA_PUBLISHABLE_KEY and MEDUSA_BACKEND_URL environment variables must be set in production.",
  );
}

// Initialize the Medusa SDK for v2
// The publishableKey passed here is automatically included in all Storefront API requests
export const medusa = new Medusa({
  baseUrl: BACKEND_URL || "http://localhost:9000",
  publishableKey: PUBLISHABLE_KEY ||
    "pk_18a6d80c3b15f3c67c33a0cec589d3865dc023f338da36463d3b72205290870c",
  debug: false,
});
