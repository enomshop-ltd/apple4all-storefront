import { define } from "../../lib/utils.ts";
import { Head, Partial } from "fresh/runtime";
import TrackRepairIsland from "./(_islands)/TrackRepairIsland.tsx";
import { page } from "fresh";

export const handler = define.handlers({
  GET(ctx) {
    const backendUrl = Deno.env.get("MEDUSA_BACKEND_URL")!;
    const publishableKey = Deno.env.get("MEDUSA_PUBLISHABLE_KEY") || "";
    const isLoggedIn = Boolean(ctx.state.isLoggedIn);

    return page({ backendUrl, publishableKey, isLoggedIn });
  }
});

export default define.page(function TrackRepairRoute(props) {
  const { backendUrl, publishableKey, isLoggedIn } = props.data;
  const token = props.url.searchParams.get("token") || "";
  const ticket = props.url.searchParams.get("ticket") || props.url.searchParams.get("serial") || "";

  console.debug(`[TrackRepairRoute] Rendered with backendUrl: ${backendUrl}, isLoggedIn: ${isLoggedIn}`);

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
          <div>
            <TrackRepairIsland
              backendUrl={backendUrl}
              initialToken={token}
              initialTicket={ticket}
              publishableApiKey={publishableKey}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </div>
      </Partial>
    </>
  );
});
