import { useState } from "preact/hooks";

interface BookRepairIslandProps {
  backendUrl: string;
}

export default function BookRepairIsland({
  backendUrl,
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

    try {
      const response = await fetch(`${backendUrl}/store/repairs`, {
        method: "POST",
        // Needs "include" to pass medusa shop session/cookie for authentication
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
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

      if (!response.ok) {
        let msg = "Failed to book repair";
        try {
          const errData = await response.json();
          msg = errData.message || msg;
        } catch {
          // ignore parsing error
        }
        if (response.status === 401) {
          msg = "You must be logged in to book a repair";
        }
        throw new Error(msg);
      }

      const data = await response.json();
      setSuccess(data.repair_ticket);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 text-green-900 p-8 rounded-lg border border-green-200">
        <h2 className="text-2xl font-bold mb-4">Repair Booked Successfully!</h2>
        <p className="mb-4">
          Your device has been booked in for an evaluation. Your repair ticket
          number is:
        </p>
        <p className="text-3xl font-mono bg-white inline-block px-4 py-2 rounded-md shadow-sm border border-green-300 mb-6">
          {success.ticket_number}
        </p>
        <p className="mb-4 text-sm text-green-800">
          Our team will evaluate the device issue soon and provide an estimated
          repair cost. You will receive an update in the timeline.
        </p>
        <div className="flex gap-4">
          <a
            href={`/repairs/track?token=${success.approval_token || ""}`}
            className="px-6 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition"
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
            className="px-6 py-2 bg-white text-green-700 border border-green-300 rounded hover:bg-green-50 transition"
          >
            Book Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 border border-red-200 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg border border-gray-100">
        <div className="col-span-full">
          <h2 className="text-xl font-bold mb-2">1. Device Details</h2>
          <p className="text-gray-500 text-sm">
            Tell us about the device you are sending in.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Brand *</label>
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
            className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g. Apple"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Model Name *</label>
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
            className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g. iPhone 13 Pro"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Serial Number *</label>
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
            className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Must be accurate to track the repair"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">IMEI (Optional)</label>
          <input
            type="text"
            value={device.imei}
            onInput={(e) =>
              setDevice({
                ...device,
                imei: (e.target as HTMLInputElement).value,
              })
            }
            className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="For cellular devices"
          />
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold mb-2">2. What's wrong with it?</h2>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">
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
            className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Please describe exactly what happened and what issues you are experiencing..."
          ></textarea>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Device Condition</label>
          <input
            type="text"
            value={device.condition}
            onInput={(e) =>
              setDevice({
                ...device,
                condition: (e.target as HTMLInputElement).value,
              })
            }
            className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g. Scratched screen, dented corner"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">
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
            className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g. Original Box, Charging cable"
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-blue-600 text-white font-medium rounded shadow hover:bg-blue-700 disabled:bg-gray-400 disabled:shadow-none transition cursor-pointer"
        >
          {loading ? "Booking Repair..." : "Book Repair & Request Pickup"}
        </button>
      </div>
    </form>
  );
}
