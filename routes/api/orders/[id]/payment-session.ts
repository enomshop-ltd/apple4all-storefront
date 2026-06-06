import { define } from "../../../../lib/utils.ts";
import { medusa } from "../../../../lib/sdk.ts";
import { getCookies } from "jsr:@std/http@0.224.0/cookie";

export const handler = define.handlers({
  POST: async (ctx) => {
    try {
      const cookies = getCookies(ctx.req.headers);
      const token = cookies["_medusa_jwt"];
      const orderId = ctx.params.id;
      const body = await ctx.req.json();
      
      if (!token) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
      }

      const providerId = body.payment_method;
      if (!providerId) {
        return new Response(JSON.stringify({ error: "payment_method is required" }), { status: 400 });
      }

      const reqHeaders: Record<string, string> = {
        Authorization: `Bearer ${token}`
      };

      // 1. Fetch order to get its active payment collection
      const { order } = await medusa.store.order.retrieve(
        orderId,
        { fields: "*payment_collections,*payment_collections.payment_sessions" },
        reqHeaders
      );

      if (!order) {
        return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
      }

      // 2. Find the active payment collection (one that is not fully paid)
      // Usually it's the last one or the one with a pending amount
      let paymentCollectionId = order.payment_collections?.[0]?.id;

      if (!paymentCollectionId) {
        return new Response(JSON.stringify({ error: "No payment collection found on this order" }), { status: 400 });
      }

      // 3. We must initiate a payment session on this collection
      // Since SDK might not expose this directly, we use the client request
      // POST /store/payment-collections/:id/payment-sessions
      const response = await medusa.client.request(
        "POST",
        `/store/payment-collections/${paymentCollectionId}/payment-sessions`,
        {
          payload: {
            provider_id: providerId,
            data: {
               order_id: orderId,
            }
          },
          headers: reqHeaders
        }
      );

      const payment_collection = response.payment_collection;

      const paymentSession = payment_collection?.payment_sessions?.find(
        (s: any) => s.provider_id === providerId
      );

      return new Response(
        JSON.stringify({
          success: true,
          paymentSession: paymentSession?.data || {},
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (e: unknown) {
      console.error("Order payment session error:", e);
      const errMsg =
        (e as { response?: { data?: { message?: string } }; message?: string })
          ?.response?.data?.message ||
        (e as { message?: string })?.message ||
        "Failed to initialize order payment session";
      return new Response(JSON.stringify({ error: errMsg }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});
