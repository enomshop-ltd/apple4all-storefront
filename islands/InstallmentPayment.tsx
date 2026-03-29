import { useState } from "preact/hooks";
import { Loader2 } from "lucide-preact";
import { formatAmount } from "../lib/pricing.ts";

export default function InstallmentPayment({
  orderId,
  remainingBalanceRaw,
  customerEmail,
  currencyCode,
}: {
  orderId: string;
  remainingBalanceRaw: number;
  customerEmail: string;
  currencyCode: string;
}) {
  // Convert raw database amount to a displayable input number
  const zeroDecimalCurrencies =["JPY", "KRW", "VND", "CLP", "PYG", "KES"];
  const isZeroDecimal = zeroDecimalCurrencies.includes(currencyCode.toUpperCase());
  const divisor = isZeroDecimal ? 1 : 100;

  const maxAllowed = remainingBalanceRaw / divisor;

  const [amount, setAmount] = useState<number>(maxAllowed);
  const [isLoading, setIsLoading] = useState(false);
  const[error, setError] = useState("");

  const handlePayment = async () => {
    if (amount <= 0 || amount > maxAllowed) {
      setError("Please enter a valid amount.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Convert back to raw amount for the Medusa backend
      const rawAmountToPay = amount * divisor;

      // 1. Get the payment session and access code from your proxy API
      const res = await fetch(`/api/orders/${orderId}/paystack-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: rawAmountToPay,
          email: customerEmail,
          // Fallback URL in case Paystack forces a redirect (e.g. certain bank authentications)
          callback_url: `${globalThis.location.origin}/account/orders/${orderId}`,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to initialize payment");
      }

      const { payment_session } = await res.json();
      const accessCode = payment_session?.data?.paystackTxAccessCode;

      if (!accessCode) {
        throw new Error("Failed to retrieve Paystack access code.");
      }

      // 2. Open Paystack v2 Inline Popup
      const paystackWindow = window as any;
      const openPaystackPopup = () => {
        try {
          const paystack = new paystackWindow.PaystackPop();
          paystack.resumeTransaction(accessCode, {
            onSuccess: () => {
              // Wait 2 seconds for the webhook/backend to process the capture, then reload
              setTimeout(() => {
                globalThis.location.reload();
              }, 2000);
            },
            onCancel: () => {
              setError("Payment window closed. You can try again.");
              setIsLoading(false);
            },
            onError: (err: any) => {
              console.error("Paystack transaction error:", err);
              setError(`Payment failed: ${err.message}`);
              setIsLoading(false);
            },
          });
        } catch (err) {
          console.error("Paystack iframe error:", err);
          setError("Failed to open payment gateway. Please try again.");
          setIsLoading(false);
        }
      };

      // Ensure the script is loaded (fallback if missing from _app.tsx)
      if (typeof paystackWindow.PaystackPop === "undefined") {
        const script = document.createElement("script");
        script.src = "https://js.paystack.co/v2/inline.js";
        script.onload = () => openPaystackPopup();
        script.onerror = () => {
          setError("Failed to load Paystack securely. Check your connection.");
          setIsLoading(false);
        };
        document.head.appendChild(script);
      } else {
        openPaystackPopup();
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  if (remainingBalanceRaw <= 0) {
    return null; // Don't show anything if fully paid
  }

  return (
    <div class="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-8">
      <h3 class="font-bold text-gray-900 mb-2">Pay Remaining Balance</h3>
      <p class="text-sm text-gray-600 mb-4">
        You have a pending balance of <strong>{formatAmount(remainingBalanceRaw, currencyCode)}</strong>. You can pay this off in full or enter a custom installment amount below.
      </p>

      {error && <div class="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 font-medium">{error}</div>}

      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            {currencyCode.toUpperCase()}
          </span>
          <input
            type="number"
            min="1"
            max={maxAllowed}
            step={isZeroDecimal ? "1" : "0.01"}
            value={amount}
            onInput={(e) => setAmount(Number((e.target as HTMLInputElement).value))}
            disabled={isLoading}
            class="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white disabled:bg-gray-100"
          />
        </div>
        <button
          onClick={handlePayment}
          disabled={isLoading}
          class="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center justify-center min-w-[160px]"
        >
          {isLoading ? (
            <>
              <Loader2 class="w-5 h-5 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            "Pay Installment"
          )}
        </button>
      </div>
    </div>
  );
}