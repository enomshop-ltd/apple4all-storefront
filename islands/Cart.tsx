import { useState } from "preact/hooks";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-preact";
import { HttpTypes } from "@medusajs/types";
import { formatAmount } from "../lib/pricing.ts";

export default function Cart(
  { initialCart }: { initialCart: HttpTypes.StoreCart | null },
) {
  const [cart, setCart] = useState(initialCart);
  const items = cart?.items || [];

  const updateQuantity = async (id: string, delta: number) => {
    const item = items.find((i: HttpTypes.StoreCartLineItem) => i.id === id);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + delta);

    globalThis.dispatchEvent(new Event("fresh:client-nav-start"));
    try {
      const res = await fetch(`/api/cart/items/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (res.ok) {
        const { cart: updatedCart } = await res.json();
        setCart(updatedCart);
      }
    } catch (e) {
      console.error("Failed to update quantity", e);
    } finally {
      globalThis.dispatchEvent(new Event("fresh:client-nav-end"));
    }
  };

  const removeItem = async (id: string) => {
    globalThis.dispatchEvent(new Event("fresh:client-nav-start"));
    try {
      const res = await fetch(`/api/cart/items/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const { cart: updatedCart } = await res.json();
        setCart(updatedCart);
      }
    } catch (e) {
      console.error("Failed to remove item", e);
    } finally {
      globalThis.dispatchEvent(new Event("fresh:client-nav-end"));
    }
  };

  const currencyCode = cart?.region?.currency_code || "USD";
  const subtotal = formatAmount(cart?.subtotal || 0, currencyCode);
  const shipping = cart?.shipping_total === 0
    ? "Free"
    : formatAmount(cart?.shipping_total || 0, currencyCode);
  const taxes = formatAmount(cart?.tax_total || 0, currencyCode);
  const total = formatAmount(cart?.total || 0, currencyCode);

  if (items.length === 0) {
    return (
      <div class="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <ShoppingBag class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 class="text-2xl font-bold text-gray-900 mb-2">
          Your cart is empty
        </h2>
        <p class="text-gray-600 mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
        <a
          href="/"
          f-client-nav
          class="inline-flex items-center justify-center px-8 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
        >
          Start shopping
        </a>
      </div>
    );
  }

  return (
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
      <div class="space-y-4">
        {items.map((item: HttpTypes.StoreCartLineItem) => (
          <div
            key={item.id}
            class="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm"
          >
            <div class="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0">
              <img
                src={item.thumbnail ||
                  "https://picsum.photos/seed/placeholder/200/200"}
                alt={item.title}
                class="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div class="flex-1 text-center sm:text-left">
              <h3 class="font-semibold text-lg text-gray-900 mb-1">
                {item.title}
              </h3>
              {(item.variant_title || item.variant?.title) && (
                <p class="text-xs text-gray-500 mb-1.5">
                  {item.variant_title || item.variant?.title}
                </p>
              )}
              <p class="text-gray-600 font-medium">
                {formatAmount(item.unit_price, currencyCode)}
              </p>
            </div>

            <div class="flex items-center gap-4">
              <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, -1)}
                  class="p-2 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={item.quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus class="w-4 h-4" />
                </button>
                <span
                  class="w-12 text-center font-medium text-gray-900"
                  aria-label="Quantity"
                >
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, 1)}
                  class="p-2 text-gray-600 hover:bg-gray-50 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus class="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => removeItem(item.id)}
                class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove item"
                aria-label={`Remove ${item.title} from cart`}
              >
                <Trash2 class="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-fit sticky top-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

        <div class="space-y-4 mb-6">
          <div class="flex items-center justify-between text-gray-600">
            <span>Subtotal</span>
            <span class="font-medium text-gray-900">
              {subtotal}
            </span>
          </div>
          <div class="flex items-center justify-between text-gray-600">
            <span>Shipping</span>
            <span class="font-medium text-gray-900">
              {shipping}
            </span>
          </div>
          <div class="flex items-center justify-between text-gray-600">
            <span>Estimated Taxes</span>
            <span class="font-medium text-gray-900">{taxes}</span>
          </div>

          <div class="pt-4 border-t border-gray-200 flex items-center justify-between">
            <span class="text-lg font-bold text-gray-900">Total</span>
            <span class="text-xl font-bold text-gray-900">
              {total}
            </span>
          </div>
        </div>

        <a
          href="/checkout"
          f-client-nav
          class="w-full flex items-center justify-center px-6 py-3.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
        >
          Proceed to checkout
        </a>
      </div>
    </div>
  );
}
