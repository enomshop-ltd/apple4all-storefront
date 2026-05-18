import { medusa } from "./lib/sdk.ts";
async function test() {
  console.log("Publishable key config:", medusa.client.config);
  try {
    const res = await medusa.store.category.list({ });
    console.log("Categories found:", res.product_categories?.length);
    console.log(res.product_categories);
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
