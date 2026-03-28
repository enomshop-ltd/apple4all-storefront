import { define } from "../../../utils.ts";
import { medusa } from "../../../lib/sdk.ts";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";
import Image from "../../../islands/Image.tsx";
import { HttpTypes } from "@medusajs/types";
import { page } from "fresh";
import OrderStatusBadge from "@/islands/OrderStatusBadge.tsx";
import { formatAmount } from "../../../lib/pricing.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const cookies = getCookies(ctx.req.headers);
    const token = cookies["_medusa_jwt"];
    const orderId = ctx.params.id;

    if (!token) {
      return new Response("", { status: 302, headers: { Location: "/login" } });
    }

    let order = null;
    try {
      const { order: fetchedOrder } = await medusa.store.order.retrieve(
        orderId,
        {
          fields:
            "*items,*items.variant,*items.variant.product,*shipping_address,*billing_address",
        },
        {
          Authorization: `Bearer ${token}`,
        },
      );
      order = fetchedOrder;
    } catch (e: unknown) {
      console.error("Failed to fetch order details", e);
      if ((e as { status?: number })?.status === 401) {
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
      return new Response("", {
        status: 302,
        headers: { Location: "/account/orders" },
      });
    }

    if (!order) {
      return new Response("", {
        status: 302,
        headers: { Location: "/account/orders" },
      });
    }

    ctx.state.order = order;
    ctx.state.title = `Order #${order.display_id} - Apple4All`;
    ctx.state.description = `View details for order #${order.display_id}.`;

    return page(order);
  },
});

export default define.page(function OrderDetailsPage(props) {
  // FIXED: Cast directly to StoreOrder
  const order = props.data as HttpTypes.StoreOrder;

  const currencyCode = order.currency_code || "USD";
  const subtotal = formatAmount(order.subtotal || 0, currencyCode);
  const shipping = (order.shipping_total || 0) === 0 ? "Free" : formatAmount(order.shipping_total || 0, currencyCode);
  const taxes = formatAmount(order.tax_total || 0, currencyCode);
  const total = formatAmount(order.total || 0, currencyCode);

  return (
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">
          Order #{order.display_id}
        </h2>
        <OrderStatusBadge initialOrder={order} />
      </div>

      <p class="text-sm text-gray-500 mb-8">
        Placed on {new Date(order.created_at).toLocaleDateString()}
      </p>

      <div class="space-y-6 mb-8">
        {order.items?.map((item: HttpTypes.StoreOrderLineItem) => (
          <div
            key={item.id}
            class="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0"
          >
            <div class="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 p-2">
              {item.thumbnail
                ? (
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    class="w-full h-full object-contain mix-blend-multiply"
                  />
                )
                : (
                  <div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
            </div>
            <div class="flex-1">
              <h3 class="font-medium text-gray-900">{item.title}</h3>
              <p class="text-sm text-gray-500">
                Variant: {item.variant?.title}
              </p>
              <p class="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <div class="text-right">
              <p class="font-medium text-gray-900">
                {formatAmount(item.unit_price, currencyCode)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-200">
        <div>
          <h3 class="font-bold text-gray-900 mb-4">Shipping Address</h3>
          <div class="text-gray-600 space-y-1 text-sm">
            <p>
              {order.shipping_address?.first_name}{" "}
              {order.shipping_address?.last_name}
            </p>
            <p>{order.shipping_address?.address_1}</p>
            {order.shipping_address?.address_2 && (
              <p>{order.shipping_address?.address_2}</p>
            )}
            <p>
              {order.shipping_address?.city}, {order.shipping_address?.province}
              {" "}
              {order.shipping_address?.postal_code}
            </p>
            <p class="uppercase">{order.shipping_address?.country_code}</p>
          </div>
        </div>

        <div class="bg-gray-50 p-6 rounded-xl">
          <h3 class="font-bold text-gray-900 mb-4">Order Summary</h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span class="font-medium text-gray-900">
                {subtotal}
              </span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span class="font-medium text-gray-900">
                {shipping}
              </span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Taxes</span>
              <span class="font-medium text-gray-900">{taxes}</span>
            </div>
            <div class="pt-3 border-t border-gray-200 flex justify-between">
              <span class="font-bold text-gray-900">Total</span>
              <span class="font-bold text-gray-900 text-lg">
                {total}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});