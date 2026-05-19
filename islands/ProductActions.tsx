import { useState, useMemo } from "preact/hooks";
import { Loader2 } from "lucide-preact";
import { HttpTypes } from "@medusajs/types";

export function ProductActions(
  { product }: { product: HttpTypes.StoreProduct },
) {
  const [options, setOptions] = useState<Record<string, string>>(() => {
    const initialOptions: Record<string, string> = {};
    const defaultVariant = product.variants?.[0];
    if (defaultVariant?.options) {
      defaultVariant.options.forEach((opt: any) => {
        if (opt.option_id) initialOptions[opt.option_id] = opt.value;
      });
    }
    return initialOptions;
  });

  const selectedVariant = useMemo(() => {
    if (!product.variants) return null;
    return product.variants.find((v: any) => {
      const variantOptions = v.options || [];
      return variantOptions.every((opt: any) => options[opt.option_id] === opt.value);
    });
  }, [options, product.variants]);

  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");

  const updateOption = (optionId: string, value: string) => {
    setOptions((prev) => ({ ...prev, [optionId]: value }));
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setIsAdding(true);
    setError("");

    try {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant_id: selectedVariant.id, quantity: 1 }),
      });

      if (res.ok) {
        // Redirect to cart or show success message
        window.location.href = "/cart";
      } else {
        const data = await res.json();
        setError(data.error || "Failed to add to cart");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div class="flex flex-col h-full">
      {product.variants && product.variants.length > 1 && product.options && (
        <div class="mb-8 space-y-6">
          {product.options.map((option: any) => {
            const uniqueValues = Array.from(new Set((option.values || []).map((v: any) => v.value)));
            
            return (
              <div key={option.id} role="radiogroup" aria-labelledby={`option-${option.id}`}>
                <h3 id={`option-${option.id}`} class="font-medium mb-3 text-sm text-gray-500 uppercase tracking-wider">{option.title}</h3>
                <div class="flex flex-wrap gap-3">
                  {uniqueValues.map((val: any) => (
                    <button
                      key={val}
                      role="radio"
                      aria-checked={options[option.id] === val}
                      onClick={() => updateOption(option.id, val)}
                      class={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors ${
                        options[option.id] === val
                          ? "border-black bg-black text-white"
                          : "border-gray-200 hover:border-gray-400 text-gray-900 bg-gray-50"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {error && (
        <div class="mb-4 text-red-600 text-sm font-medium">
          {error}
        </div>
      )}

      <div class="mt-auto pt-8 border-t border-gray-200">
        <button
          onClick={handleAddToCart}
          disabled={isAdding || !selectedVariant}
          class="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-sm disabled:opacity-70"
        >
          {isAdding ? <Loader2 class="w-5 h-5 animate-spin" /> : "Add to Cart"}
        </button>
        <div class="mt-4 flex items-center justify-center gap-6 text-sm text-gray-500">
          <span class="flex items-center gap-1">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              >
              </path>
            </svg>
            In Stock
          </span>
          <span class="flex items-center gap-1">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              >
              </path>
            </svg>
            90-Day Warranty
          </span>
        </div>
      </div>
    </div>
  );
}
