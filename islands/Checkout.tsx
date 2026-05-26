import { useState } from "preact/hooks";
import {
  CreditCard,
  Loader2,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-preact";
import { HttpTypes } from "@medusajs/types";
import { formatAmount } from "../lib/pricing.ts";

export function Checkout({
  initialCart,
  customer,
  shippingOptions,
  paymentProviders,
}: {
  initialCart: HttpTypes.StoreCart | null;
  customer: HttpTypes.StoreCustomer | null;
  shippingOptions: any[];
  paymentProviders: any[];
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(
    paymentProviders && paymentProviders.length > 0 ? paymentProviders[0].id : ""
  );

  const cart = initialCart;

  const defaultAddress = customer?.addresses?.[0] || cart?.shipping_address;
  const defaultEmail = customer?.email || cart?.email || "";
  const defaultCountry = defaultAddress?.country_code ||
    cart?.region?.countries?.[0]?.iso_2 || "ke";

  const [formValues, setFormValues] = useState({
    email: defaultEmail,
    firstName: defaultAddress?.first_name || customer?.first_name || "",
    lastName: defaultAddress?.last_name || customer?.last_name || "",
    address: defaultAddress?.address_1 || "",
    city: defaultAddress?.city || "",
    zip: defaultAddress?.postal_code || "",
    country: defaultCountry?.toLowerCase() || "us",
  });

  const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    setFormValues((prev) => ({ ...prev, [target.name]: target.value }));
  };

  const [selectedShippingOption, setSelectedShippingOption] = useState<string>(
    shippingOptions && shippingOptions.length > 0 ? shippingOptions[0].id : "",
  );

  const handleCheckout = async (e: Event) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    const formData = new FormData(e.target as HTMLFormElement);
    const shipping_address = {
      first_name: formData.get("firstName")?.toString(),
      last_name: formData.get("lastName")?.toString(),
      address_1: formData.get("address")?.toString(),
      city: formData.get("city")?.toString(),
      postal_code: formData.get("zip")?.toString(),
      country_code: formData.get("country")?.toString().toLowerCase(),
    };
    const email = formData.get("email")?.toString() || "";

    if (!shipping_address.first_name || !shipping_address.last_name || !shipping_address.address_1 || !shipping_address.city || !shipping_address.postal_code) {
      setError("Please fill out all required shipping address fields before checking out.");
      setIsProcessing(false);
      globalThis.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!paymentMethod) {
      setError("Please choose a payment method.");
      setIsProcessing(false);
      globalThis.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      globalThis.dispatchEvent(new Event("fresh:client-nav-start"));
      // Step 1: Initialize Payment (updates cart and sets up Medusa Payment Session)
      const initRes = await fetch("/api/cart/initialize-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          shipping_address,
          payment_method: paymentMethod,
          shipping_option_id: selectedShippingOption,
        }),
      });

      if (!initRes.ok) {
        globalThis.dispatchEvent(new Event("fresh:client-nav-end"));
        const data = await initRes.json();
        setError(data.error || "Failed to initialize checkout.");
        setIsProcessing(false);
        globalThis.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const initData = await initRes.json();

      // Implement provider-specific flows where required (e.g., popups, redirects)
      if (paymentMethod.includes("paystack")) {
        console.log("Paystack flow triggered", initData);
        await finalizeCheckout();
      } else if (paymentMethod.includes("stripe")) {
        console.log("Stripe flow triggered", initData);
        await finalizeCheckout();
      } else {
        await finalizeCheckout();
      }
    } catch (err) {
      globalThis.dispatchEvent(new Event("fresh:client-nav-end"));
      // FIX: Log the actual error to the console so it's not hidden next time!
      console.error("Checkout crash:", err);
      setError("An error occurred during checkout. Please try again.");
      globalThis.scrollTo({ top: 0, behavior: "smooth" });
      setIsProcessing(false);
    }
  };

  const finalizeCheckout = async () => {
    globalThis.dispatchEvent(new Event("fresh:client-nav-start"));
    try {
      const res = await fetch("/api/cart/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setSuccess(true);
        globalThis.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => {
          globalThis.location.href = "/account/orders";
        }, 2000);
      } else {
        globalThis.dispatchEvent(new Event("fresh:client-nav-end"));
        const data = await res.json();
        setError(data.error || "Failed to complete checkout.");
        globalThis.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (_err) {
      globalThis.dispatchEvent(new Event("fresh:client-nav-end"));
      setError("An error occurred completing the order.");
      globalThis.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <div class="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck class="w-8 h-8" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
        <p class="text-gray-600 mb-8 max-w-md mx-auto">
          Thank you for your purchase. We've sent a confirmation email with your
          order details.
        </p>
        <p class="text-sm text-gray-500">Redirecting to your orders...</p>
      </div>
    );
  }

  if (!cart || cart.items?.length === 0) {
    return (
      <div class="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">
          Your cart is empty
        </h2>
        <p class="text-gray-600 mb-8">Add some items before checking out.</p>
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

  const currencyCode = cart?.region?.currency_code || "USD";

  const subtotalRaw = cart.subtotal || 0;
  const taxesRaw = cart.tax_total || 0;
  const selectedOptionDetails = (shippingOptions || []).find((o: any) =>
    o.id === selectedShippingOption
  );
  const shippingAmountRaw = selectedOptionDetails
    ? selectedOptionDetails.amount || 0
    : cart.shipping_total || 0;
  const displayedTotalRaw = subtotalRaw + taxesRaw + shippingAmountRaw;

  // Format safely utilizing local currency
  const subtotal = formatAmount(subtotalRaw, currencyCode);
  const taxes = formatAmount(taxesRaw, currencyCode);
  const shippingAmount = shippingAmountRaw === 0
    ? "Free"
    : formatAmount(shippingAmountRaw, currencyCode);
  const displayedTotal = formatAmount(displayedTotalRaw, currencyCode);

  return (
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
      <div class="space-y-8">
        <form id="checkout-form" onSubmit={handleCheckout} class="space-y-8">
          {error && (
            <div class="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}
          {/* Contact Info */}
          <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div class="flex items-center gap-3 mb-6">
              <h2 class="text-xl font-bold text-gray-900">
                Contact Information
              </h2>
            </div>
            <div class="space-y-2">
              <label
                for="email"
                class="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formValues.email}
                onInput={handleInputChange}
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Shipping Address */}
          <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div class="flex items-center gap-3 mb-6">
              <Truck class="w-6 h-6 text-blue-600" />
              <h2 class="text-xl font-bold text-gray-900">Shipping Address</h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label
                  for="firstName"
                  class="block text-sm font-medium text-gray-700"
                >
                  First name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formValues.firstName}
                  onInput={handleInputChange}
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
              <div class="space-y-2">
                <label
                  for="lastName"
                  class="block text-sm font-medium text-gray-700"
                >
                  Last name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formValues.lastName}
                  onInput={handleInputChange}
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
              <div class="space-y-2 sm:col-span-2">
                <label
                  for="address"
                  class="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formValues.address}
                  onInput={handleInputChange}
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
              <div class="space-y-2">
                <label
                  for="city"
                  class="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formValues.city}
                  onInput={handleInputChange}
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
              <div class="space-y-2">
                <label
                  for="zip"
                  class="block text-sm font-medium text-gray-700"
                >
                  ZIP / Postal Code
                </label>
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  value={formValues.zip}
                  onInput={handleInputChange}
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
              <div class="space-y-2 sm:col-span-2">
                <label
                  for="country"
                  class="block text-sm font-medium text-gray-700"
                >
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  value={formValues.country.toLowerCase()}
                  onChange={handleInputChange}
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
                >
                  {cart?.region?.countries && cart.region.countries.length > 0
                    ? (
                      cart.region.countries.map((
                        c: { iso_2: string; display_name: string },
                      ) => (
                        <option key={c.iso_2} value={c.iso_2}>
                          {c.display_name}
                        </option>
                      ))
                    )
                    : (
                      <>
                        <option value="ke">Kenya</option>
                      </>
                    )}
                </select>
              </div>
            </div>
          </div>

          {/* Delivery Method */}
          <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div class="flex items-center gap-3 mb-6">
              <Package class="w-6 h-6 text-blue-600" />
              <h2 class="text-xl font-bold text-gray-900">Delivery Method</h2>
            </div>
            {shippingOptions && shippingOptions.length > 0
              ? (
                <div class="space-y-4">
                  {shippingOptions.map((option) => (
                    <label
                      key={option.id}
                      class={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${
                        selectedShippingOption === option.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div class="flex items-center">
                        <input
                          type="radio"
                          name="shipping_option"
                          value={option.id}
                          checked={selectedShippingOption === option.id}
                          onChange={() => setSelectedShippingOption(option.id)}
                          class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span class="ml-3 font-medium text-gray-900">
                          {option.name}
                        </span>
                      </div>
                      <span class="font-medium text-gray-900">
                        {option.amount === 0
                          ? "Free"
                          : formatAmount(option.amount || 0, currencyCode)}
                      </span>
                    </label>
                  ))}
                </div>
              )
              : (
                <p class="text-gray-500 text-sm">
                  No delivery methods available for this region.
                </p>
              )}
          </div>

          {/* Payment Method */}
          <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div class="flex items-center gap-3 mb-6">
              <CreditCard class="w-6 h-6 text-blue-600" />
              <h2 class="text-xl font-bold text-gray-900">Payment Method</h2>
            </div>

            <div class="space-y-4 mb-6">
              {paymentProviders && paymentProviders.length > 0 ? paymentProviders.map((provider: any) => {
                return (
                  <label
                    key={provider.id}
                    class={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === provider.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value={provider.id}
                      checked={paymentMethod === provider.id}
                      onChange={() => setPaymentMethod(provider.id)}
                      class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span class="ml-3 font-medium text-gray-900">
                      {provider.name || provider.id}
                    </span>
                  </label>
                );
              }) : (
                <p class="text-sm text-gray-500">No payment methods configured for your region.</p>
              )}
            </div>
          </div>
        </form>
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
              {shippingAmount}
            </span>
          </div>
          <div class="flex items-center justify-between text-gray-600">
            <span>Estimated Taxes</span>
            <span class="font-medium text-gray-900">{taxes}</span>
          </div>

          <div class="pt-4 border-t border-gray-200 flex items-center justify-between">
            <span class="text-lg font-bold text-gray-900">Total</span>
            <span class="text-xl font-bold text-gray-900">
              {displayedTotal}
            </span>
          </div>
        </div>

        <button
          type="submit"
          form="checkout-form"
          disabled={isProcessing}
          class="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-70"
        >
          {isProcessing
            ? (
              <>
                <Loader2 class="w-5 h-5 animate-spin" />
                Processing...
              </>
            )
            : (
              "Place Order"
            )}
        </button>

        <div class="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
          <ShieldCheck class="w-4 h-4" />
          <span>Secure checkout</span>
        </div>
      </div>
    </div>
  );
}
