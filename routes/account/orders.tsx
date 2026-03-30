import { define } from "../../utils.ts";
import { medusa } from "../../lib/sdk.ts";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";
import { HttpTypes } from "@medusajs/types";
import { page } from "fresh";
import OrderStatusBadge from "@/islands/OrderStatusBadge.tsx";
import { formatAmount } from "../../lib/pricing.ts";
import { getUnifiedOrderNumber } from "../../lib/order-utils.ts";
import DownloadInvoiceButton from "@/islands/DownloadInvoiceButton.tsx";

export const handler = define.handlers({
  async GET(ctx) {
    const cookies = getCookies(ctx.req.headers);
    const token = cookies["_medusa_jwt"];

    if (!token) {
      return new Response("", { status: 302, headers: { Location: "/login" } });
    }

    try {
      const { orders } = await medusa.store.order.list({
        fields: "*payment_collections,*payment_collections.payment_sessions,*payment_collections.payments",
      }, {
        Authorization: `Bearer ${token}`,
      });
      ctx.state.orders = orders;
      ctx.state.title = "Order History - Apple4All";
      ctx.state.description = "View your past orders and their status.";

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
  const orders = props.data as HttpTypes.StoreOrder[];

  return (
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">Order History</h2>
      </div>
      
      {orders.length === 0 ? (
        <div class="p-6 text-center text-gray-500">
          You haven't placed any orders yet.
        </div>
      ) : (
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-gray-200 bg-gray-50/50">
                <th class="py-3 px-6 text-sm font-medium text-gray-500 whitespace-nowrap">
                  Order <span class="inline-block ml-1 text-gray-400">↓</span>
                </th>
                <th class="py-3 px-6 text-sm font-medium text-gray-500 whitespace-nowrap">
                  Date
                </th>
                <th class="py-3 px-6 text-sm font-medium text-gray-500 whitespace-nowrap">
                  Status
                </th>
                <th class="py-3 px-6 text-sm font-medium text-gray-500 whitespace-nowrap">
                  Amount
                </th>
                <th class="py-3 px-6 text-sm font-medium text-gray-500 whitespace-nowrap text-right">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              {orders.map((order: HttpTypes.StoreOrder) => {
                const unifiedOrderNumber = getUnifiedOrderNumber(order);
                return (
                  <tr key={order.id} class="hover:bg-gray-50 transition-colors group">
                    <td class="py-4 px-6 whitespace-nowrap">
                      <a href={`/account/orders/${order.id}`} f-client-nav class="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {unifiedOrderNumber}
                      </a>
                    </td>
                    <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td class="py-4 px-6 whitespace-nowrap">
                      <OrderStatusBadge initialOrder={order} />
                    </td>
                    <td class="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatAmount(order.total, order.currency_code || "USD")}
                    </td>
                    <td class="py-4 px-6 whitespace-nowrap text-right">
                      <div class="flex items-center justify-end gap-2">
                        <DownloadInvoiceButton orderId={order.id} variant="icon" />
                        <a 
                          href={`/account/orders/${order.id}`} 
                          f-client-nav
                          class="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                          title="View Order"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="12" cy="5" r="1"></circle>
                            <circle cx="12" cy="19" r="1"></circle>
                          </svg>
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
});