import { define } from "../../utils.ts";
import { AccountLayout } from "../../components/AccountLayout.tsx";
import { medusa } from "../../lib/sdk.ts";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";

export default define.page(async function AccountPage(ctx) {
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

    return (
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
    );
  } catch {
    return new Response("", {
      status: 302,
      headers: { Location: "/login" },
    });
  }
});