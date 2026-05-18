import { useState } from "preact/hooks";
import { HttpTypes } from "@medusajs/types";
import { formatAmount } from "../lib/pricing.ts";
import OrderStatusBadge from "./OrderStatusBadge.tsx";
import { getUnifiedOrderNumber } from "../lib/order-utils.ts";
import {
  Check,
  ChevronDown,
  CreditCard,
  DollarSign,
  Edit2,
  Heart,
  Loader2,
  Package,
  RefreshCcw,
  Star,
} from "lucide-preact";
function InlineEdit({
  value,
  onSave,
  label,
  type = "text",
}: {
  value: string;
  onSave: (v: string) => Promise<void>;
  label: string;
  type?: string;
}) {
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
export default function AccountDashboard({
  customer,
  orders,
  currencyCode,
}: {
  customer: HttpTypes.StoreCustomer;
  orders: HttpTypes.StoreOrder[];
  currencyCode: string;
}) {
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

  const updateAddressField = async (field: string, val: string) => {
    try {
      console.log(`Sending address update for ${field}...`);
      const body: Record<string, string> = { [field]: val };
      if (mainAddress?.id) body.id = mainAddress.id;

      const res = await fetch("/api/account/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const { customer: updated } = await res.json();
        setCust(updated);
        console.log(`Successfully updated address ${field}`);
      } else {
        console.error(`Failed to update address ${field}`, await res.text());
      }
    } catch (e) {
      console.error(`Error updating address ${field}:`, e);
    }
  };

  const activeOrders = orders.filter(
    (o) => !["canceled", "completed", "archived"].includes(o.status),
  );

  return (
    <div class="space-y-6 w-full max-w-5xl mx-auto">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Package, label: "Total Orders", val: orders.length },
          {
            icon: RefreshCcw,
            label: "Returns",
            val: orders
              .filter((o) =>
                ["returned", "partially_returned"].includes(
                  o.fulfillment_status || "",
                ),
              )
              .length.toString(),
          },
          {
            icon: CreditCard,
            label: "Unpaid",
            val: formatAmount(
              orders
                .filter((o) =>
                  ["not_paid", "awaiting", "requires_action"].includes(
                    o.payment_status || "",
                  ),
                )
                .reduce((sum, o) => sum + (o.total || 0), 0),
              currencyCode,
            ),
          },
          {
            icon: DollarSign,
            label: "Credits",
            val: formatAmount(0, currencyCode),
          },
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
                <span class="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded mb-1 inline-block uppercase">
                  {((cust as unknown) as { groups?: { name: string }[] })?.groups?.[0]?.name || "Customer"}
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
            <div class="w-full mt-4">
              <p class="text-gray-900 text-sm font-bold mb-4">
                Delivery Address
              </p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InlineEdit
                  label="Address Line 1"
                  value={mainAddress?.address_1 || ""}
                  onSave={(v) => updateAddressField("address_1", v)}
                />
                <InlineEdit
                  label="Address Line 2"
                  value={mainAddress?.address_2 || ""}
                  onSave={(v) => updateAddressField("address_2", v)}
                />
                <InlineEdit
                  label="City"
                  value={mainAddress?.city || ""}
                  onSave={(v) => updateAddressField("city", v)}
                />
                <InlineEdit
                  label="State / Province"
                  value={mainAddress?.province || ""}
                  onSave={(v) => updateAddressField("province", v)}
                />
                <InlineEdit
                  label="Postal Code"
                  value={mainAddress?.postal_code || ""}
                  onSave={(v) => updateAddressField("postal_code", v)}
                />
                <InlineEdit
                  label="Country Code (e.g. US)"
                  value={mainAddress?.country_code?.toUpperCase() || ""}
                  onSave={(v) =>
                    updateAddressField("country_code", v.toLowerCase())
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {activeOrders.length > 0 && (
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-100">
            <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
              Active orders
              <span
                class="w-4 h-4 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-[10px] cursor-help"
                title="Your active orders"
              >
                i
              </span>
            </h2>
          </div>
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
                {activeOrders.map((o) => (
                  <tr key={o.id} class="hover:bg-gray-50">
                    <td class="px-6 py-4 font-bold text-gray-900">
                      #{getUnifiedOrderNumber(o)}
                    </td>
                    <td class="px-6 py-4 font-bold text-gray-900">
                      {new Date(o.created_at)
                        .toLocaleDateString("en-GB")
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
        </div>
      )}
    </div>
  );
}
