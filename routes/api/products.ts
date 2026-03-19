import { medusa } from "../../lib/sdk.ts";
import { getStoreCurrency } from "../../lib/data.ts";
import { define } from "../../utils.ts";

export const handler = define.handlers({
  GET: async (ctx) => {
    const url = new URL(ctx.req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "12");
    const sort = url.searchParams.get("sort") || "-created_at";
    const q = url.searchParams.get("q") || "";

    try {
      const query: any = {
        limit,
        offset: (page - 1) * limit,
        order: sort,
      };
      if (q) query.q = q;

      // Fetch region to get region_id for calculated prices
      const { regions } = await medusa.store.region.list();
      const region = regions?.[0];
      if (region) {
        query.region_id = region.id;
      }

      const [{ products, count }, currencyCode] = await Promise.all([
        medusa.store.product.list(query),
        getStoreCurrency()
      ]);
      
      return new Response(JSON.stringify({ products, count, isError: false, currencyCode }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e: any) {
      console.error("API Error fetching products:", e);
      return new Response(JSON.stringify({ products: [], count: 0, isError: true, error: e.message, currencyCode: "USD" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
});
