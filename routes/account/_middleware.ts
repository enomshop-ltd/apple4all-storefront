import { FreshContext } from "fresh";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";
import { medusa } from "../../lib/sdk.ts";

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

  try {
    const { orders } = await medusa.store.order.list(
      { fields: "*items,*items.metadata" },
      { Authorization: `Bearer ${token}` },
    );
    // Determine if any order has an item that looks like a repair.
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

    console.log("Found repair items:", JSON.stringify(repairItems, null, 2));
    ctx.state.hasRepairs = repairItems.length > 0;
    ctx.state.repairItems = repairItems;
  } catch (e) {
    ctx.state.hasRepairs = false;
  }

  const resp = await ctx.next();
  return resp;
}
