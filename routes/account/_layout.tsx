import { define } from "../../lib/utils.ts";
import { Head, Partial } from "fresh/runtime";
import { STORE_NAME } from "../../lib/utils.ts";
import { ChevronDown, ChevronRight } from "lucide-preact";

export default define.page(function AccountLayout({ Component, url, state }) {
  const path = url.pathname;
  let activeTab = "overview";
  if (path.includes("/account/profile")) activeTab = "profile";
  else if (path.includes("/account/addresses")) activeTab = "addresses";
  else if (path.includes("/account/orders")) activeTab = "orders";
  else if (path.includes("/repairs")) activeTab = "repairs";

  const tabs = [
    { id: "overview", label: "Overview", href: "/account" },
  ];

  if (state.hasOrders) {
    tabs.push({ id: "orders", label: "My Orders", href: "/account/orders" });
  }

  if (state.hasRepairs) {
    tabs.push({ id: "repairs", label: "My Repairs", href: "/repairs" });
  }

  const isRepairsActive = activeTab === "repairs";

  return (
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
      <Head>
        <title>{(state.title as string) || `My Account - ${STORE_NAME}`}</title>
        <meta
          name="description"
          content={
            (state.description as string) ||
            `Manage your ${STORE_NAME} account, orders, and preferences.`
          }
        />
      </Head>
      <h1 class="text-3xl font-bold mb-8">My Account</h1>
      <div class="flex flex-col md:flex-row gap-8">
        <aside class="w-full md:w-64">
          <nav class="flex flex-col space-y-1">
            {tabs.map((tab) => (
              <div key={tab.id}>
                <a
                  href={tab.href}
                  f-client-nav={tab.id !== "repairs"}
                  f-partial={tab.id === "repairs" ? tab.href : undefined}
                  class={`flex items-center justify-between px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                  {tab.id === "repairs" && (
                    isRepairsActive ? <ChevronDown class="w-4 h-4 opacity-50" /> : <ChevronRight class="w-4 h-4 opacity-50" />
                  )}
                </a>
                
                {/* Collapsible Submenu for Repairs */}
                {tab.id === "repairs" && isRepairsActive && (
                  <div class="mt-1 ml-4 space-y-1 border-l-2 border-gray-100 pl-3 animate-fade-in">
                    <a
                      href="/repairs/book"
                      f-partial="/repairs/book"
                      class={`block px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        path === "/repairs/book" ? "text-blue-700 bg-blue-50/50" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      Book a Repair
                    </a>
                    <a
                      href="/repairs/track"
                      f-partial="/repairs/track"
                      class={`block px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        path === "/repairs/track" ? "text-blue-700 bg-blue-50/50" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      Track a Repair
                    </a>
                  </div>
                )}
              </div>
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
