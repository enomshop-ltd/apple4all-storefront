import { Head } from "fresh/runtime";
import { STORE_NAME } from "../lib/utils.ts";

export default function Error404() {
  return (
    <div class="min-h-screen bg-[#F9FAFB] font-sans text-gray-900 flex flex-col">
      <Head>
        <title>Page Not Found - {STORE_NAME}</title>
        <meta
          name="description"
          content="The page you are looking for does not exist."
        />
      </Head>
      <main class="flex-1 flex items-center justify-center px-4 py-24">
        <div class="text-center max-w-md">
          <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p class="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have
            been moved or doesn't exist.
          </p>
          <a
            href="/"
            class="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Return to Store
          </a>
        </div>
      </main>
    </div>
  );
}
