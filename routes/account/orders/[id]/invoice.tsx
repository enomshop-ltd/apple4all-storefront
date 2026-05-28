import { define } from "../../../../lib/utils.ts";
import { medusa } from "../../../../lib/sdk.ts";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";
import { HttpTypes } from "@medusajs/types";
import { page } from "fresh";
import { formatAmount } from "../../../../lib/pricing.ts";
import { getUnifiedOrderNumber } from "../../../../lib/order-utils.ts";
import { STORE_NAME } from "../../../../lib/utils.ts";
import QRCode from "npm:qrcode";

export const handler = define.handlers({
  async GET(ctx) {
    const cookies = getCookies(ctx.req.headers);
    const token = cookies["_medusa_jwt"];
    const orderId = ctx.params.id;
    if (!token) {
      const redirectPath = ctx.url.pathname + ctx.url.search;
      return new Response("", {
        status: 302,
        headers: { Location: `/login?redirect=${encodeURIComponent(redirectPath)}` },
      });
    }
    let order = null;
    try {
      const { order: fetchedOrder } = await medusa.store.order.retrieve(
        orderId,
        {
          fields:
            "*items,*items.variant,*items.variant.product,*shipping_address,*billing_address,*payment_collections,*payment_collections.payments,*payment_collections.payment_sessions,*customer",
        },
        { Authorization: `Bearer ${token}` },
      );
      order = fetchedOrder;
    } catch (e: unknown) {
      if ((e as { status?: number })?.status === 401) {
        const headers = new Headers();
        const redirectPath = ctx.url.pathname + ctx.url.search;
        headers.set("Location", `/login?redirect=${encodeURIComponent(redirectPath)}`);
        headers.set(
          "Set-Cookie",
          `_medusa_jwt=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
        );
        return new Response("", { status: 302, headers });
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
    
    ctx.state.hideLayout = true;
    ctx.state.title = `Invoice - Order #${getUnifiedOrderNumber(order)}`;

    const storefrontUrl = Deno.env.get("STOREFRONT_URL")?.replace(/\/$/, "") || ctx.url.origin;
    const orderUrl = new URL(`/account/orders/${order.id}`, storefrontUrl).href;
    const qrCodeUrl = await QRCode.toDataURL(orderUrl, { margin: 1, width: 100 });

    return page({ order, qrCodeUrl });
  },
});

export default define.page(function InvoicePage(props) {
  const { order, qrCodeUrl } = props.data as { order: HttpTypes.StoreOrder; qrCodeUrl: string };
  
  const currencyCode = order.currency_code || "USD";
  const subtotal = formatAmount(order.subtotal || 0, currencyCode);
  const shipping = (order.shipping_total || 0) === 0
    ? "Free"
    : formatAmount(order.shipping_total || 0, currencyCode);
  const total = formatAmount(order.total || 0, currencyCode);

  let capturedAmountRaw = 0;
  if (order.payment_collections) {
    for (const pc of order.payment_collections) {
      if (pc.payments) {
        capturedAmountRaw += pc.payments.reduce((acc: number, p: any) => {
          const isPaid = p.captured_at || !p.canceled_at;
          return acc + (isPaid ? Number(p.amount) : 0);
        }, 0);
      }
    }
  }

  const balanceDueRaw = Math.max(0, (order.total || 0) - capturedAmountRaw);
  const balanceDue = formatAmount(balanceDueRaw, currencyCode);
  const capturedAmount = formatAmount(capturedAmountRaw, currencyCode);

  const date = new Date(order.created_at).toLocaleDateString("en-GB");

  const customerName = order.billing_address?.first_name 
    ? `${order.billing_address.first_name} ${order.billing_address.last_name}`
    : order.shipping_address?.first_name
      ? `${order.shipping_address.first_name} ${order.shipping_address.last_name}`
      : order.customer?.first_name 
        ? `${order.customer.first_name} ${order.customer.last_name}`
        : "Customer";

  return (
    <div class="max-w-[800px] mx-auto p-12 bg-white min-h-screen text-gray-900 font-sans text-sm" id="invoice-container">
      {/* Header */}
      <div class="flex justify-between items-start mb-8">
        <div>
          <div class="mb-4 flex items-center gap-3">
            <img src="/logo.svg" alt="Logo" class="h-12 w-auto object-contain" />
          </div>
          <div class="text-[13px] text-gray-600 leading-snug space-y-0.5">
            <p class="font-bold text-gray-900 text-sm mb-1">Urban Device Care Ltd</p>
            <p>Bekim house</p>
            <p>Westlands crossway Road</p>
            <p>Nairobi 00800</p>
            <p>Kenya</p>
            <p>0115682959</p>
            <p>info@urbandevicecare.co.uk</p>
            <p>KRA PIN P052534849N</p>
          </div>
        </div>
        <div class="text-right">
          <h2 class="text-4xl font-normal text-gray-800 mb-2 tracking-wide uppercase">Invoice</h2>
          <p class="text-sm font-semibold mb-6 text-gray-700"># INV{getUnifiedOrderNumber(order)}</p>
          
          <div class="text-[13px] text-gray-600 mb-1">Balance Due</div>
          <div class="text-lg font-bold text-gray-900">{balanceDue}</div>
        </div>
      </div>

      <div class="mt-8 mb-6 grid grid-cols-2 gap-8">
        <div class="pt-2">
          <p class="font-bold text-gray-900 text-sm">{customerName}</p>
        </div>
        <div class="flex justify-end">
          <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-[13px] text-right w-64">
            <div class="text-gray-600">Invoice Date :</div>
            <div class="text-gray-900">{date}</div>
            
            <div class="text-gray-600">Terms :</div>
            <div class="text-gray-900">Due on Receipt</div>
            
            <div class="text-gray-600">Due Date :</div>
            <div class="text-gray-900">{date}</div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table class="w-full mb-8 text-[13px]">
        <thead class="bg-[#404040] text-white">
          <tr>
            <th class="py-2.5 px-3 font-normal text-center w-12">#</th>
            <th class="py-2.5 px-3 font-normal text-left">Description</th>
            <th class="py-2.5 px-3 font-normal text-center w-24">Qty</th>
            <th class="py-2.5 px-3 font-normal text-right w-32">Rate</th>
            <th class="py-2.5 px-3 font-normal text-right w-32">Amount</th>
          </tr>
        </thead>
        <tbody class="text-gray-800">
          {order.items?.map((item: any, idx: number) => (
            <tr key={item.id} class="border-b border-gray-200">
              <td class="py-3.5 px-3 text-center">{idx + 1}</td>
              <td class="py-3.5 px-3">
                {item.title}
                {item.variant?.title && item.variant.title !== "Default" && ` - ${item.variant.title}`}
              </td>
              <td class="py-3.5 px-3 text-center">{item.quantity}.00</td>
              <td class="py-3.5 px-3 text-right">{formatAmount(item.unit_price, currencyCode)}</td>
              <td class="py-3.5 px-3 text-right">{formatAmount(item.unit_price * item.quantity, currencyCode)}</td>
            </tr>
          ))}
          {/* Shipping row if applicable */}
          {(order.shipping_total || 0) > 0 && (
            <tr class="border-b border-gray-200">
              <td class="py-3.5 px-3 text-center">{order.items?.length ? order.items.length + 1 : 1}</td>
              <td class="py-3.5 px-3">Shipping</td>
              <td class="py-3.5 px-3 text-center">1.00</td>
              <td class="py-3.5 px-3 text-right">{shipping}</td>
              <td class="py-3.5 px-3 text-right">{shipping}</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Totals */}
      <div class="flex justify-end mb-16">
        <div class="w-[320px]">
          <div class="flex justify-between py-2 text-[13px]">
            <span class="font-bold text-gray-900 text-right flex-1 pr-6">Sub Total</span>
            <span class="text-right w-32">{subtotal}</span>
          </div>
          
          <div class="flex justify-between py-2 text-[13px] border-t border-b border-gray-200 my-1">
            <span class="font-bold text-gray-900 text-right flex-1 pr-6">Total</span>
            <span class="font-bold text-gray-900 text-right w-32">{total}</span>
          </div>
          
          <div class="flex justify-between py-2 text-[13px]">
            <span class="text-gray-600 text-right flex-1 pr-6">Payment Made</span>
            <span class="text-red-500 text-right w-32">(-) {capturedAmount}</span>
          </div>
          
          <div class="flex justify-between py-2.5 px-2 text-[13px] bg-gray-100 mt-2">
            <span class="font-bold text-gray-900 text-right flex-1 pr-4">Balance Due</span>
            <span class="font-bold text-gray-900 text-right w-32">{balanceDue}</span>
          </div>
        </div>
      </div>

      {/* Footer / Notes */}
      <div class="flex justify-between items-end">
        <div class="text-[13px] text-gray-800 space-y-1">
          <p>Thanks for your business.</p>
        </div>
        <div class="flex flex-col items-center gap-1">
          <img src={qrCodeUrl} alt="Order QR Code" class="w-16 h-16 object-contain mix-blend-multiply" />
          <span class="text-[10px] text-gray-400 uppercase tracking-wider">View Online</span>
        </div>
      </div>

      <div class="mt-20 pt-4 border-t border-gray-200 text-xs text-gray-500 flex justify-end items-center uppercase tracking-wider">
        <span>1</span>
      </div>

      {/* Auto-print script */}
      <script dangerouslySetInnerHTML={{
        __html: `
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        `
      }} />
    </div>
  );
});
