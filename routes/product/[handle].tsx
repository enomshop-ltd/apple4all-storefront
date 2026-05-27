import { Head } from "fresh/runtime";
import { define } from "../../lib/utils.ts";
import { medusa } from "../../lib/sdk.ts";
import { getStoreRegion } from "../../lib/data.ts";
import { ProductDetails } from "../../islands/ProductDetails.tsx";
import { HttpTypes } from "@medusajs/types";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";
import { STORE_NAME } from "../../lib/utils.ts";

export default define.page(async function ProductPage(ctx) {
  const handle = ctx.params.handle;
  let product: HttpTypes.StoreProduct | null = null;
  let currencyCode = "USD";

  const cookies = getCookies(ctx.req.headers);
  const token = cookies["_medusa_jwt"];

  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const region = await getStoreRegion();
    currencyCode = region?.currency_code || "USD";

    const query: Record<string, unknown> = { handle, fields: "*variants,*variants.options,*options,*options.values,+variants.inventory_quantity,+variants.manage_inventory,+variants.allow_backorder" };
    if (region?.id) {
      query.region_id = region.id;
    }

    const [productRes] = await Promise.all([
      medusa.store.product.list(query, headers),
    ]);
    if (productRes.products && productRes.products.length > 0) {
      product = productRes.products[0];
    }
  } catch (e) {
    console.error("Failed to fetch product", e);
  }

  if (!product) {
    return (
      <main class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-2xl font-bold mb-2">Product not found</h1>
          <p class="text-gray-600 mb-6">
            The product you are looking for does not exist.
          </p>
          <a
            href="/"
            f-client-nav
            class="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Back to Store
          </a>
        </div>
      </main>
    );
  }

  return (
    <main class="flex-1">
      <Head>
        <title>{product.title} - {STORE_NAME}</title>
        <meta
          name="description"
          content={product.description || `Buy ${product.title} at {STORE_NAME}`}
        />
        <meta property="og:title" content={`${product.title} - ${STORE_NAME}`} />
        <meta
          property="og:description"
          content={product.description || `Buy ${product.title} at {STORE_NAME}`}
        />
        {product.thumbnail && (
          <meta property="og:image" content={product.thumbnail} />
        )}
      </Head>

      <ProductDetails product={product} currencyCode={currencyCode} />
    </main>
  );
});
