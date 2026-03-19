export function PromoBanner() {
  return (
    <div class="flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm w-full">
      <div class="md:w-1/3 relative bg-[#d4ff59] overflow-hidden min-h-[200px] flex items-center justify-center">
        {/* Concentric circles background */}
        <div class="absolute inset-0 flex items-center justify-center opacity-90">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              class="absolute rounded-full border-[16px] border-[#1a1a1a]"
              style={{
                width: `${(i + 1) * 60}px`,
                height: `${(i + 1) * 60}px`,
              }}
            />
          ))}
        </div>
        {/* iPhone Image */}
        <img 
          src="https://picsum.photos/seed/iphone-promo/300/400" 
          alt="iPhone" 
          class="relative z-10 h-48 object-contain transform -rotate-12 drop-shadow-2xl"
          referrerPolicy="no-referrer"
        />
      </div>
      <div class="md:w-2/3 p-6 md:p-8 flex flex-col justify-center relative">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex-1">
            <p class="text-sm text-gray-500 mb-2">iPhones</p>
            <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              Best iPhone for photos in 2026: Ultimate buyer's guide | Back Market
            </h2>
            <p class="text-gray-600 text-sm md:text-base leading-relaxed">
              Expert-tested guide to the 7 best iPhones for photography in 2026. Compare camera quality, features, and value to find your perfect match—from flagship Pro models to an iPhone under $200.
            </p>
          </div>
          <div class="flex-shrink-0">
            <a href="/product/iphone" f-client-nav class="inline-block px-6 py-2.5 bg-white border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
              See more
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
