import Image from "../islands/Image.tsx";
import { getPriceInfo } from "../lib/pricing.ts";

export function ProductCard({ product, currencyCode = "USD" }: { product: any, currencyCode?: string }) {
  const { currentPrice, originalPrice, hasDiscount } = getPriceInfo(product, currencyCode);

  return (
    <a href={`/product/${product.handle}`} f-client-nav class="group cursor-pointer flex flex-col gap-4 h-full">
      <div class="aspect-square rounded-2xl overflow-hidden bg-gray-50 p-6 flex items-center justify-center relative">
        <Image src={product.thumbnail} alt={product.title} class="w-full h-full object-contain mix-blend-multiply bg-transparent" />
      </div>
      <div class="flex flex-col gap-1 flex-1">
        <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{product.title}</h3>
        <p class="text-sm text-gray-500 line-clamp-2 flex-1">{product.description}</p>
        <div class="flex items-center gap-2 mt-2">
          <span class="font-bold text-lg">{currentPrice}</span>
          {hasDiscount && (
            <span class="text-sm text-gray-400">
              <span class="line-through">{originalPrice}</span> Discounted
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
