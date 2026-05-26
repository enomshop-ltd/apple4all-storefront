import { useState } from "preact/hooks";

interface BookRepairIslandProps {
  backendUrl: string;
  publishableApiKey?: string;
}

export default function BookRepairIsland({
  backendUrl,
  publishableApiKey,
}: BookRepairIslandProps) {
  const [device, setDevice] = useState({
    brand: "",
    model_name: "",
    serial_number: "",
    imei: "",
    condition: "",
  });

  const [ticket, setTicket] = useState({
    issue_description: "",
    accessories: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<any>(null);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(null);

    console.debug("[BookRepairIsland] Submitting repair booking request...", { device, ticket });

    try {
      const response = await fetch(`${backendUrl}/store/repairs`, {
        method: "POST",
        // Needs "include" to pass medusa shop session/cookie for authentication
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(publishableApiKey
            ? { "x-publishable-api-key": publishableApiKey }
            : {}),
        },
        body: JSON.stringify({
          device,
          ticket: {
            issue_description: ticket.issue_description,
            accessories: ticket.accessories || undefined,
            terms_accepted: true,
            data_wiped_consent: true,
          },
        }),
      });

      console.debug(`[BookRepairIsland] Submit repair response status: ${response.status}`);

      if (!response.ok) {
        let msg = "Failed to book repair";
        try {
          const errData = await response.json();
          msg = errData.message || msg;
        } catch {
          // ignore parsing error
        }
        if (response.status === 401) {
          console.warn("[BookRepairIsland] Unauthorized 401: Customer is not logged in to book a repair.");
          msg = "You must be logged in to book a repair";
        }
        console.error(`[BookRepairIsland] Failed to book repair. Message:` , msg);
        throw new Error(msg);
      }

      const data = await response.json();
      console.info(`[BookRepairIsland] Repair booked successfully. Ticket number: ${data.repair_ticket?.ticket_number}`);
      setSuccess(data.repair_ticket);
    } catch (err: any) {
      console.error("[BookRepairIsland] Exception while booking repair:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div class="bg-emerald-50 text-emerald-900 p-8 rounded-lg border border-emerald-200">
        <h2 class="text-2xl font-bold mb-4">Repair Booked Successfully!</h2>
        <p class="mb-4">
          Your device has been booked in for an evaluation. Your repair ticket
          number is:
        </p>
        <p class="text-3xl font-mono bg-white inline-block px-4 py-2 rounded-md shadow-sm border border-emerald-300 mb-6">
          {success.ticket_number}
        </p>
        <p class="mb-4 text-sm text-emerald-800">
          Our team will evaluate the device issue soon and provide an estimated
          repair cost. You will receive an update in the timeline.
        </p>
        <div class="flex gap-4">
          <a
            href={`/repairs/track?token=${success.approval_token || ""}`}
            class="px-6 py-2 bg-emerald-700 text-white rounded hover:bg-emerald-800 transition"
          >
            Track Repair Status
          </a>
          <button
            onClick={() => {
              setSuccess(null);
              setDevice({
                brand: "",
                model_name: "",
                serial_number: "",
                imei: "",
                condition: "",
              });
              setTicket({
                issue_description: "",
                accessories: "",
              });
            }}
            class="px-6 py-2 bg-white text-emerald-700 border border-emerald-300 rounded hover:bg-emerald-50 transition"
          >
            Book Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} class="space-y-6">
      {error && (
        <div class="bg-red-50 text-red-600 p-4 border border-red-200 rounded">
          {error}
        </div>
      )}

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-lg border border-slate-200">
        <div class="col-span-full">
          <h2 class="text-xl font-bold mb-2">1. Device Details</h2>
          <p class="text-slate-500 text-sm">
            Tell us about the device you are sending in.
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-medium text-slate-700">Brand *</label>
          <input
            type="text"
            required
            value={device.brand}
            onInput={(e) =>
              setDevice({
                ...device,
                brand: (e.target as HTMLInputElement).value,
              })
            }
            class="px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-slate-900 focus:outline-none"
            placeholder="e.g. Apple"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-medium text-slate-700">Model Name *</label>
          <input
            type="text"
            required
            value={device.model_name}
            onInput={(e) =>
              setDevice({
                ...device,
                model_name: (e.target as HTMLInputElement).value,
              })
            }
            class="px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-slate-900 focus:outline-none"
            placeholder="e.g. iPhone 13 Pro"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-medium text-slate-700">Serial Number *</label>
          <input
            type="text"
            required
            value={device.serial_number}
            onInput={(e) =>
              setDevice({
                ...device,
                serial_number: (e.target as HTMLInputElement).value,
              })
            }
            class="px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-slate-900 focus:outline-none"
            placeholder="Must be accurate to track the repair"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-medium text-slate-700">IMEI (Optional)</label>
          <input
            type="text"
            value={device.imei}
            onInput={(e) =>
              setDevice({
                ...device,
                imei: (e.target as HTMLInputElement).value,
              })
            }
            class="px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-slate-900 focus:outline-none"
            placeholder="For cellular devices"
          />
        </div>
      </div>

      <div class="bg-slate-50 p-6 rounded-lg border border-slate-200 flex flex-col gap-6">
        <div>
          <h2 class="text-xl font-bold mb-2">2. What's wrong with it?</h2>
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-medium text-slate-700">
            Issue Description *
          </label>
          <textarea
            required
            rows={4}
            value={ticket.issue_description}
            onInput={(e) =>
              setTicket({
                ...ticket,
                issue_description: (e.target as HTMLTextAreaElement).value,
              })
            }
            class="px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-slate-900 focus:outline-none"
            placeholder="Please describe exactly what happened and what issues you are experiencing..."
          ></textarea>
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-medium text-slate-700">Device Condition</label>
          <input
            type="text"
            value={device.condition}
            onInput={(e) =>
              setDevice({
                ...device,
                condition: (e.target as HTMLInputElement).value,
              })
            }
            class="px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-slate-900 focus:outline-none"
            placeholder="e.g. Scratched screen, dented corner"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-medium text-slate-700">
            Included Accessories (Optional)
          </label>
          <input
            type="text"
            value={ticket.accessories}
            onInput={(e) =>
              setTicket({
                ...ticket,
                accessories: (e.target as HTMLInputElement).value,
              })
            }
            class="px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-slate-900 focus:outline-none"
            placeholder="e.g. Original Box, Charging cable"
          />
        </div>
      </div>

      <div class="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          class="px-8 py-3 bg-slate-900 text-white font-medium rounded shadow hover:bg-slate-800 disabled:bg-slate-300 disabled:shadow-none transition cursor-pointer"
        >
          {loading ? "Booking Repair..." : "Book Repair & Request Pickup"}
        </button>
      </div>
    </form>
  );
}
