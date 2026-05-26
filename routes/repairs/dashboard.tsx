import { Head, Partial } from "fresh/runtime";
import CustomerRepairsIsland from "./(_islands)/CustomerRepairsIsland.tsx";

export default function CustomerRepairsRoute() {
  const backendUrl =
    Deno.env.get("MEDUSA_BACKEND_URL") || "http://localhost:9000";

  return (
    <>
      <Head>
        <title>My Repairs | EnomShop</title>
        <meta
          name="description"
          content="Manage and track your repair requests."
        />
        <meta property="og:title" content="My Repairs | EnomShop" />
        <meta
          property="og:description"
          content="Manage and track your repair requests."
        />
        <meta name="view-transition" content="same-origin" />
      </Head>
      <Partial name="repair-content">
        <div className="max-w-6xl mx-auto px-4 py-8" f-client-nav>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">My Repairs</h1>
            <a
              href="/repairs/book"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Book New Repair
            </a>
          </div>
          <div>
            <CustomerRepairsIsland backendUrl={backendUrl} />
          </div>
        </div>
      </Partial>
    </>
  );
}
