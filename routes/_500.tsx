import { Head } from "fresh/runtime";
import { Header } from "../components/Header.tsx";
import { Footer } from "../components/Footer.tsx";
import { ErrorPageProps } from "fresh/runtime";

export default function Error500({ error }: ErrorPageProps) {
  return (
    <div class="min-h-screen bg-[#F9FAFB] font-sans text-gray-900 flex flex-col">
      <Head>
        <title>Server Error - Apple4All</title>
        <meta name="description" content="An unexpected error occurred." />
      </Head>
      <Header />
      <main class="flex-1 flex items-center justify-center px-4">
        <div class="text-center max-w-md">
          <h1 class="text-6xl font-bold text-gray-900 mb-4">500</h1>
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Internal Server Error</h2>
          <p class="text-gray-600 mb-8">
            Oops! Something went wrong on our end. We're working to fix it. Please try again later.
          </p>
          <a
            href="/"
            class="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Return to Store
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
