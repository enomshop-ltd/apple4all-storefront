import { define } from "../../lib/utils.ts";

export default define.page(function ServicesLayout({ Component }) {
  return (
    <main class="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
      <div class="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
        <Component />
      </div>
    </main>
  );
});
