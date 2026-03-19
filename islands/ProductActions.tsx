import { useState } from "preact/hooks";
import { Loader2 } from "lucide-react";

export function ProductActions({ product }: { product: any }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]?.id);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setIsAdding(true);
    setError("");

    try {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant_id: selectedVariant, quantity: 1 }),
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
      {product.variants && product.variants.length > 1 && (
        <div class="mb-8">
          <h3 class="font-medium mb-3">Select Variant</h3>
          <div class="flex flex-wrap gap-3">
            {product.variants.map((variant: any) => (
              <button 
                key={variant.id}
                onClick={() => setSelectedVariant(variant.id)}
                class={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-colors ${
                  selectedVariant === variant.id 
                    ? "border-black bg-black text-white" 
                    : "border-gray-300 hover:border-black text-gray-900"
                }`}
              >
                {variant.title}
              </button>
            ))}
          </div>
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
          class="w-full flex items-center justify-center gap-2 bg-[#2B5C8F] hover:bg-[#1e4166] text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-sm disabled:opacity-70"
        >
          {isAdding ? <Loader2 class="w-5 h-5 animate-spin" /> : "Add to Cart"}
        </button>
        <div class="mt-4 flex items-center justify-center gap-6 text-sm text-gray-500">
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            In Stock
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            1-Year Warranty
          </span>
        </div>
      </div>
    </div>
  );
}
