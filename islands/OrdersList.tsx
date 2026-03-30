import { useState } from "preact/hooks";
import { ChevronRight, Package } from "lucide-preact";
import { HttpTypes } from "@medusajs/types";
import { getUnifiedOrderNumber } from "../lib/order-utils.ts";
import DownloadInvoiceButton from "./DownloadInvoiceButton.tsx";

export function OrdersList(
  { initialOrders }: { initialOrders: HttpTypes.StoreOrder[] },
) {
  const [orders, _setOrders] = useState(initialOrders || []);

  if (orders.length === 0) {
    return (
      <div class="text-center py-12 border border-gray-200 rounded-xl bg-gray-50">
        <Package class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
        <p class="text-gray-500 mb-6">You haven't placed any orders yet.</p>
        <a
          href="/"
          f-client-nav
          class="inline-flex items-center justify-center px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Continue shopping
        </a>
      </div>
    );
  }

  return (
    <div class="space-y-6">
      {orders.map((order) => {
        const date = new Date(order.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        const total = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: order.currency_code?.toUpperCase() || "USD",
        }).format((order.total || 0) / 100);

        return (
          <div
            key={order.id}
            class="border border-gray-200 rounded-xl overflow-hidden"
          >
            <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
              <div class="flex items-center gap-6">
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                    Order placed
                  </p>
                  <p class="text-sm font-medium text-gray-900">{date}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                    Total
                  </p>
                  <p class="text-sm font-medium text-gray-900">{total}</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {order.status}
                </span>
                <span class="text-sm text-gray-500">
                  Order #{getUnifiedOrderNumber(order)}
                </span>
              </div>
            </div>

            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  {order.items?.map((
                    item: HttpTypes.StoreOrderLineItem,
                    i: number,
                  ) => (
                    <div
                      key={i}
                      class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        src={item.thumbnail ||
                          "https://picsum.photos/seed/placeholder/100/100"}
                        alt={item.title}
                        class="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                  <div>
                    <h4 class="font-medium text-gray-900">
                      {order.items?.[0]?.title}
                    </h4>
                    {order.items && order.items.length > 1 && (
                      <p class="text-sm text-gray-500">
                        and {order.items.length - 1} more items
                      </p>
                    )}
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <DownloadInvoiceButton orderId={order.id} variant="button" />
                  <button type="button" class="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                    View details
                    <ChevronRight class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
