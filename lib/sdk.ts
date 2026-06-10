import Medusa from "@medusajs/js-sdk";

// Use environment variables for configuration
const PUBLISHABLE_KEY = globalThis.Deno?.env?.get("MEDUSA_PUBLISHABLE_KEY");
const BACKEND_URL = globalThis.Deno?.env?.get("MEDUSA_BACKEND_URL") || "http://localhost:9000";

const isProd = globalThis.Deno?.env?.get("DENO_ENV") === "production" ||
  globalThis.Deno?.env?.get("NODE_ENV") === "production";

if (isProd && (!PUBLISHABLE_KEY || !BACKEND_URL)) {
  throw new Error(
    "CRITICAL: MEDUSA_PUBLISHABLE_KEY and MEDUSA_BACKEND_URL environment variables must be set in production.",
  );
}

export const medusaUrl = BACKEND_URL!;

// Initialize the Medusa SDK for v2
// The publishableKey passed here is automatically included in all Storefront API requests
export const medusa = new Medusa({
  baseUrl: medusaUrl,
  publishableKey: PUBLISHABLE_KEY ||
    "pk_",
  debug: false,
});
