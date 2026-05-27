import { Head, Partial } from "fresh/runtime";
import CustomerRepairsIsland from "./(_islands)/CustomerRepairsIsland.tsx";
import { STORE_NAME } from "../../lib/utils.ts";

export default function CustomerRepairsRoute() {
  const backendUrl =
    Deno.env.get("MEDUSA_BACKEND_URL")!;
  const publishableKey = Deno.env.get("MEDUSA_PUBLISHABLE_KEY") || "";

  return (
    <>
      <Head>
        <title>My Repairs | {STORE_NAME}</title>
        <meta
          name="description"
          content="Manage and track your repair requests."
        />
        <meta property="og:title" content={`My Repairs | ${STORE_NAME}`} />
        <meta
          property="og:description"
          content="Manage and track your repair requests."
        />
        <meta name="view-transition" content="same-origin" />
      </Head>
      <Partial name="repair-content">
        <div class="max-w-6xl mx-auto px-4 py-8" f-client-nav>
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">My Repairs</h1>
            <a
              href="/repairs/book"
              class="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 transition"
            >
              Book New Repair
            </a>
          </div>
          <div>
            <CustomerRepairsIsland
              backendUrl={backendUrl}
              publishableApiKey={publishableKey}
            />
          </div>
        </div>
      </Partial>
    </>
  );
}