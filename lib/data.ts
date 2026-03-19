import { medusa } from "./sdk.ts";

export async function getStoreCurrency() {
  try {
    const { regions } = await medusa.store.region.list();
    if (regions && regions.length > 0) {
      return regions[0].currency_code;
    }
  } catch (e) {
    console.warn("Failed to fetch regions, defaulting to USD");
  }
  return "USD";
}

export async function getProducts(collectionHandle?: string) {
  try {
    // Medusa v2 SDK usage
    const query: any = {};
    if (collectionHandle) {
      // Fetch collection first to get its ID
      const { collections } = await medusa.store.collection.list({
        handle: collectionHandle
      });
      
      if (collections && collections.length > 0) {
        query.collection_id = [collections[0].id];
      }
    }
    
    const { products } = await medusa.store.product.list(query);
    
    if (products && products.length > 0) {
      return products;
    }
    return [];
  } catch (e) {
    console.error(`Failed to fetch data for ${collectionHandle || 'products'}. Error:`, e);
    throw e;
  }
}
