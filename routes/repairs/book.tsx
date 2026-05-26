import { Head, Partial } from "fresh/runtime";
import BookRepairIsland from "./(_islands)/BookRepairIsland.tsx";

export default function BookRepairRoute() {
  const backendUrl =
    Deno.env.get("MEDUSA_BACKEND_URL") || "http://localhost:9000";

  return (
    <>
      <Head>
        <title>Book a Repair | EnomShop</title>
        <meta
          name="description"
          content="Initiate a device for repair and get a pickup."
        />
        <meta property="og:title" content="Book a Repair" />
        <meta
          property="og:description"
          content="Initiate a device for repair and get a pickup."
        />
        <meta name="view-transition" content="same-origin" />
      </Head>
      <Partial name="repair-content">
        <div class="route-container max-w-4xl mx-auto px-4 py-8" f-client-nav>
          <h1 class="text-3xl font-bold mb-6">Book a Repair</h1>
          <p class="text-gray-600 mb-8">
            Provide device details and book it in for a repair. Make sure you
            are logged in.
          </p>
          <div>
            <BookRepairIsland backendUrl={backendUrl} />
          </div>
        </div>
      </Partial>
    </>
  );
}
