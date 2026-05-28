import { ComponentChildren } from "preact";
import { Head, Partial } from "fresh/runtime";
import { STORE_NAME } from "../lib/utils.ts";

interface AccountLayoutProps {
  children: ComponentChildren;
  activeTab: "overview" | "orders" | "addresses" | "profile";
}

export function AccountLayout({ children, activeTab }: AccountLayoutProps) {
  const tabs = [
    { id: "overview", label: "Overview", href: "/account" },
    { id: "orders", label: "Orders", href: "/account/orders" },
    { id: "addresses", label: "Addresses", href: "/account/addresses" },
    { id: "profile", label: "Profile", href: "/account/profile" },
  ];

  return (
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <Head>
        <title>My Account - {STORE_NAME}</title>
      </Head>
      <Partial name="main">
        <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
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
                <a
                  href="/api/auth/logout"
                  f-client-nav="false"
                  class="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
                >
                  Logout
                </a>
              </nav>
            </aside>
            <section class="flex-1">{children}</section>
          </div>
        </main>
      </Partial>
    </div>
  );
}
