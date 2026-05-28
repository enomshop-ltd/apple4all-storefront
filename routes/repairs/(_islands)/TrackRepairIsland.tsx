import { useState, useEffect } from "preact/hooks";
import { Info, Wrench } from "lucide-preact";
import { render } from "preact";
import { RepairDocumentTemplate } from "../../../components/RepairDocumentTemplate.tsx";

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
    if (initialToken) {
      handleTokenSearch(initialToken);
    } else if (initialTicket) {
      handleSearch({ preventDefault: () => {} } as any);
    }
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

  const handleDownloadDocument = async (type: string) => {
    if (!ticket) return;
    
    const loadHtml2Pdf = () => new Promise<any>((resolve) => {
      if ((window as any).html2pdf) return resolve((window as any).html2pdf);
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      script.onload = () => resolve((window as any).html2pdf);
      document.head.appendChild(script);
    });

    try {
      const html2pdf = await loadHtml2Pdf();
      
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      document.body.appendChild(container);

      const trackUrl = new URL(globalThis.location.href).href;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(trackUrl)}`;

      render(<RepairDocumentTemplate ticket={ticket} type={type} qrCodeUrl={qrCodeUrl} />, container);

      await new Promise(r => setTimeout(r, 200));

      const opt = {
        margin:       [10, 10],
        filename:     `${type}_${ticket.ticket_number}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(container).save();

      render(null, container);
      container.remove();
    } catch (e) {
      console.error("Failed to generate PDF document", e);
      alert("An error occurred while downloading the document.");
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<
      string,
      { label: string; color: string; progress: number }
    > = {
      received: { label: "Received", color: "bg-gray-500", progress: 20 },
      diagnosing: { label: "Diagnosing", color: "bg-blue-500", progress: 40 },
      awaiting_approval: {
        label: "Awaiting Your Approval",
        color: "bg-orange-500",
        progress: 60,
      },
      repairing: {
        label: "Being Repaired",
        color: "bg-blue-600",
        progress: 80,
      },
      ready: {
        label: "Ready for Pickup",
        color: "bg-green-500",
        progress: 100,
      },
      completed: { label: "Completed", color: "bg-green-600", progress: 100 },
      cancelled: { label: "Cancelled", color: "bg-red-500", progress: 0 },
    };
    return (
      statusMap[status] || { label: status, color: "bg-gray-500", progress: 0 }
    );
  };

  return (
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-6 text-slate-800">
          <Wrench size={32} />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 mb-3">Track Your Repair</h1>
        <p className="text-slate-500 text-lg max-w-md mx-auto">
          Enter your repair ticket number to check the real-time status of your service.
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-12 max-w-xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={ticketNumber}
            onInput={(e) =>
              setTicketNumber((e.target as HTMLInputElement).value)
            }
            placeholder="Repair ID (e.g. REPAIR-1234)"
            className="flex-1 px-5 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base shadow-sm font-medium transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition disabled:bg-slate-400 disabled:cursor-not-allowed shadow-sm text-base font-semibold"
          >
            {loading ? "Searching..." : "Track Repair"}
          </button>
        </div>
        {error && (
          <p className="text-red-600 mt-3 text-center bg-red-50 p-2 rounded-lg text-sm">{error}</p>
        )}
      </form>

      {ticket && (
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* Status Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 sm:p-8 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Info size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                    {ticket.ticket_number}
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {ticket.device?.brand} {ticket.device?.model_name}
                  </h2>
                  {isLoggedIn && (
                    <p className="text-sm text-slate-500 mt-1 font-medium">
                      Serial Number: {ticket.device?.serial_number}
                    </p>
                  )}
                </div>
              </div>
              <span
                className={`px-4 py-1.5 rounded-full text-white text-sm font-semibold shadow-sm ${
                  getStatusInfo(ticket.status).color
                }`}
              >
                {getStatusInfo(ticket.status).label}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-8 sm:px-8">
              <div className="relative pt-2">
                <div className="w-full bg-slate-100 rounded-full h-3 mb-4 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-700 ease-out ${
                      getStatusInfo(ticket.status).color
                    }`}
                    style={{
                      width: `${getStatusInfo(ticket.status).progress}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs sm:text-sm font-semibold text-slate-400 px-1">
                  <span className={`${getStatusInfo(ticket.status).progress >= 20 ? 'text-slate-900' : ''}`}>Received</span>
                  <span className={`text-center ${getStatusInfo(ticket.status).progress >= 40 ? 'text-slate-900' : ''}`}>Diagnosing</span>
                  <span className={`text-center ${getStatusInfo(ticket.status).progress >= 80 ? 'text-slate-900' : ''}`}>Repairing</span>
                  <span className={`text-right ${getStatusInfo(ticket.status).progress >= 100 ? 'text-slate-900' : ''}`}>Ready</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            {ticket.estimated_completion && (
              <div className="border-t border-slate-100 p-6 sm:p-8 bg-slate-50/50">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Service Timeline</h3>
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <p className="text-sm text-slate-500 mb-1">Estimated Completion</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {new Date(ticket.estimated_completion).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  {ticket.warranty_expiry && isLoggedIn && (
                    <div className="flex-1">
                      <p className="text-sm text-slate-500 mb-1">Warranty Coverage Until</p>
                      <p className="text-lg font-semibold text-slate-900">
                        {new Date(ticket.warranty_expiry).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Issue Description */}
            {isLoggedIn && (
              <div className="border-t border-slate-100 p-6 sm:p-8">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">Reported Issue</h3>
                <p className="text-slate-800 leading-relaxed max-w-2xl">{ticket.issue_description}</p>
                {ticket.accessories && (
                  <p className="text-sm text-slate-500 mt-4 bg-slate-50 p-3 rounded-lg inline-block">
                    <span className="font-medium text-slate-700">Included Accessories:</span> {ticket.accessories}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Cost Information */}
          {isLoggedIn && (ticket.total_estimate > 0 || ticket.total_actual > 0) && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Cost Breakdown</h3>

              {ticket.parts && ticket.parts.length > 0 && (
                <div className="mb-4 space-y-2">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Inventory Parts
                  </h4>
                  {ticket.parts.map((p: any) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center text-sm p-3 bg-gray-50 border border-gray-100 rounded"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">
                          {p.title}{" "}
                          {p.product?.title ? `(${p.product.title})` : ""}
                        </span>
                        <span className="text-gray-500 text-xs text-left">
                          SKU: {p.sku || "-"}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        {p.product?.handle && (
                          <a
                            href={`/products/${p.product.handle}`}
                            target="_blank"
                            className="text-blue-500 hover:underline text-xs mb-1"
                          >
                            View in store
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {ticket.custom_parts && ticket.custom_parts.length > 0 && (
                <div className="mb-4 space-y-2">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Custom Parts / Services
                  </h4>
                  {ticket.custom_parts.map((cp: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-sm p-3 bg-gray-50 border border-gray-100 rounded"
                    >
                      <span className="font-medium text-gray-800">
                        {cp.name}
                      </span>
                      <span className="font-medium">
                        KES {(cp.price / 100).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Parts Estimate:</span>
                  <span className="font-medium">
                    KES {((ticket.parts_estimate || 0) / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Labor Estimate:</span>
                  <span className="font-medium">
                    KES {((ticket.labor_estimate || 0) / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                  <span>Total Estimate:</span>
                  <span>
                    KES {((ticket.total_estimate || 0) / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Documents Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Job Card: Always available */}
            <button
              onClick={() => handleDownloadDocument('job_card')}
              className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 hover:border-slate-300 transition text-center"
            >
              <span className="font-semibold text-slate-700 mb-1">Job Card</span>
              <span className="text-xs text-slate-500">Intake Details</span>
            </button>

            {/* Quote: Available when estimate exists or past diagnosing */}
            {(!['received', 'diagnosing'].includes(ticket.status) || ticket.total_estimate > 0) && (
              <button
                onClick={() => handleDownloadDocument('quote')}
                className="flex flex-col items-center justify-center p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition text-center"
              >
                <span className="font-semibold text-orange-800 mb-1">Quotation</span>
                <span className="text-xs text-orange-600">Cost Estimate</span>
              </button>
            )}

            {/* Invoice: Available when ready or completed */}
            {['ready', 'completed'].includes(ticket.status) && (
              <button
                onClick={() => handleDownloadDocument('invoice')}
                className="flex flex-col items-center justify-center p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition text-center"
              >
                <span className="font-semibold text-blue-700 mb-1">Tax Invoice</span>
                <span className="text-xs text-blue-500">Final Billing</span>
              </button>
            )}

            {/* Receipt: Available when completed (assumed paid) */}
            {ticket.status === 'completed' && (
              <button
                onClick={() => handleDownloadDocument('receipt')}
                className="flex flex-col items-center justify-center p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition text-center"
              >
                <span className="font-semibold text-green-700 mb-1">Receipt</span>
                <span className="text-xs text-green-600">Proof of Payment</span>
              </button>
            )}
          </div>

          {/* Action Required: Terms */}
          {!ticket.terms_accepted && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl shadow-sm">
              <h4 className="text-yellow-800 font-bold mb-2">
                Action Required: Legal & Compliance
              </h4>
              <p className="text-yellow-800 mb-4 text-sm">
                Before we can proceed with any work, you must review and
                agree to our Repair Terms & Conditions.
              </p>

              <div className="flex flex-col gap-3 mb-4">
                <label className="flex items-center gap-2 text-gray-800">
                  <input
                    type="checkbox"
                    id="termsCheck"
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">
                    I agree to the Repair Terms & Conditions
                  </span>
                </label>
                <label className="flex items-center gap-2 text-gray-800">
                  <input
                    type="checkbox"
                    id="dataCheck"
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">
                    I consent to a device data wipe (if necessary)
                  </span>
                </label>
              </div>

              <button
                onClick={async () => {
                  const terms = (document.getElementById("termsCheck") as HTMLInputElement).checked;
                  const dataWipe = (document.getElementById("dataCheck") as HTMLInputElement).checked;

                  if (!terms) {
                    alert("Please agree to the Repair Terms to continue.");
                    return;
                  }

                  try {
                    const targetUrl = initialToken ? `/api/repairs/compliance` : `/api/repairs/${ticket.id}/compliance`;
                    const bodyData = initialToken 
                      ? { token: initialToken, terms_accepted: true, data_wiped_consent: dataWipe }
                      : { terms_accepted: true, data_wiped_consent: dataWipe };

                    const response = await fetch(targetUrl, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(bodyData),
                    });

                    if (response.ok) {
                      alert("Terms accepted successfully!");
                      if (initialToken) handleTokenSearch(initialToken);
                      else handleSearch(new Event("submit") as any);
                    } else {
                      throw new Error("Failed to accept terms");
                    }
                  } catch (err: any) {
                    alert(err.message || "Failed to update compliance details");
                  }
                }}
                className="w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition font-medium shadow-sm"
              >
                Accept & Continue
              </button>
            </div>
          )}

          {/* Action Required: Approval */}
          {ticket.status === "awaiting_approval" &&
            !ticket.is_approved &&
            ticket.terms_accepted && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl shadow-sm">
                <p className="text-orange-800 font-medium mb-3">
                  Your approval is required to proceed with the repair.
                </p>
                <div className="flex gap-2">
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
                          alert("Repair approved! Work will begin shortly.");
                          if (initialToken) handleTokenSearch(initialToken);
                          else handleSearch(new Event("submit") as any);
                        } else {
                          throw new Error("Failed to approve repair");
                        }
                      } catch (err) {
                        alert("Failed to approve repair");
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded font-medium hover:bg-orange-700 shadow-sm"
                  >
                    Approve Repair
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm("Are you sure you want to decline this repair? This will cancel the ticket.")) return;
                      try {
                        const targetUrl = initialToken ? `/api/repairs/approve` : `/api/repairs/${ticket.id}/approve`;
                        const bodyData = initialToken ? { token: initialToken, approved: false } : { approved: false };

                        const response = await fetch(targetUrl, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(bodyData),
                        });

                        if (response.ok) {
                          alert("Repair has been declined and cancelled.");
                          if (initialToken) handleTokenSearch(initialToken);
                          else handleSearch(new Event("submit") as any);
                        } else {
                          throw new Error("Failed to decline repair");
                        }
                      } catch (err) {
                        alert("Failed to decline repair");
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded font-medium hover:bg-gray-700 shadow-sm"
                  >
                    Decline Repair
                  </button>
                </div>
              </div>
            )}

          {/* Approval Confirmation */}
          {ticket.is_approved && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl shadow-sm">
              <p className="text-green-800 text-sm font-medium">
                Approved on{" "}
                {new Date(ticket.approved_at).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* RESTORED: Media Gallery */}
          {isLoggedIn && ticket.media && ticket.media.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Device Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {ticket.media.map((media: any) => (
                  <a
                    key={media.id}
                    href={media.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square rounded overflow-hidden border hover:opacity-80"
                  >
                    <img
                      src={media.file_url}
                      alt="Device"
                      className="w-full h-full object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* RESTORED: Customer-visible Notes */}
          {isLoggedIn && ticket.notes &&
            ticket.notes.filter((n: any) => !n.is_internal).length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Updates</h3>
                <div className="space-y-3">
                  {ticket.notes
                    .filter((note: any) => !note.is_internal)
                    .map((note: any) => (
                      <div key={note.id} className="p-4 bg-gray-50 rounded">
                        <p className="text-sm text-gray-500 mb-1">
                          {new Date(note.created_at).toLocaleString()}
                        </p>
                        <p>{note.content}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}

          {/* RESTORED: Chat Messages Interface */}
          {isLoggedIn && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Messages</h3>

            {ticket.updates && ticket.updates.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto mb-6">
                {ticket.updates.map((update: any) => (
                  <div
                    key={update.id}
                    className={`p-4 rounded ${
                      update.author_type === "customer"
                        ? "bg-blue-50 ml-8"
                        : "bg-gray-50 mr-8"
                    }`}
                  >
                    <p className="text-xs text-gray-500 mb-1">
                      {update.author_type === "customer" ? "You" : "Technician"}{" "}
                      - {new Date(update.created_at).toLocaleString()}
                    </p>
                    <p>{update.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mb-6">No messages yet.</p>
            )}

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const input = form.elements.namedItem("message") as HTMLInputElement;
                const message = input.value.trim();

                if (!message) return;

                try {
                  const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
                  submitBtn.disabled = true;
                  submitBtn.textContent = "Sending...";

                  const bodyData: any = { message };
                  if (initialToken) {
                    bodyData.token = initialToken;
                  }

                  const response = await fetch(`/api/repairs/${ticket.id}/messages`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(bodyData),
                  });

                  if (!response.ok) throw new Error("Failed to send message");

                  if (initialToken) {
                    handleTokenSearch(initialToken);
                  } else {
                    handleSearch(new Event("submit") as any);
                  }

                  form.reset();
                } catch (err) {
                  alert("Failed to send message");
                  console.error(err);
                } finally {
                  const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
                  submitBtn.disabled = false;
                  submitBtn.textContent = "Send Reply";
                }
              }}
              className="flex gap-3"
            >
              <input
                type="text"
                name="message"
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Send Reply
              </button>
            </form>
          </div>
          )}
        </div>
      )}
    </div>
  );
}
