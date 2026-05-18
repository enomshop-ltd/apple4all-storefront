import { useState } from "preact/hooks";
import { HttpTypes } from "@medusajs/types";
import { formatAmount } from "../lib/pricing.ts";
import OrderStatusBadge from "./OrderStatusBadge.tsx";
import { getUnifiedOrderNumber } from "../lib/order-utils.ts";
import {
  Check,
  ChevronDown,
  Edit2,
  Heart,
  Loader2,
  Package,
  RefreshCcw,
  Star,
} from "lucide-preact";
function InlineEdit(
  { value, onSave, label, type = "text" }: {
    value: string;
    onSave: (v: string) => Promise<void>;
    label: string;
    type?: string;
  },
) {
  const [val, setVal] = useState(value);
  const [loading, setLoading] = useState(false);
  const handleSave = async () => {
    if (val === value) return;
    setLoading(true);
    console.log(`Saving ${label} with value: ${val}`);
    await onSave(val);
    setLoading(false);
  };
  return (
    <div class="w-full text-sm relative">
      <p class="text-gray-900 font-bold mb-1">{label}</p>
      <div class="flex items-center">
        <input
          type={type}
          value={val}
          onInput={(e) => setVal((e.target as HTMLInputElement).value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
          onBlur={handleSave}
          class="w-full bg-transparent border-0 border-b-2 border-transparent hover:border-gray-300 focus:border-blue-600 focus:ring-0 px-0 py-1 text-gray-600 outline-none transition-colors"
          disabled={loading}
        />
        {loading && (
          <Loader2 class="w-4 h-4 animate-spin text-blue-600 absolute right-0 top-6" />
        )}
      </div>
    </div>
  );
}
export default function AccountDashboard(
  { customer, orders, currencyCode }: {
    customer: HttpTypes.StoreCustomer;
    orders: HttpTypes.StoreOrder[];
    currencyCode: string;
  },
) {
  const [cust, setCust] = useState(customer);
  const updateProfile = async (field: string, val: string) => {
    try {
      console.log(`Sending update for ${field}...`);
      const res = await fetch("/api/account/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: val }),
      });
      if (res.ok) {
        const { customer: updated } = await res.json();
        setCust(updated);
        console.log(`Successfully updated ${field}`);
      } else {
        console.error(`Failed to update ${field}`, await res.text());
      }
    } catch (e) {
      console.error(`Error updating ${field}:`, e);
    }
  };
  const mainAddress = cust.addresses?.[0];
  return (
    <div class="space-y-6 w-full max-w-5xl mx-auto">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Package, label: "Total Orders", val: orders.length },
          { icon: Heart, label: "Favorite products", val: "455" },
          { icon: Star, label: "Reviews added", val: "1,285" },
          { icon: RefreshCcw, label: "Returns", val: "2" },
        ].map((s, i) => (
          <div
            key={i}
            class="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4 shadow-sm"
          >
            <div class="p-3 bg-gray-50 text-gray-600 rounded-lg">
              <s.icon class="w-6 h-6" />
            </div>
            <div>
              <p class="text-sm text-gray-500">{s.label}</p>
              <p class="text-xl font-bold text-gray-900">{s.val}</p>
            </div>
          </div>
        ))}
      </div>
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <h2 class="text-xl font-bold text-gray-900">Account data</h2>
        </div>
        <div class="p-6 flex flex-col md:flex-row gap-8">
          <div class="flex-1 space-y-6">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center overflow-hidden">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${cust.email}`}
                  alt="Avatar"
                  class="w-full h-full object-cover"
                />
              </div>
              <div>
                <span class="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded mb-1 inline-block">
                  Essentials
                </span>
                <h3 class="text-xl font-bold text-gray-900">
                  {cust.first_name} {cust.last_name}
                </h3>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="w-full text-sm">
                <p class="text-gray-900 font-bold mb-1">Email Address</p>
                <div class="py-1 text-gray-600">{cust.email}</div>
              </div>
              <InlineEdit
                label="Phone Number"
                value={cust.phone || ""}
                type="tel"
                onSave={(v) => updateProfile("phone", v)}
              />
              <InlineEdit
                label="First Name"
                value={cust.first_name || ""}
                onSave={(v) => updateProfile("first_name", v)}
              />
              <InlineEdit
                label="Last Name"
                value={cust.last_name || ""}
                onSave={(v) => updateProfile("last_name", v)}
              />
            </div>
            <div class="w-full text-sm mt-4">
              <p class="text-gray-900 font-bold mb-1">Delivery Address</p>
              <div class="py-1 text-gray-600 flex justify-between items-start">
                {mainAddress
                  ? (
                    <span>
                      {mainAddress.address_1}
                      {mainAddress.address_2 && `, ${mainAddress.address_2}`}
                      <br />
                      {mainAddress.city}, {mainAddress.province}{" "}
                      {mainAddress.postal_code}
                      <br />
                      {mainAddress.country_code?.toUpperCase()}
                    </span>
                  )
                  : <span class="text-gray-400 italic">No address saved</span>}
              </div>
            </div>
            <button
              class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              onClick={() => console.log("Edit clicked")}
            >
              <Edit2 class="w-4 h-4" /> Edit your data
            </button>
          </div>
          <div class="w-full md:w-80 bg-gray-50 rounded-xl p-6 border border-gray-200 flex flex-col">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                <Star class="w-4 h-4" />
              </div>
              <h3 class="font-bold text-gray-900 text-lg">
                Flowbite{" "}
                <span class="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded font-bold uppercase ml-1">
                  PRO
                </span>
              </h3>
            </div>
            <p class="text-2xl font-bold text-gray-900 mb-6">
              $9.99<span class="text-sm font-normal text-gray-500">/month</span>
            </p>
            <p class="text-sm font-bold text-gray-900 mb-3">
              PRO plan benefits
            </p>
            <ul class="space-y-3 mb-6 flex-1">
              {[
                "Free shipping all over the country",
                "Testing the product for 5 days",
                "Exclusive offers",
              ].map((b, i) => (
                <li
                  key={i}
                  class="flex items-center gap-2 text-sm text-gray-600"
                >
                  <Check class="w-4 h-4 text-green-500" /> {b}
                </li>
              ))}
            </ul>
            <button class="w-full py-2.5 bg-white border border-gray-200 text-gray-900 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <Star class="w-4 h-4" /> Upgrade to PRO
            </button>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
            Active orders
            <span
              class="w-4 h-4 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-[10px] cursor-help"
              title="Your recent orders"
            >
              i
            </span>
          </h2>
        </div>
        {orders.length === 0
          ? <div class="p-8 text-center text-gray-500">No orders found.</div>
          : (
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm">
                <thead class="text-gray-500 border-b border-gray-100">
                  <tr>
                    <th class="px-6 py-4 font-normal">Order ID:</th>
                    <th class="px-6 py-4 font-normal">Date:</th>
                    <th class="px-6 py-4 font-normal">Price:</th>
                    <th class="px-6 py-4 font-normal">Status:</th>
                    <th class="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  {orders.map((o) => (
                    <tr key={o.id} class="hover:bg-gray-50">
                      <td class="px-6 py-4 font-bold text-gray-900">
                        #{getUnifiedOrderNumber(o)}
                      </td>
                      <td class="px-6 py-4 font-bold text-gray-900">
                        {new Date(o.created_at).toLocaleDateString("en-GB")
                          .replace(/\//g, ".")}
                      </td>
                      <td class="px-6 py-4 font-bold text-gray-900">
                        {formatAmount(
                          o.total || 0,
                          o.currency_code || currencyCode,
                        )}
                      </td>
                      <td class="px-6 py-4">
                        <OrderStatusBadge initialOrder={o} />
                      </td>
                      <td class="px-6 py-4 text-right">
                        <a
                          href={`/account/orders/${o.id}`}
                          class="inline-flex items-center justify-center px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          Actions <ChevronDown class="w-4 h-4 ml-1" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </div>
  );
}
