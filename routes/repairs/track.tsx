import { Head, Partial } from "fresh/runtime";
import TrackRepairIsland from "./(_islands)/TrackRepairIsland.tsx";

export default function TrackRepairRoute(req: Request) {
  // Pass the backend URL from the Fresh server environment (Deno.env) safely to the island.
  const backendUrl =
    Deno.env.get("MEDUSA_BACKEND_URL") || "http://localhost:9000";
  const publishableKey = Deno.env.get("MEDUSA_PUBLISHABLE_KEY") || "";
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  const ticket = url.searchParams.get("ticket") || url.searchParams.get("serial") || "";

  console.debug(`[TrackRepairRoute] Rendered with backendUrl: ${backendUrl}`);

  return (
    <>
      <Head>
        <title>Track Your Repair | EnomShop</title>
        <meta
          name="description"
          content="Track your device repair ticket status."
        />
        <meta property="og:title" content="Track Your Repair" />
        <meta
          property="og:description"
          content="Track your device repair ticket status."
        />
        <meta name="view-transition" content="same-origin" />
      </Head>
      <Partial name="repair-content">
        <div class="route-container" f-client-nav>
          {/* Fresh 2.3+ partial injection placeholder if needed */}
          <div>
            <TrackRepairIsland
              backendUrl={backendUrl}
              initialToken={token}
              initialTicket={ticket}
              publishableApiKey={publishableKey}
            />
          </div>
        </div>
      </Partial>
    </>
  );
}
