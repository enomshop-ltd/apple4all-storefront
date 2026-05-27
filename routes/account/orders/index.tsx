import { define } from "../../../lib/utils.ts";
import { medusa } from "../../../lib/sdk.ts";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";
import { HttpTypes } from "@medusajs/types";
import { page } from "fresh";
import { OrdersList } from "../../../islands/OrdersList.tsx";
import { STORE_NAME } from "../../../lib/utils.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const cookies = getCookies(ctx.req.headers);
    const token = cookies["_medusa_jwt"];
    if (!token) {
      return new Response("", { status: 302, headers: { Location: "/login" } });
    }
    try {
      const { orders } = await medusa.store.order.list(
        {
          fields:
            "*payment_collections,*payment_collections.payment_sessions,*payment_collections.payments,*items",
        },
        { Authorization: `Bearer ${token}` },
      );
      ctx.state.title = `My Orders - ${STORE_NAME}`;
      return page({ orders });
    } catch (error) {
      console.error("Error fetching orders data:", error);
      return new Response("", {
        status: 302,
        headers: {
          Location: "/login",
          "Set-Cookie":
            `_medusa_jwt=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
        },
      });
    }
  },
});

export default define.page(function OrdersPage(props) {
  const { orders } = props.data as {
    orders: HttpTypes.StoreOrder[];
  };
  return (
    <div class="space-y-6 w-full max-w-5xl mx-auto">
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900">Order History</h2>
        </div>
        <div class="p-6">
            <OrdersList initialOrders={orders} />
        </div>
      </div>
    </div>
  );
});
