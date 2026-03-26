import { ProfileForm } from "../../islands/ProfileForm.tsx";
import { PasswordForm } from "../../islands/PasswordForm.tsx";

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
      ctx.state.customer = customer;

      ctx.state.title = "Edit Profile - Apple4All";
      ctx.state.description = "Update your personal details and password.";

      return page(customer);
    } catch {
      const headers = new Headers();
      headers.set("Location", "/login");
      headers.set(
        "Set-Cookie",
        `_medusa_jwt=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
      );
      return new Response("", {
        status: 302,
        headers,
      });
    }
  },
});

export default define.page(function ProfilePage(props) {
  // FIXED: Cast directly to HttpTypes.StoreCustomer
  const customer = props.data as HttpTypes.StoreCustomer;

  return (
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 class="text-xl font-semibold mb-4">Edit Profile</h2>

      <div class="space-y-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Profile</h1>
          <p class="text-gray-600">
            View and update your profile information, including your name,
            email, and phone number.
          </p>
        </div>

        <div class="max-w-xl">
          <ProfileForm customer={customer} />
        </div>
      </div>

      <div class="space-y-8 pt-8 border-t border-gray-200">
        <div>
          <h2 class="text-xl font-bold text-gray-900 mb-2">Password</h2>
          <p class="text-gray-600">
            Update your password to keep your account secure.
          </p>
        </div>

        <div class="max-w-xl">
          <PasswordForm />
        </div>
      </div>
    </div>
  );
});