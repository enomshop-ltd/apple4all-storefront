import { medusa } from "../../lib/sdk.ts";
import { getStoreCurrency } from "../../lib/data.ts";
import { define } from "../../lib/utils.ts";
import { getCookies } from "jsr:@std/http@0.224.0/cookie";

export const handler = define.handlers({
  GET: async (ctx) => {
    const url = new URL(ctx.req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "12");
    const sort = url.searchParams.get("sort") || "-created_at";
    const q = url.searchParams.get("q") || "";
    const categoryHandle = url.searchParams.get("category") || "";

    const cookies = getCookies(ctx.req.headers);
    const token = cookies["_medusa_jwt"];

    try {
      const query: Record<string, string | number | string[]> = {
        limit,
        offset: (page - 1) * limit,
        order: sort,
        fields: "*variants,*variants.options,*options,*options.values,+variants.inventory_quantity,+variants.manage_inventory,+variants.allow_backorder",
      };
      if (q) query.q = q;

      if (categoryHandle) {
        const { product_categories } = await medusa.store.category.list({
          handle: categoryHandle,
        });
        if (product_categories && product_categories.length > 0) {
          query.category_id = [product_categories[0].id];
        } else {
          return new Response(
            JSON.stringify({
              products: [],
              count: 0,
              isError: false,
              currencyCode: "USD",
            }),
            {
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      }

      // Fetch region to get region_id for calculated prices
      const { regions } = await medusa.store.region.list();
      const region = regions?.[0];
      if (region) {
        query.region_id = region.id;
      }

      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const [{ products, count }, currencyCode] = await Promise.all([
        medusa.store.product.list(query, headers),
        getStoreCurrency(),
      ]);

      return new Response(
        JSON.stringify({ products, count, isError: false, currencyCode }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (e: unknown) {
      console.error("API Error fetching products:", e);
      return new Response(
        JSON.stringify({
          products: [],
          count: 0,
          isError: true,
          error: e instanceof Error ? e.message : "Unknown error",
          currencyCode: "USD",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },
});
