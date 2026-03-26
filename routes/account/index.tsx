import { define } from "../../utils.ts";
import { medusa } from "../../lib/sdk.ts";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";
import { HttpTypes } from "@medusajs/types";
import { page } from "fresh";

export const handler = define.handlers({
  async GET(ctx) {
    const cookies = getCookies(ctx.req.headers);
    const token = cookies["_medusa_jwt"];

    if (!token) {
      return new Response("", { status: 302, headers: { Location: "/login" } });
    }

    try {
      const { customer } = await medusa.store.customer.retrieve({}, {
        Authorization: `Bearer ${token}`,
      });

      ctx.state.title = "Account Overview - Apple4All";
      ctx.state.description =
        "View your account overview and personal details.";

      return page(customer);
    } catch {
      const headers = new Headers();
      headers.set("Location", "/login");
      headers.set(
        "Set-Cookie",
        `_medusa_jwt=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
      );
      return new Response("", { status: 302, headers });
    }
  },
});

export default define.page(function AccountPage(props) {
  // FIXED: Cast directly to the HttpTypes.StoreCustomer type
  const customer = props.data as HttpTypes.StoreCustomer;

  return (
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
  );
});