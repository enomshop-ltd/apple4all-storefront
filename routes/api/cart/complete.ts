import { define } from "../../../utils.ts";
import { medusa } from "../../../lib/sdk.ts";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";

export const handler = define.handlers({
  POST: async (ctx) => {
    try {
      const cookies = getCookies(ctx.req.headers);
      const cartId = cookies["_medusa_cart_id"];
      const body = await ctx.req.json();
      
      if (!cartId) {
        return new Response(JSON.stringify({ error: "Cart not found" }), { status: 404 });
      }

      // 1. Update cart with shipping address and email
      const { cart: updatedCart } = await medusa.store.cart.update(cartId, {
        email: body.email,
        shipping_address: body.shipping_address,
      });

      // 1.5 Add shipping method if not present
      let currentCart = updatedCart;
      if (!currentCart.shipping_methods || currentCart.shipping_methods.length === 0) {
        const { shipping_options } = await medusa.store.fulfillment.listCartOptions({ cart_id: cartId });
        if (shipping_options && shipping_options.length > 0) {
          const { cart: cartWithShipping } = await medusa.store.cart.addShippingMethod(cartId, {
            option_id: shipping_options[0].id,
          });
          currentCart = cartWithShipping;
        }
      }

      // 2. Initialize payment session
      if (body.payment_method !== "manual") {
        return new Response(JSON.stringify({ error: "Credit card payments are not configured yet. Please select Pay on Delivery." }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      // Note: In Medusa v2, payment sessions are handled differently. 
      // For manual payment, we might not need to initiate a session explicitly before complete.

      // 3. Complete cart to create order
      const result = await medusa.store.cart.complete(cartId);

      if (result.type === "cart") {
        return new Response(JSON.stringify({ error: result.error?.message || "Failed to complete checkout", cart: result.cart }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Clear cart cookie
      const headers = new Headers();
      headers.set("Content-Type", "application/json");
      headers.set("Set-Cookie", `_medusa_cart_id=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);

      return new Response(JSON.stringify({ type: result.type, order: result.order }), {
        status: 200,
        headers,
      });
    } catch (e: any) {
      console.error("Checkout error:", e);
      return new Response(JSON.stringify({ error: e.message || "Failed to complete checkout" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
});
