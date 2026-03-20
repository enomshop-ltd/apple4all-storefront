import { define } from "../../utils.ts";
import { AccountLayout } from "../../components/AccountLayout.tsx";
import { medusa } from "../../lib/sdk.ts";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";
import { HttpTypes } from "@medusajs/types";
import { Head } from "fresh/runtime";

export const handler = define.handlers({
  async GET(ctx) {
    const cookies = getCookies(ctx.req.headers);
    const token = cookies["_medusa_jwt"];

    if (!token) {
      return new Response("", {
        status: 302,
        headers: { Location: "/login" },
      });
    }

    try {
      const { customer } = await medusa.store.customer.retrieve({
          headers: { Authorization: `Bearer ${token}` }
      });
      ctx.state.customer = customer;
      return ctx.render();
    } catch {
      return new Response("", {
        status: 302,
        headers: { Location: "/login" },
      });
    }
  }
});

export default define.page(function AccountPage(ctx) {
  const customer = ctx.state.customer as HttpTypes.StoreCustomer;

  return (
    <>
      <Head>
        <title>Account Overview - Apple4All</title>
        <meta name="description" content="View your account overview and personal details." />
      </Head>
      <AccountLayout activeTab="overview">
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 class="text-xl font-semibold mb-4">Profile Overview</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p class="text-sm text-gray-500">Name</p>
              <p class="font-medium">{customer.first_name} {customer.last_name}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Email</p>
              <p class="font-medium">{customer.email}</p>
            </div>
          </div>
        </div>
      </AccountLayout>
    </>
  );
});