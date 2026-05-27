import { FreshContext } from "fresh";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";
import { medusa, medusaUrl } from "../../lib/sdk.ts";

export async function handler(ctx: FreshContext) {
  const cookies = getCookies(ctx.req.headers);
  const token = cookies["_medusa_jwt"];

  if (!token) {
    const url = new URL(ctx.req.url);
    url.pathname = "/login";
    return Response.redirect(url, 302);
  }

  // Pass the token to the state
  ctx.state.token = token;
  const pubKey = Deno.env.get("MEDUSA_PUBLISHABLE_KEY") || "";

  try {
    const [ordersResult, repairsRes] = await Promise.all([
      medusa.store.order.list(
        { fields: "*items,*items.metadata" },
        { Authorization: `Bearer ${token}` },
      ),
      fetch(`${medusaUrl}/store/customers/me/repairs`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "x-publishable-api-key": pubKey 
        },
      }),
    ]);

    // Handle orders
    const { orders } = ordersResult;
    ctx.state.hasOrders = orders && orders.length > 0;
    
    const repairItems: any[] = [];
    orders.forEach((order) => {
      order.items?.forEach((item: any) => {
        if (
          item.title?.toLowerCase().includes("repair") ||
          item.metadata?.repair_ticket_id ||
          item.metadata?.ticket_token ||
          item.product_title?.toLowerCase().includes("repair")
        ) {
          repairItems.push({ orderId: order.id, item: item });
        }
      });
    });

    // Handle repairs from the authenticated endpoint
    let fetchedRepairs: any[] = [];
    if (repairsRes.ok) {
      const data = await repairsRes.json();
      fetchedRepairs = data.repairs || [];
    }
    
    // We have repairs if fetchedRepairs is not empty, or if we fell back to finding them in orders
    ctx.state.hasRepairs = fetchedRepairs.length > 0 || repairItems.length > 0;
    ctx.state.repairItems = repairItems;
    ctx.state.repairs = fetchedRepairs;
  } catch (e) {
    ctx.state.hasOrders = false;
    ctx.state.hasRepairs = false;
    ctx.state.repairItems = [];
    ctx.state.repairs = [];
  }

  const resp = await ctx.next();
  return resp;
}