import { Head } from "fresh/runtime";
import TrackRepairIsland from "./(_islands)/TrackRepairIsland.tsx";

export default function TrackRepairRoute(req: Request) {
  // Pass the backend URL from the Fresh server environment (Deno.env) safely to the island.
  const backendUrl =
    Deno.env.get("MEDUSA_BACKEND_URL") || "http://localhost:9000";
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  const ticket = url.searchParams.get("ticket") || url.searchParams.get("serial") || "";

  console.debug(`[TrackRepairRoute] Rendered with backendUrl: ${backendUrl}`);

  return (
    <>
      <Head>
        <title>Track Your Repair | UrbanDeviceCare</title>
        <meta
          name="description"
          content="Track your device repair ticket status."
        />
        <meta property="og:title" content="Track Your Repair" />
        <meta
          property="og:description"
          content="Track your device repair ticket status."
        />
      </Head>
      <div class="route-container">
        {/* Fresh 2.3+ partial injection placeholder if needed */}
        <div f-client-nav f-view-transition>
          <TrackRepairIsland backendUrl={backendUrl} initialToken={token} initialTicket={ticket} />
        </div>
      </div>
    </>
  );
}
