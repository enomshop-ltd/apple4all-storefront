import { define } from "../../utils.ts";
import { AccountLayout } from "../../components/AccountLayout.tsx";
import { medusa } from "../../lib/sdk.ts";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";

export default define.page(async function AddressesPage(ctx) {
  const cookies = getCookies(ctx.req.headers);
  const token = cookies["_medusa_jwt"];

  if (!token) {
    return new Response("", { status: 302, headers: { Location: "/login" } });
  }

  try {
    const { customer } = await medusa.store.customer.retrieve({
      fields: "*addresses",
      headers: { Authorization: `Bearer ${token}` }
    });

    return (
      <AccountLayout activeTab="addresses">
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 class="text-xl font-semibold mb-4">Saved Addresses</h2>
          {customer.addresses.length === 0 ? (
            <p class="text-gray-500">No addresses saved.</p>
          ) : (
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customer.addresses.map((addr: any) => (
                <div key={addr.id} class="p-4 border rounded-md">
                  <p>{addr.address_1}</p>
                  <p>{addr.city}, {addr.province} {addr.postal_code}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </AccountLayout>
    );
  } catch {
    return new Response("", { status: 302, headers: { Location: "/login" } });
  }
});