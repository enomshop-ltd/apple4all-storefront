import { define } from "../../../utils.ts";
import { page } from "fresh";
import TrackRepairIsland from "../../repairs/(_islands)/TrackRepairIsland.tsx";

export const handler = define.handlers({
  GET(ctx) {
    const { repairItems } = ctx.state;
    const backendUrl =
      Deno.env.get("MEDUSA_BACKEND_URL") || "http://localhost:9000";
    return page({ repairItems, backendUrl });
  },
});

export default define.page(function AccountRepairsPage(props) {
  const { repairItems, backendUrl } = props.data as {
    repairItems: Array<Record<string, unknown>>;
    backendUrl: string;
  };

  // If there are no repairs, we probably shouldn't be here, but let's handle it gracefully.
  if (!repairItems || repairItems.length === 0) {
    return (
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center text-gray-500">
        You do not have any active or past repair orders.
      </div>
    );
  }

  // Get ticket token or serial either from metadata or assume it's there
  // Fallback: the user can manually enter a serial, but if we have items, let's list them
  return (
    <div class="space-y-6 max-w-5xl">
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <h2 class="text-xl font-bold text-gray-900">Your Repairs</h2>
        </div>
        <div class="p-6">
          <p class="text-sm text-gray-600 mb-6">
            Select a repair item from your orders below to securely track its
            status and chat with the technician.
          </p>
          <div class="space-y-4">
            {repairItems.map((r: any, i: number) => {
              const token =
                r.item.metadata?.ticket_token || r.item.metadata?.repair_token;
              const serial =
                r.item.metadata?.serial_number || r.item.metadata?.serial;

              if (!token && !serial) {
                return (
                  <div
                    key={i}
                    class="p-4 bg-gray-50 rounded-lg text-sm text-gray-700"
                  >
                    <strong>{r.item.title}</strong> (Order #{r.orderId}) - No
                    tracking info available yet.
                  </div>
                );
              }

              return (
                <details
                  key={i}
                  class="group border border-gray-200 rounded-lg bg-gray-50 overflow-hidden"
                  open={i === 0}
                >
                  <summary class="cursor-pointer p-4 font-bold text-gray-900 bg-white hover:bg-gray-50 list-none flex justify-between items-center transition-colors">
                    <span>
                      {r.item.title} (Order #{r.orderId})
                    </span>
                    <span class="text-blue-600 text-sm font-normal group-open:hidden">
                      Track &rarr;
                    </span>
                    <span class="text-gray-500 text-sm font-normal hidden group-open:block">
                      Hide &uarr;
                    </span>
                  </summary>
                  <div class="p-4 border-t border-gray-200 bg-white">
                    <TrackRepairIsland
                      backendUrl={backendUrl}
                      initialToken={token}
                      initialSerial={serial}
                    />
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});
