import { medusa } from "./lib/sdk.ts";

async function run() {
  try {
    const res = await medusa.store.category.list({});
    console.log("Categories:", res.product_categories.map((c: any) => c.handle));
  } catch(e) {
    console.error("Error with category.list", e.message);
  }
}
run();
