import { Head, Partial } from "fresh/runtime";
import BookRepairIsland from "./(_islands)/BookRepairIsland.tsx";
import { STORE_NAME, define } from "../../lib/utils.ts";

export default define.page(function BookRepairRoute(props) {
  return (
    <>
      <Head>
        <title>Book a Repair | {STORE_NAME}</title>
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
        <div class="route-container max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24" f-client-nav={false}>
          <div class="mb-16 border-b border-black pb-8">
            <h1 class="text-5xl md:text-7xl font-[Oswald] uppercase tracking-tighter leading-none text-slate-900 mb-6">
              Book a<br/>Repair
            </h1>
            <p class="text-xl font-serif italic text-slate-500 max-w-2xl">
              Provide your device details and we'll get it fixed as soon as possible.
            </p>
          </div>
          <div>
            <BookRepairIsland />
          </div>
        </div>
      </Partial>
    </>
  );
});
