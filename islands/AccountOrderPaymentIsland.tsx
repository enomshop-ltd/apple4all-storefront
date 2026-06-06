import { useState } from "preact/hooks";
import { Loader2, CreditCard } from "lucide-preact";
import PaystackCheckout from "./PaystackCheckout.tsx";
import { formatAmount } from "../lib/pricing.ts";

interface AccountOrderPaymentIslandProps {
  orderId: string;
  remainingBalanceRaw: number;
  currencyCode: string;
  paymentProviders: any[];
}

export default function AccountOrderPaymentIsland({
  orderId,
  remainingBalanceRaw,
  currencyCode,
  paymentProviders,
}: AccountOrderPaymentIslandProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(
    paymentProviders && paymentProviders.length > 0 ? paymentProviders[0].id : ""
  );
  const [paystackSession, setPaystackSession] = useState<{accessCode: string} | null>(null);

  if (remainingBalanceRaw <= 0) {
    return null;
  }

  const handlePayBalance = async (e: Event) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    if (!paymentMethod) {
      setError("Please select a payment method.");
      setIsProcessing(false);
      return;
    }

    try {
      const res = await fetch(`/api/orders/${orderId}/payment-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_method: paymentMethod }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to initialize payment session.");
        setIsProcessing(false);
        return;
      }

      const data = await res.json();

      if (paymentMethod.includes("paystack")) {
        const accessCode = data.paymentSession?.paystackTxAccessCode || data.paymentSession?.accessCode || data.paymentSession?.access_code;
        if (!accessCode) {
          setError("Failed to initialize Paystack payment. Access code missing.");
          setIsProcessing(false);
          return;
        }
        setPaystackSession({ accessCode });
      } else {
        // Other providers not implemented in this snippet
        setError(`Provider ${paymentMethod} not supported yet for partial payments.`);
        setIsProcessing(false);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during payment initialization.");
      setIsProcessing(false);
    }
  };

  return (
    <div class="mt-8 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <CreditCard class="w-5 h-5 text-blue-600" />
        Pay Remaining Balance
      </h3>
      
      {error && (
        <div class="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <p class="text-sm text-gray-600 mb-4">
        You have an unpaid balance of <strong class="text-gray-900">{formatAmount(remainingBalanceRaw, currencyCode)}</strong>. Select a payment method to complete your order.
      </p>

      <div class="space-y-3 mb-6">
        {paymentProviders && paymentProviders.length > 0 ? paymentProviders.map((provider: any) => (
          <label
            key={provider.id}
            class={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
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
            <span class="ml-3 font-medium text-gray-900 text-sm">
              {provider.name || provider.id}
            </span>
          </label>
        )) : (
          <p class="text-sm text-gray-500">No payment methods available.</p>
        )}
      </div>

      <button
        onClick={handlePayBalance}
        disabled={isProcessing || !paymentMethod}
        class="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 disabled:hover:bg-blue-600"
      >
        {isProcessing ? (
          <>
            <Loader2 class="w-5 h-5 animate-spin" />
            Initializing...
          </>
        ) : (
          `Pay ${formatAmount(remainingBalanceRaw, currencyCode)}`
        )}
      </button>

      {/* Hidden Paystack popup trigger */}
      {paystackSession && (
        <div class="hidden">
          <PaystackCheckout 
            accessCode={paystackSession.accessCode}
            autoTrigger={true}
            onSuccess={() => {
              // Reload page to reflect new payment status
              window.location.reload();
            }}
            onCancel={() => {
              setPaystackSession(null);
              setError("Payment was cancelled.");
              setIsProcessing(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
