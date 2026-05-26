import { define } from "../../../utils.ts";
import { page } from "fresh";
import TrackRepairIsland from "../../repairs/(_islands)/TrackRepairIsland.tsx";

export const handler = define.handlers({
  GET(ctx) {
    const { repairItems, repairs } = ctx.state;
    const backendUrl =
      Deno.env.get("MEDUSA_BACKEND_URL")!;
    const publishableKey = Deno.env.get("MEDUSA_PUBLISHABLE_KEY") || "";
    return page({ repairItems, repairs, backendUrl, publishableKey });
  },
});

export default define.page(function AccountRepairsPage(props) {
  const { repairItems, repairs, backendUrl, publishableKey } = props.data as {
    repairItems: Array<Record<string, unknown>>;
    repairs: Array<any>;
    backendUrl: string;
    publishableKey: string;
  };

  const hasNewRepairs = repairs && repairs.length > 0;
  const hasOldRepairs = repairItems && repairItems.length > 0;

  if (!hasNewRepairs && !hasOldRepairs) {
    return (
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center text-gray-500">
        You do not have any active or past repair orders.
      </div>
    );
  }

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
            {hasNewRepairs &&
              repairs.map((repair: any, i: number) => {
                const token = repair.ticket_number || repair.id;
                
                return (
                  <details
                    key={`new-${i}`}
                    class="group border border-gray-200 rounded-lg bg-gray-50 overflow-hidden"
                    open={i === 0}
                  >
                    <summary class="cursor-pointer p-4 font-bold text-gray-900 bg-white hover:bg-gray-50 list-none flex justify-between items-center transition-colors">
                      <div class="flex items-center gap-4">
                        <span>{repair.ticket_number} - {repair.device?.brand || "Device"} {repair.device?.model_name || ""}</span>
                        <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {repair.status.replace(/_/g, " ")}
                        </span>
                      </div>
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
                        publishableApiKey={publishableKey}
                        initialToken={token}
                        initialTicket={repair.ticket_number || ""}
                      />
                    </div>
                  </details>
                );
              })}

            {!hasNewRepairs &&
              hasOldRepairs &&
              repairItems.map((r: any, i: number) => {
                const token =
                  r.item.metadata?.ticket_token || r.item.metadata?.repair_token;
                const serial =
                  r.item.metadata?.serial_number || r.item.metadata?.serial;

                if (!token && !serial) {
                  return (
                    <div
                      key={`old-${i}`}
                      class="p-4 bg-gray-50 rounded-lg text-sm text-gray-700"
                    >
                      <strong>{r.item.title}</strong> (Order #{r.orderId}) - No
                      tracking info available yet.
                    </div>
                  );
                }

                return (
                  <details
                    key={`old-${i}`}
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
                        publishableApiKey={publishableKey}
                        initialToken={token}
                        initialTicket={serial}
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
