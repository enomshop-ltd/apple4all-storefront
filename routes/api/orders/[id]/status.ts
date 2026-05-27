import { define } from "../../../../lib/utils.ts"; // Adjust path to your utils.ts
import { HttpTypes } from "@medusajs/types";

export const handler = define.handlers({
  async GET(ctx) {
    const orderId = ctx.params.id;

    // IMPORTANT: Replace this with your actual Medusa SDK/Fetch logic
    // using your server-side environment variables (e.g., MEDUSA_BACKEND_URL)
    try {
      const backendUrl = Deno.env.get("MEDUSA_BACKEND_URL")!;
      const publishableKey = Deno.env.get("MEDUSA_PUBLISHABLE_KEY") || "";

      const response = await fetch(`${backendUrl}/store/orders/${orderId}`, {
        headers: {
          "x-publishable-api-key": publishableKey,
        },
      });

      if (!response.ok) {
        return new Response("Order not found", { status: 404 });
      }

      const data = await response.json();
      const order = data.order as HttpTypes.StoreOrder;

      // We only return the specific fields needed to calculate the status
      // to keep the payload incredibly small and fast.
      return new Response(
        JSON.stringify({
          status: order.status,
          payment_status: order.payment_status,
          fulfillment_status: order.fulfillment_status,
        }),
        { headers: { "Content-Type": "application/json" } },
      );
    } catch (error) {
      console.error("Failed to fetch order status:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
});
