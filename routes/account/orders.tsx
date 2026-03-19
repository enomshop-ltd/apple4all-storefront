import { define } from "../../utils.ts";
import { AccountLayout } from "../../components/AccountLayout.tsx";
import { medusa } from "../../lib/sdk.ts";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";

export default define.page(async function OrdersPage(ctx) {
  const cookies = getCookies(ctx.req.headers);
  const token = cookies["_medusa_jwt"];

  if (!token) return new Response("", { status: 302, headers: { Location: "/login" } });

  try {
    const { orders } = await medusa.store.order.list({
      headers: { Authorization: `Bearer ${token}` }
    });

    return (
      <AccountLayout activeTab="orders">
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 class="text-xl font-semibold mb-4">Order History</h2>
          {orders.length === 0 ? (
            <p class="text-gray-500">You haven't placed any orders yet.</p>
          ) : (
            <div class="space-y-4">
              {orders.map((order: any) => (
                <a href={`/account/orders/${order.id}`} f-client-nav key={order.id} class="block border-b pb-4 hover:bg-gray-50 transition-colors p-4 rounded-lg -mx-4">
                  <div class="flex justify-between items-center">
                    <div>
                      <p class="font-medium text-blue-600 hover:underline">Order #{order.display_id}</p>
                      <p class="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-semibold capitalize text-gray-700">{order.status}</p>
                      <p class="text-sm font-medium text-gray-900">${(order.total / 100).toFixed(2)}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </AccountLayout>
    );
  } catch {
    return new Response("", { status: 302, headers: { Location: "/login" } });
  }
});