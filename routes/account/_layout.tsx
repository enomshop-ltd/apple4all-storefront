import { Partial } from "fresh/runtime";
import { define } from "../../utils.ts";
import { Header } from "../../components/Header.tsx";
import { Footer } from "../../components/Footer.tsx";
import { AccountNav } from "../../islands/AccountNav.tsx";

export default define.layout(function AccountLayout({ Component, state, url }) {
  return (
    <div class="min-h-screen bg-[#F9FAFB] font-sans text-gray-900 flex flex-col">
      <Header />
      
      <Partial name="main">
        <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
          <div class="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
            <AccountNav currentPath={url.pathname} />
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
              <Component />
            </div>
          </div>
        </main>
      </Partial>

      <Footer />
    </div>
  );
});
