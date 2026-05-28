import { define } from "../../lib/utils.ts";

export default define.page(function LegalLayout({ Component }) {
  return (
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
      <div class="w-full">
        <Component />
      </div>
    </main>
  );
});
