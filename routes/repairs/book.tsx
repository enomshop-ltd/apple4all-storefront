import { Head, Partial } from "fresh/runtime";
import BookRepairIsland from "./(_islands)/BookRepairIsland.tsx";
import { STORE_NAME } from "../../lib/utils.ts";

export default function BookRepairRoute() {
  const backendUrl =
    Deno.env.get("MEDUSA_BACKEND_URL")!;
  const publishableKey = Deno.env.get("MEDUSA_PUBLISHABLE_KEY") || "";

  return (
    <>
      <Head>
        <title>Book a Repair | Urban Device Care</title>
        <meta
          name="description"
          content="Initiate a device for repair and get a pickup."
        />
        <meta property="og:title" content={`Book a Repair | ${STORE_NAME}`} />
        <meta
          property="og:description"
          content="Initiate a device for repair and get a pickup."
        />
        <meta name="view-transition" content="same-origin" />
      </Head>
      <Partial name="repair-content">
        <div class="route-container max-w-4xl mx-auto px-4 py-8" f-client-nav>
          <div class="mb-8">
            <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">Book a Repair</h1>
            <p class="text-slate-600">
              Provide device details and book it in for a repair.
            </p>
          </div>
          <div>
            <BookRepairIsland />
          </div>
        </div>
      </Partial>
    </>
  );
}
