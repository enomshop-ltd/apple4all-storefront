import { Handlers } from "$fresh/server.ts";
import { getProducts } from "../lib/data.ts";

export const handler: Handlers = {
  async GET(req, _ctx) {
    const url = new URL(req.url);
    const origin = url.origin;

    const staticRoutes = [
      "/",
      "/about/our-story",
      "/about/careers",
      "/about/contact",
      "/services/repairs",
      "/services/guides",
      "/services/trade-in",
      "/services/financing",
      "/legal/terms",
      "/legal/privacy",
      "/legal/cookies",
      "/shop/iphone",
      "/shop/ipad",
      "/shop/mac",
      "/shop/watch",
    ];

    let products: any[] = [];
    try {
      products = await getProducts();
    } catch (e) {
      console.error("Failed to fetch products for sitemap:", e);
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticRoutes
    .map(
      (route) => `
  <url>
    <loc>${origin}${route}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  `,
    )
    .join("")}
  ${products
    .map(
      (product) => `
  <url>
    <loc>${origin}/product/${product.handle}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  `,
    )
    .join("")}
</urlset>`;

    return new Response(sitemap.trim(), {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  },
};
