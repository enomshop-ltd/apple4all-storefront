import { useState } from "preact/hooks";

export default function BookRepairIsland() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successTicket, setSuccessTicket] = useState<string | null>(null);

  // Form State
  const [brand, setBrand] = useState("Apple");
  const [modelName, setModelName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [issueDescription, setIssueDescription] = useState("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 🚀 Hits our FreshJS Catch-All Proxy (routes/api/repairs/[...path].ts)
      // The proxy automatically attaches the publishable key and the user's auth cookie!
      const response = await fetch("/api/repairs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device: {
            brand,
            model_name: modelName,
            serial_number: serialNumber,
          },
          issue_description: issueDescription,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("[BookRepairIsland] Failed to book repair:", errText);
        throw new Error("Failed to submit repair request. Please try again.");
      }

      const data = await response.json();
      
      // Assuming the backend returns the created ticket inside data.repair_ticket
      const ticketNumber = data.repair_ticket?.ticket_number || data.ticket_number;
      setSuccessTicket(ticketNumber);
      
      console.info(`[BookRepairIsland] Successfully booked repair: ${ticketNumber}`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (successTicket) {
    return (
      <div class="max-w-2xl mx-auto p-8 bg-green-50 border border-green-200 rounded-xl text-center shadow-sm">
        <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-green-800 mb-2">Repair Request Submitted!</h2>
        <p class="text-green-700 mb-6">
          Your device has been successfully registered for repair. Your ticket number is:
        </p>
        <div class="text-3xl font-mono font-bold text-slate-900 mb-8 bg-white py-3 px-6 inline-block rounded-lg border border-green-200">
          {successTicket}
        </div>
        <div class="space-x-4">
          <a
            href={`/repairs/track?token=${successTicket}`}
            class="inline-block px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition"
          >
            Track Repair Status
          </a>
          <a
            href="/account/repairs"
            class="inline-block px-6 py-3 bg-white text-slate-700 font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition"
          >
            Go to My Account
          </a>
        </div>
      </div>
    );
  }

  return (
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="p-6 bg-slate-50 border-b border-slate-200">
        <h2 class="text-2xl font-bold text-slate-900">Book a Repair</h2>
        <p class="text-slate-600 mt-1">Tell us about your device and the issues you are experiencing.</p>
      </div>

      <div class="p-6">
        {error && (
          <div class="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} class="space-y-6">
          {/* Device Details Section */}
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-slate-800 border-b pb-2">Device Details</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Brand</label>
                <select
                  value={brand}
                  onInput={(e) => setBrand((e.target as HTMLSelectElement).value)}
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  required
                >
                  <option value="Apple">Apple</option>
                  <option value="Samsung">Samsung</option>
                  <option value="Google">Google</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Model Name</label>
                <input
                  type="text"
                  value={modelName}
                  onInput={(e) => setModelName((e.target as HTMLInputElement).value)}
                  placeholder="e.g. MacBook Pro M2 2023"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Serial Number <span class="text-slate-400 font-normal">(Optional but recommended)</span>
              </label>
              <input
                type="text"
                value={serialNumber}
                onInput={(e) => setSerialNumber((e.target as HTMLInputElement).value)}
                placeholder="Enter device serial number"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm"
              />
            </div>
          </div>

          {/* Issue Section */}
          <div class="space-y-4 pt-2">
            <h3 class="text-lg font-semibold text-slate-800 border-b pb-2">Issue Description</h3>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">What seems to be the problem?</label>
              <textarea
                value={issueDescription}
                onInput={(e) => setIssueDescription((e.target as HTMLTextAreaElement).value)}
                rows={4}
                placeholder="Please describe the issue in as much detail as possible (e.g., 'Screen is cracked in the bottom left corner', 'Battery dies after 2 hours')."
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                required
              />
            </div>
          </div>

          <div class="pt-4 flex items-center justify-end border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              class="px-8 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                "Book Repair"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}