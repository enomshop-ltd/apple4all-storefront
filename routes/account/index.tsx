import { define } from "../../utils.ts";
import { medusa } from "../../lib/sdk.ts";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";
import { HttpTypes } from "@medusajs/types";
import { page } from "fresh";
import AccountDashboard from "../../islands/AccountDashboard.tsx";
import { getStoreCurrency } from "../../lib/data.ts";
export const handler = define.handlers({
  async GET(ctx) {
    const cookies = getCookies(ctx.req.headers);
    const token = cookies["_medusa_jwt"];
    if (!token) {
      console.log("No token found, redirecting to login");
      return new Response("", { status: 302, headers: { Location: "/login" } });
    }
    try {
      console.log("Fetching customer, orders, and currency concurrently");
      const [{ customer }, { orders }, currencyCode] = await Promise.all([
        medusa.store.customer.retrieve(
          { fields: "*addresses,*groups" },
          { Authorization: `Bearer ${token}` },
        ),
        medusa.store.order.list(
          {
            fields:
              "*payment_collections,*payment_collections.payment_sessions,*payment_collections.payments",
          },
          { Authorization: `Bearer ${token}` },
        ),
        getStoreCurrency(),
      ]);
      ctx.state.title = "Account Overview - Apple4All";
      return page({ customer, orders, currencyCode });
    } catch (error) {
      console.error("Error fetching account overview data:", error);
      return new Response("", {
        status: 302,
        headers: {
          Location: "/login",
          "Set-Cookie":
            `_medusa_jwt=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
        },
      });
    }
  },
});
export default define.page(function AccountPage(props) {
  const { customer, orders, currencyCode } = props.data as {
    customer: HttpTypes.StoreCustomer;
    orders: HttpTypes.StoreOrder[];
    currencyCode: string;
  };
  return (
    <AccountDashboard
      customer={customer}
      orders={orders}
      currencyCode={currencyCode}
    />
  );
});
