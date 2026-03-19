import { Head, Partial } from "fresh/runtime";
import { define } from "../../utils.ts";
import { Header } from "../../components/Header.tsx";
import { Footer } from "../../components/Footer.tsx";
import { medusa } from "../../lib/sdk.ts";
import { getStoreCurrency } from "../../lib/data.ts";
import { getPriceInfo } from "../../lib/pricing.ts";
import Image from "../../islands/Image.tsx";
import { ProductActions } from "../../islands/ProductActions.tsx";

export default define.page(async function ProductPage(ctx) {
  const handle = ctx.params.handle;
  let product = null;
  let currencyCode = "USD";

  try {
    const [productRes, currency] = await Promise.all([
      medusa.store.product.list({ handle }),
      getStoreCurrency()
    ]);
    if (productRes.products && productRes.products.length > 0) {
      product = productRes.products[0];
    }
    currencyCode = currency;
  } catch (e) {
    console.error("Failed to fetch product", e);
  }

  if (!product) {
    return (
      <div class="min-h-screen bg-[#F9FAFB] font-sans text-gray-900 flex flex-col">
        <Header />
        <main class="flex-1 flex items-center justify-center">
          <div class="text-center">
            <h1 class="text-2xl font-bold mb-2">Product not found</h1>
            <p class="text-gray-600 mb-6">The product you are looking for does not exist.</p>
            <a href="/" f-client-nav class="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Back to Store
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { currentPrice, originalPrice, hasDiscount } = getPriceInfo(product, currencyCode);

  return (
    <div class="min-h-screen bg-[#F9FAFB] font-sans text-gray-900 flex flex-col">
      <Head>
        <title>{product.title} - Apple4All</title>
        <meta name="description" content={product.description || `Buy ${product.title} at Apple4All`} />
        <meta property="og:title" content={`${product.title} - Apple4All`} />
        <meta property="og:description" content={product.description || `Buy ${product.title} at Apple4All`} />
        {product.thumbnail && <meta property="og:image" content={product.thumbnail} />}
      </Head>

      <Header />

      <Partial name="main">
        <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product Images */}
            <div class="flex flex-col gap-4">
              <div class="aspect-square rounded-3xl overflow-hidden bg-white p-8 flex items-center justify-center border border-gray-100 shadow-sm">
                <Image src={product.thumbnail} alt={product.title} class="w-full h-full object-contain mix-blend-multiply bg-transparent" />
              </div>
              {product.images && product.images.length > 1 && (
                <div class="grid grid-cols-4 gap-4">
                  {product.images.slice(0, 4).map((img: any) => (
                    <div class="aspect-square rounded-xl overflow-hidden bg-white p-2 border border-gray-100 cursor-pointer hover:border-blue-500 transition-colors">
                      <Image src={img.url} alt={product.title} class="w-full h-full object-contain mix-blend-multiply bg-transparent" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div class="flex flex-col">
              <div class="mb-6">
                <h1 class="text-3xl md:text-4xl font-bold mb-2">{product.title}</h1>
                <div class="flex items-center gap-3 mb-4">
                  <span class="text-3xl font-bold">{currentPrice}</span>
                  {hasDiscount && (
                    <span class="text-lg text-gray-400 line-through">{originalPrice}</span>
                  )}
                </div>
                <p class="text-gray-600 text-lg leading-relaxed">{product.description}</p>
              </div>

              {/* Variants and Actions */}
              <div class="mt-auto">
                <ProductActions product={product} />
              </div>
            </div>
          </div>
        </main>
      </Partial>

      <Footer />
    </div>
  );
});
