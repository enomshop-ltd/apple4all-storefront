import { useState } from "preact/hooks";
import { CreditCard, Truck, ShieldCheck, Loader2 } from "lucide-react";
import { HttpTypes } from "@medusajs/types";

export function Checkout({ initialCart }: { initialCart: HttpTypes.StoreCart | null }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const cart = initialCart;

  const handleCheckout = async (e: Event) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");
    
    const formData = new FormData(e.target as HTMLFormElement);
    const shipping_address = {
      first_name: formData.get("firstName"),
      last_name: formData.get("lastName"),
      address_1: formData.get("address"),
      city: formData.get("city"),
      postal_code: formData.get("zip"),
      country_code: formData.get("country"),
    };
    const email = formData.get("email");

    try {
      const res = await fetch("/api/cart/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, shipping_address, payment_method: paymentMethod }),
      });
      
      if (res.ok) {
        setSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          window.location.href = "/account/orders";
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to complete checkout.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setError("An error occurred during checkout. Please try again.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <p class="text-gray-600 mb-8 max-w-md mx-auto">Thank you for your purchase. We've sent a confirmation email with your order details.</p>
        <p class="text-sm text-gray-500">Redirecting to your orders...</p>
      </div>
    );
  }

  if (!cart || cart.items?.length === 0) {
    return (
      <div class="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p class="text-gray-600 mb-8">Add some items before checking out.</p>
        <a href="/" f-client-nav class="inline-flex items-center justify-center px-8 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors">
          Start shopping
        </a>
      </div>
    );
  }

  const subtotal = (cart.subtotal || 0) / 100;
  const shipping = (cart.shipping_total || 0) / 100;
  const taxes = (cart.tax_total || 0) / 100;
  const total = (cart.total || 0) / 100;

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
              <h2 class="text-xl font-bold text-gray-900">Contact Information</h2>
            </div>
            <div class="space-y-2">
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" name="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
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
                <label for="firstName" class="block text-sm font-medium text-gray-700">First name</label>
                <input type="text" id="firstName" name="firstName" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
              </div>
              <div class="space-y-2">
                <label for="lastName" class="block text-sm font-medium text-gray-700">Last name</label>
                <input type="text" id="lastName" name="lastName" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
              </div>
              <div class="space-y-2 sm:col-span-2">
                <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" id="address" name="address" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
              </div>
              <div class="space-y-2">
                <label for="city" class="block text-sm font-medium text-gray-700">City</label>
                <input type="text" id="city" name="city" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
              </div>
              <div class="space-y-2">
                <label for="zip" class="block text-sm font-medium text-gray-700">ZIP / Postal Code</label>
                <input type="text" id="zip" name="zip" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
              </div>
              <div class="space-y-2 sm:col-span-2">
                <label for="country" class="block text-sm font-medium text-gray-700">Country</label>
                <select id="country" name="country" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white">
                  <option value="us">United States</option>
                  <option value="ca">Canada</option>
                  <option value="gb">United Kingdom</option>
                  <option value="de">Germany</option>
                  <option value="fr">France</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div class="flex items-center gap-3 mb-6">
              <CreditCard class="w-6 h-6 text-blue-600" />
              <h2 class="text-xl font-bold text-gray-900">Payment Method</h2>
            </div>
            
            <div class="space-y-4 mb-6">
              <label class={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'credit_card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input 
                  type="radio" 
                  name="payment_method" 
                  value="credit_card" 
                  checked={paymentMethod === 'credit_card'} 
                  onChange={() => setPaymentMethod('credit_card')}
                  class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span class="ml-3 font-medium text-gray-900">Credit Card</span>
              </label>
              
              <label class={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'manual' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input 
                  type="radio" 
                  name="payment_method" 
                  value="manual" 
                  checked={paymentMethod === 'manual'} 
                  onChange={() => setPaymentMethod('manual')}
                  class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span class="ml-3 font-medium text-gray-900">Pay on Delivery (Manual)</span>
              </label>
            </div>

            {paymentMethod === 'credit_card' && (
              <div class="space-y-4 pt-4 border-t border-gray-100">
                <div class="space-y-2">
                  <label for="cardName" class="block text-sm font-medium text-gray-700">Name on card</label>
                  <input type="text" id="cardName" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
                </div>
                <div class="space-y-2">
                  <label for="cardNumber" class="block text-sm font-medium text-gray-700">Card number</label>
                  <input type="text" id="cardNumber" placeholder="0000 0000 0000 0000" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label for="expDate" class="block text-sm font-medium text-gray-700">Expiration date</label>
                    <input type="text" id="expDate" placeholder="MM/YY" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
                  </div>
                  <div class="space-y-2">
                    <label for="cvc" class="block text-sm font-medium text-gray-700">CVC</label>
                    <input type="text" id="cvc" placeholder="123" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>

      <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-fit sticky top-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
        
        <div class="space-y-4 mb-6">
          <div class="flex items-center justify-between text-gray-600">
            <span>Subtotal</span>
            <span class="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
          </div>
          <div class="flex items-center justify-between text-gray-600">
            <span>Shipping</span>
            <span class="font-medium text-gray-900">{shipping === 0 ? "Free" : `${shipping.toFixed(2)}`}</span>
          </div>
          <div class="flex items-center justify-between text-gray-600">
            <span>Estimated Taxes</span>
            <span class="font-medium text-gray-900">${taxes.toFixed(2)}</span>
          </div>
          
          <div class="pt-4 border-t border-gray-200 flex items-center justify-between">
            <span class="text-lg font-bold text-gray-900">Total</span>
            <span class="text-xl font-bold text-gray-900">${total.toFixed(2)}</span>
          </div>
        </div>

        <button 
          type="submit"
          form="checkout-form"
          disabled={isProcessing}
          class="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-70"
        >
          {isProcessing ? (
            <>
              <Loader2 class="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
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
