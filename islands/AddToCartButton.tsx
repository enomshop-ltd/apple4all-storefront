import { useState } from "preact/hooks";
import { Loader2 } from "lucide-preact";

export function AddToCartButton(
  { variantId, regionId }: { variantId: string; regionId?: string },
) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddToCart = async () => {
    if (!variantId) return;

    setIsLoading(true);
    setSuccess(false);

    globalThis.dispatchEvent(new Event("fresh:client-nav-start"));
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variant_id: variantId,
          quantity: 1,
          region_id: regionId,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          // Optional: redirect to cart or show mini-cart
          globalThis.location.href = "/cart";
        }, 1000);
      } else {
        globalThis.dispatchEvent(new Event("fresh:client-nav-end"));
      }
    } catch (e) {
      globalThis.dispatchEvent(new Event("fresh:client-nav-end"));
      console.error("Failed to add to cart", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={isLoading || !variantId}
      class="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
    >
      {isLoading
        ? (
          <>
            <Loader2 class="w-5 h-5 animate-spin" />
            Adding...
          </>
        )
        : success
        ? (
          "Added to Cart!"
        )
        : (
          "Add to Cart"
        )}
    </button>
  );
}
