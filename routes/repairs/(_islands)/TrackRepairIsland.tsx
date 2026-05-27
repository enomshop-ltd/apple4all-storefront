import { useState, useEffect } from "preact/hooks";

export default function TrackRepairIsland({
  initialToken,
  initialTicket,
  isLoggedIn = false,
}: {
  initialToken?: string;
  initialTicket?: string;
  isLoggedIn?: boolean;
}) {
  const [ticketNumber, setTicketNumber] = useState(initialTicket || "");
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialToken) handleTokenSearch(initialToken);
    else if (initialTicket) handleSearch({ preventDefault: () => {} } as any);
  }, [initialToken, initialTicket]);

  const handleTokenSearch = async (token: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/repairs/token/${token}`);
      if (!response.ok) throw new Error("Invalid or expired token");
      const data = await response.json();
      setTicket(data.repair_ticket);
    } catch (err: any) {
      setError(err.message || "Failed to find repair ticket");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: Event) => {
    e.preventDefault();
    if (!ticketNumber.trim()) return;

    setLoading(true);
    setError("");
    setTicket(null);

    try {
      const response = await fetch(`/api/repairs/${encodeURIComponent(ticketNumber)}`);
      if (!response.ok) throw new Error("Repair ticket not found");
      
      const data = await response.json();
      setTicket(data.repair_ticket);
    } catch (err: any) {
      setError(err.message || "Failed to find repair ticket");
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; progress: number }> = {
      received: { label: "Received", color: "bg-gray-500", progress: 20 },
      diagnosing: { label: "Diagnosing", color: "bg-blue-500", progress: 40 },
      awaiting_approval: { label: "Awaiting Your Approval", color: "bg-orange-500", progress: 60 },
      repairing: { label: "Being Repaired", color: "bg-blue-600", progress: 80 },
      ready: { label: "Ready for Pickup", color: "bg-green-500", progress: 100 },
      completed: { label: "Completed", color: "bg-green-600", progress: 100 },
      cancelled: { label: "Cancelled", color: "bg-red-500", progress: 0 },
    };
    return statusMap[status] || { label: status, color: "bg-gray-500", progress: 0 };
  };

  return (
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Track Your Repair</h1>
        <p className="text-gray-600 text-sm">Enter your repair ticket number to check repair status</p>
      </div>

      <form onSubmit={handleSearch} className="mb-6 max-w-lg mx-auto">
        <div className="flex gap-2">
          <input
            type="text"
            value={ticketNumber}
            onInput={(e) => setTicketNumber((e.target as HTMLInputElement).value)}
            placeholder="e.g. REPAIR-1234"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm text-sm font-medium"
          >
            {loading ? "Searching..." : "Track"}
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      {ticket && (
        <div className="space-y-4">
          {/* Status Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold mb-1">{ticket.ticket_number}</h2>
                <p className="text-gray-600 text-sm">{ticket.device?.brand} {ticket.device?.model_name}</p>
                {isLoggedIn && <p className="text-sm text-gray-500">S/N: {ticket.device?.serial_number}</p>}
              </div>
              <span className={`px-3 py-1 rounded-full text-white text-xs font-medium shadow-sm ${getStatusInfo(ticket.status).color}`}>
                {getStatusInfo(ticket.status).label}
              </span>
            </div>

            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${getStatusInfo(ticket.status).color}`}
                  style={{ width: `${getStatusInfo(ticket.status).progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-600">
                <span>Received</span>
                <span>Diagnosing</span>
                <span>Repairing</span>
                <span>Ready</span>
              </div>
            </div>

            {ticket.estimated_completion && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Timeline</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Estimated Completion</p>
                    <p className="text-lg font-semibold">{new Date(ticket.estimated_completion).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}

            {isLoggedIn && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Issue Description</h3>
                <p className="text-gray-700">{ticket.issue_description}</p>
              </div>
            )}
          </div>

          {/* Cost Information */}
          {isLoggedIn && (ticket.total_estimate > 0 || ticket.total_actual > 0) && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Cost Breakdown</h3>

              {/* Document Download Links */}
              <div className="mt-4 flex gap-3 pt-4 border-t border-gray-100">
                <a
                  href={initialToken ? `/api/repairs/token/${initialToken}/document?type=quote` : `/api/repairs/${ticket.id}/document?type=quote`}
                  target="_blank"
                  className="flex-1 text-center px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition font-medium text-sm border border-gray-200"
                >
                  Download Quote (PDF)
                </a>
                {(ticket.status === "completed" || ticket.status === "ready") && (
                  <a
                    href={initialToken ? `/api/repairs/token/${initialToken}/document?type=invoice` : `/api/repairs/${ticket.id}/document?type=invoice`}
                    target="_blank"
                    className="flex-1 text-center px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition font-medium text-sm border border-blue-200"
                  >
                    Download Invoice (PDF)
                  </a>
                )}
              </div>

              {/* Compliance / Approvals */}
              {!ticket.terms_accepted && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                  <h4 className="text-yellow-800 font-bold mb-2">Action Required: Legal & Compliance</h4>
                  <p className="text-yellow-800 mb-4 text-sm">Please agree to terms.</p>
                  <button
                    onClick={async () => {
                      try {
                        const targetUrl = initialToken ? `/api/repairs/compliance` : `/api/repairs/${ticket.id}/compliance`;
                        const bodyData = initialToken 
                          ? { token: initialToken, terms_accepted: true, data_wiped_consent: true }
                          : { terms_accepted: true, data_wiped_consent: true };

                        const response = await fetch(targetUrl, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(bodyData),
                        });

                        if (response.ok) {
                          alert("Terms accepted successfully!");
                          initialToken ? handleTokenSearch(initialToken) : handleSearch(new Event("submit") as any);
                        } else throw new Error("Failed to accept terms");
                      } catch (err: any) {
                        alert(err.message);
                      }
                    }}
                    className="w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
                  >
                    Accept & Continue
                  </button>
                </div>
              )}

              {ticket.status === "awaiting_approval" && !ticket.is_approved && ticket.terms_accepted && (
                <div className="mt-6 flex gap-2">
                  <button
                    onClick={async () => {
                      try {
                        const targetUrl = initialToken ? `/api/repairs/approve` : `/api/repairs/${ticket.id}/approve`;
                        const bodyData = initialToken ? { token: initialToken, approved: true } : { approved: true };

                        const response = await fetch(targetUrl, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(bodyData),
                        });
                        if (response.ok) {
                          alert("Repair approved!");
                          initialToken ? handleTokenSearch(initialToken) : handleSearch(new Event("submit") as any);
                        }
                      } catch (err) {
                        alert("Failed to approve repair");
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded"
                  >
                    Approve Repair
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Chat Messages */}
          {isLoggedIn && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Messages</h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const input = (e.target as HTMLFormElement).elements.namedItem("message") as HTMLInputElement;
                  try {
                    const bodyData: any = { message: input.value };
                    if (initialToken) bodyData.token = initialToken;

                    await fetch(`/api/repairs/${ticket.id}/messages`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(bodyData),
                    });
                    
                    initialToken ? handleTokenSearch(initialToken) : handleSearch(new Event("submit") as any);
                    (e.target as HTMLFormElement).reset();
                  } catch (err) {
                    alert("Failed to send message");
                  }
                }}
                className="flex gap-3"
              >
                <input type="text" name="message" required className="flex-1 px-4 py-2 border rounded-lg" />
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg">Send</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}