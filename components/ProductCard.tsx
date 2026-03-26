import Image from "../islands/Image.tsx";
import { getPriceInfo } from "../lib/pricing.ts";
import { HttpTypes } from "@medusajs/types";

export function ProductCard(
  { product, currencyCode = "USD" }: {
    product: HttpTypes.StoreProduct;
    currencyCode?: string;
  },
) {
  const { currentPrice, originalPrice, hasDiscount } = getPriceInfo(
    product,
    currencyCode,
  );

  return (
    <a
      href={`/product/${product.handle}`}
      f-client-nav
      class="group cursor-pointer flex flex-col h-full bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      aria-label={`View details for ${product.title}`}
    >
      <div class="aspect-square overflow-hidden bg-transparent p-4 flex items-center justify-center relative mb-4">
        <Image
          src={product.thumbnail}
          alt={product.title}
          class="w-full h-full object-contain mix-blend-multiply bg-transparent"
        />
      </div>
      <div class="flex flex-col gap-1 flex-1">
        <h3 class="font-semibold text-gray-900 transition-colors">
          {product.title}
        </h3>
        <div
          class="flex items-center gap-1 text-xs text-gray-600 my-1"
          aria-label="Rating: 4.5 out of 5 stars"
        >
          <span class="text-yellow-500" aria-hidden="true">★★★★☆</span>
          <span>4.5/5 (123)</span>
        </div>
        <p class="text-xs text-gray-500 mt-2">Starting at</p>
        <div class="flex items-baseline gap-2">
          <span class="font-bold text-xl">{currentPrice}</span>
        </div>
        {hasDiscount && (
          <p class="text-xs text-gray-500 mt-1">
            <span class="line-through">{originalPrice}</span> new
          </p>
        )}
      </div>
    </a>
  );
}
