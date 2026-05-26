import { define } from "../../utils.ts";
import { Head, Partial } from "fresh/runtime";

export default define.page(function AccountLayout({ Component, url, state }) {
  const path = url.pathname;
  let activeTab = "overview";
  if (path.includes("/account/profile")) activeTab = "profile";
  else if (path.includes("/account/addresses")) activeTab = "addresses";
  else if (path.includes("/account/orders")) activeTab = "orders";
  else if (path.includes("/account/repairs")) activeTab = "repairs";

  const tabs = [
    { id: "overview", label: "Overview", href: "/account" },
  ];

  if (state.hasOrders) {
    tabs.push({ id: "orders", label: "My Orders", href: "/account/orders" });
  }

  // Repairs links loading via partials
  const repairTabs = [
    { id: "repairs", label: "My Repairs", href: "/repairs" },
    { id: "repairs-book", label: "↳ Book a Repair", href: "/repairs/book" },
    { id: "repairs-track", label: "↳ Track a Repair", href: "/repairs/track" },
  ];

  return (
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
      <Head>
        <title>{(state.title as string) || "My Account - Apple4All"}</title>
        <meta
          name="description"
          content={
            (state.description as string) ||
            "Manage your Apple4All account, orders, and preferences."
          }
        />
      </Head>
      <h1 class="text-3xl font-bold mb-8">My Account</h1>
      <div class="flex flex-col md:flex-row gap-8">
        <aside class="w-full md:w-64">
          <nav class="flex flex-col space-y-1">
            {tabs.map((tab) => (
              <a
                key={tab.id}
                href={tab.href}
                f-client-nav
                class={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </a>
            ))}
            
            <div class="pt-4 pb-2">
              <span class="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Repairs</span>
            </div>
            
            {repairTabs.map((tab) => (
              <a
                key={tab.id}
                href={tab.href}
                f-partial={tab.href}
                class={`px-4 py-2 text-sm font-medium rounded-md text-left text-gray-600 hover:bg-gray-100 transition`}
              >
                {tab.label}
              </a>
            ))}
          </nav>
        </aside>

        <section class="flex-1">
          <Partial name="repair-content">
            <Component />
          </Partial>
        </section>
      </div>
    </main>
  );
});
