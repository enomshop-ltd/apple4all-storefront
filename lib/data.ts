import { medusa } from "./sdk.ts";

export async function getStoreRegion() {
  try {
    const { regions } = await medusa.store.region.list();
    if (regions && regions.length > 0) {
      return regions[0];
    }
  } catch (_e) {
    console.warn("Failed to fetch regions");
  }
  return null;
}

export async function getStoreCurrency() {
  const region = await getStoreRegion();
  return region?.currency_code || "USD";
}

export async function getProducts(
  collectionHandle?: string,
  headers?: Record<string, string>,
) {
  try {
    const region = await getStoreRegion();

    // Medusa v2 SDK usage
    const query: Record<string, string | string[]> = {};
    if (region?.id) {
      query.region_id = region.id;
    }

    if (collectionHandle) {
      // Fetch collection first to get its ID
      const { collections } = await medusa.store.collection.list({
        handle: collectionHandle,
      }, headers);

      if (collections && collections.length > 0) {
        query.collection_id = [collections[0].id];
      }
    }

    const { products } = await medusa.store.product.list(query, headers);

    if (products && products.length > 0) {
      return products;
    }
    return [];
  } catch (e) {
    console.error(
      `Failed to fetch data for ${collectionHandle || "products"}. Error:`,
      e,
    );
    throw e;
  }
}
