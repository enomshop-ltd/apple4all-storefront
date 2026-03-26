import { define } from "../../utils.ts";
import { medusa } from "../../lib/sdk.ts";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";
import { HttpTypes } from "@medusajs/types";
import { page } from "fresh";
import OrderStatusBadge from "@/islands/OrderStatusBadge.tsx";

export const handler = define.handlers({
  async GET(ctx) {
    const cookies = getCookies(ctx.req.headers);
    const token = cookies["_medusa_jwt"];

    if (!token) {
      return new Response("", { status: 302, headers: { Location: "/login" } });
    }

    try {
      const { orders } = await medusa.store.order.list({}, {
        Authorization: `Bearer ${token}`,
      });
      ctx.state.orders = orders;
      ctx.state.title = "Order History - Apple4All";
      ctx.state.description = "View your past orders and their status.";

      // 1. debug data
      //const { regions } = await medusa.store.region.list();
      //const regionId = regions?.[0]?.id;
      //const providers = regionId ? await medusa.store.payment.listPaymentProviders({ region_id: regionId }): [];
      //console.log("Medusa SDK providers", providers);

      // 2. Pass data explicitly to the page component
      return page(orders);
    } catch {
      const headers = new Headers();
      headers.set("Location", "/login");
      headers.set(
        "Set-Cookie",
        `_medusa_jwt=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
      );
      return new Response("", {
        status: 302,
        headers,
      });
    }
  },
});

export default define.page(function OrdersPage(props) {
  const orders = props.data as { orders: HttpTypes.StoreOrder[] };

  return (
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 class="text-xl font-semibold mb-4">Order History</h2>
      {orders.length === 0
        ? <p class="text-gray-500">You haven't placed any orders yet.</p>
        : (
          <div class="space-y-4">
            {orders.map((order: HttpTypes.StoreOrder) => (
              <a
                href={`/account/orders/${order.id}`}
                f-client-nav
                key={order.id}
                class="block border-b pb-4 hover:bg-gray-50 transition-colors p-4 rounded-lg -mx-4"
              >
                <div class="flex justify-between items-center">
                  <div>
                    <p class="font-medium text-blue-600 hover:underline">
                      Order #{order.display_id}
                    </p>
                    <p class="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div class="text-right">
                    <OrderStatusBadge initialOrder={order} />
                    <p class="text-sm font-medium text-gray-900">
                      ${(order.total / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
    </div>
  );
});
