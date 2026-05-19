import { useState } from "preact/hooks";
import { Loader2, ChevronDown, ChevronUp } from "lucide-preact";
import { HttpTypes } from "@medusajs/types";
import { getPriceInfo } from "../lib/pricing.ts";
import { marked } from "marked";

export function ProductDetails({
  product,
  currencyCode,
}: {
  product: HttpTypes.StoreProduct;
  currencyCode: string;
}) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants?.[0]?.id,
  );
  const [selectedImage, setSelectedImage] = useState(
    product.thumbnail || product.images?.[0]?.url,
  );
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const selectedVariant = product.variants?.find(
    (v) => v.id === selectedVariantId,
  );
  const { currentPrice, originalPrice, hasDiscount } = getPriceInfo(
    product,
    currencyCode,
    selectedVariant,
  );

  const isOutOfStock = selectedVariant
    ? selectedVariant.manage_inventory === true &&
      selectedVariant.allow_backorder === false &&
      (selectedVariant.inventory_quantity === null || selectedVariant.inventory_quantity <= 0)
    : false;

  const handleAddToCart = async () => {
    if (!selectedVariantId) return;
    setIsAdding(true);
    setError("");

    globalThis.dispatchEvent(new Event("fresh:client-nav-start"));
    try {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant_id: selectedVariantId, quantity: 1 }),
      });

      if (res.ok) {
        globalThis.location.href = "/cart";
      } else {
        globalThis.dispatchEvent(new Event("fresh:client-nav-end"));
        const data = await res.json();
        setError(data.error || "Failed to add to cart");
      }
    } catch (_err) {
      globalThis.dispatchEvent(new Event("fresh:client-nav-end"));
      setError("An error occurred. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <main class="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex flex-col justify-center">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Product Images */}
        <div class="flex flex-col gap-3">
          <div class="aspect-[4/3] max-h-[40vh] md:max-h-[50vh] rounded-2xl overflow-hidden bg-white p-4 flex items-center justify-center border border-gray-100 shadow-sm transition-all duration-300 ease-in-out">
            <img
              key={selectedImage}
              src={selectedImage}
              alt={product.title}
              class="w-full h-full object-contain mix-blend-multiply bg-transparent animate-in fade-in duration-300"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div class="grid grid-cols-5 gap-2">
              {product.images.map((img: HttpTypes.StoreProductImage) => (
                <button
                  type="button"
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  class={`aspect-square rounded-lg overflow-hidden bg-white p-1.5 border transition-all duration-200 ${
                    selectedImage === img.url
                      ? "border-black ring-1 ring-black shadow-sm"
                      : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={product.title}
                    class="w-full h-full object-contain mix-blend-multiply bg-transparent"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div class="flex flex-col h-full">
          <div class="mb-4">
            <h1 class="text-2xl md:text-3xl font-bold mb-1">{product.title}</h1>
            <div class="flex items-center gap-2 mb-3">
              <span class="text-lg font-medium text-gray-500">
                {currentPrice}
              </span>
              {hasDiscount && (
                <span class="text-sm text-gray-400 line-through">
                  {originalPrice}
                </span>
              )}
            </div>
            <div class="relative w-full">
              <div
                class={`w-full text-gray-700 text-sm leading-relaxed prose prose-sm prose-gray max-w-none prose-p:my-2 prose-headings:font-semibold prose-headings:text-sm prose-headings:mb-1 prose-headings:mt-3 prose-a:text-[#2B5C8F] prose-li:my-0.5 ${!isDescriptionExpanded ? "max-h-[8rem] overflow-hidden" : ""}`}
                dangerouslySetInnerHTML={{
                  __html: product.description
                    ? (marked.parse(product.description.replace(/\\n/g, "\n"), {
                        breaks: true,
                      }) as string)
                    : "",
                }}
              />
              {product.description && product.description.length > 200 && (
                <div
                  class={`flex justify-center mt-3 ${!isDescriptionExpanded ? "pt-4 border-t border-gray-200" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setIsDescriptionExpanded(!isDescriptionExpanded)
                    }
                    class="group relative inline-flex items-center gap-1 font-medium text-sm text-[#2B5C8F] hover:text-[#1e4166] focus:outline-none transition-colors"
                  >
                    {isDescriptionExpanded ? (
                      <>
                        Show Less <ChevronUp class="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Read More <ChevronDown class="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Variants and Actions */}
          <div class="mt-auto flex flex-col">
            {product.variants && product.variants.length > 1 && product.options && (
              <div class="mb-6 space-y-4">
                {product.options.map((option: any) => {
                  const uniqueValues = Array.from(new Set((option.values || []).map((v: any) => v.value)));
                  
                  // Helper options state parsing
                  const getSelectedOptionMap = () => {
                    const currentMap: Record<string, string> = {};
                    if (selectedVariant && selectedVariant.options) {
                      selectedVariant.options.forEach((opt: any) => {
                        currentMap[opt.option_id] = opt.value;
                      });
                    }
                    return currentMap;
                  };

                  const currentOptions = getSelectedOptionMap();
                  
                  // To update an option, find a variant that matches the other options + the new option value
                  const updateOption = (optionId: string, val: string) => {
                    const nextOptions = { ...currentOptions, [optionId]: val };
                    let bestMatch = product.variants?.find((v: any) => {
                      return v.options?.every((opt: any) => nextOptions[opt.option_id] === opt.value);
                    });
                    
                    // If no exact match (sometimes options combinations are invalid), just pick any variant with the new value
                    if (!bestMatch) {
                       bestMatch = product.variants?.find((v: any) => {
                         return v.options?.some((opt: any) => opt.option_id === optionId && opt.value === val);
                       });
                    }

                    if (bestMatch && bestMatch.id) {
                       setSelectedVariantId(bestMatch.id);
                    }
                  };

                  return (
                    <div key={option.id} role="radiogroup" aria-labelledby={`option-${option.id}`}>
                      <h3
                        id={`option-${option.id}`}
                        class="font-medium mb-2 text-xs text-gray-700 uppercase tracking-wider"
                      >
                        {option.title}
                      </h3>
                      <div class="flex flex-wrap gap-2">
                        {uniqueValues.map((val: any) => {
                            const isSelected = currentOptions[option.id] === val;
                            return (
                              <button
                                type="button"
                                key={val}
                                role="radio"
                                aria-checked={isSelected}
                                onClick={() => updateOption(option.id, val)}
                                class={`px-3 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-black transition-colors text-sm ${
                                  isSelected
                                    ? "border-black bg-black text-white"
                                    : "border-gray-300 hover:border-black text-gray-900 bg-gray-50"
                                }`}
                              >
                                {val}
                              </button>
                            );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {error && (
              <div class="mb-3 text-red-600 text-sm font-medium">{error}</div>
            )}

            <div class="pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding || !selectedVariantId || isOutOfStock}
                class={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-base transition-colors shadow-sm disabled:opacity-70 ${
                  isOutOfStock
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-900 hover:bg-black text-white"
                }`}
              >
                {isAdding ? (
                  <Loader2 class="w-5 h-5 animate-spin" />
                ) : isOutOfStock ? (
                  "Out of Stock"
                ) : (
                  "Add to Cart"
                )}
              </button>
              <div class="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500">
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
                    ></path>
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
                    ></path>
                  </svg>
                  90-Day Warranty
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
