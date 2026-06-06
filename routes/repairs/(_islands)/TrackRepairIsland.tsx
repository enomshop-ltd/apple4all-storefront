import { useState, useEffect } from "preact/hooks";
import { Info, Wrench } from "lucide-preact";

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

    try {
      const targetUrl = initialToken 
        ? `/api/repairs/token/${initialToken}/document?type=${type}` 
        : `/api/repairs/${ticket.id}/document?type=${type}`;
        
      const response = await fetch(targetUrl);
      
      if (!response.ok) {
        let errorDetail = `Server returned ${response.status}`;
        const rawText = await response.text();
        try {
          const errBody = JSON.parse(rawText);
          errorDetail = errBody.error || errorDetail;
          console.error("[TrackRepairIsland] PDF API Error Details:", errBody);
        } catch (parseErr) {
          errorDetail += ` - ${rawText}`;
        }
        throw new Error(errorDetail);
      }
      
      // Automatically download the PDF blob
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${ticket.ticket_number}-${type}.pdf`;
      link.setAttribute("f-client-nav", "false"); // Prevent Fresh from intercepting blob: URLs
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
    } catch (e) {
      console.error("Failed to generate PDF document", e);
      alert("An error occurred while downloading the document.");
    }
  };

  const getStepperIndex = (status: string) => {
    switch (status) {
      case "received": return 0;
      case "diagnosing": return 1;
      case "awaiting_approval": return 2;
      case "repairing": return 3;
      case "ready": return 4;
      case "completed": return 5;
      case "cancelled": return -1;
      default: return 0;
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "received": return "Your product has been successfully picked up and delivered to our service center. We will begin diagnosis shortly.";
      case "diagnosing": return "Your product is currently undergoing diagnosis. Our team is diligently working to identify the issue and determine the necessary repairs or service required.";
      case "awaiting_approval": return "We have completed the diagnosis. Please review and approve the repair estimate to proceed.";
      case "repairing": return "Your product is currently being repaired by our expert technicians. We are using high-quality parts to bring it back to life.";
      case "ready": return "Your repair is complete and your product is ready for delivery. It has passed all testing and packaging.";
      case "completed": return "Your product has been successfully delivered back to you. Thank you for choosing our service.";
      case "cancelled": return "This repair ticket has been cancelled.";
      default: return "We are processing your repair ticket.";
    }
  };

  const steps = [
    { title: "Received", desc: "Product was received." },
    { title: "Diagnosing", desc: "We are diagnosing your product." },
    { title: "Approval", desc: "Awaiting your repair approval." },
    { title: "Repairing", desc: "Product is being repaired." },
    { title: "Ready", desc: "Ready for pickup/delivery." },
    { title: "Completed", desc: "Repair is fully completed." },
  ];

  return (
    <div class="max-w-7xl mx-auto px-4 py-12">
      {/* Spacer to maintain vertical layout after removing header text */}
      <div className="h-32 sm:h-48 mb-10"></div>

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
        <div className="space-y-12 max-w-5xl mx-auto mt-8">
          {/* Status Overview */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-2">
              Repair Status #{ticket.ticket_number}
            </h2>
            <p className="text-xs font-normal text-slate-500 mb-4">
              {ticket.device?.brand} {ticket.device?.model_name}
              {ticket.device?.serial_number ? ` | SN: ${ticket.device?.serial_number}` : ""}
              {ticket.device?.imei ? ` | IMEI: ${ticket.device?.imei}` : ""}
            </p>
            <p className="text-slate-600 max-w-3xl mx-auto leading-relaxed text-base sm:text-lg">
              {getStatusDescription(ticket.status)}
            </p>
            {ticket.estimated_completion && (
              <div className="mt-8 inline-flex items-center gap-2 text-lg text-slate-800 font-medium bg-blue-50/50 px-4 py-2 rounded-lg">
                <span>Estimated time of delivery: {new Date(ticket.estimated_completion).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                <span title="Please note that these are not guarantee estimates, delivery date is subject to change based on the repair progress." className="text-blue-500 cursor-help hover:text-blue-700 transition">
                  <Info size={18} />
                </span>
              </div>
            )}
          </div>

          {/* Stepper */}
          <div className="relative mb-20 w-full px-2 sm:px-6">
            {/* Horizontal Line Background */}
            <div className="absolute top-1.5 left-[8.33%] right-[8.33%] w-[83.33%] h-[2px] bg-slate-200 -z-10" />
            
            {/* Active Horizontal Line */}
            <div 
              className="absolute top-1.5 left-[8.33%] h-[2px] bg-blue-500 -z-10 transition-all duration-1000 ease-in-out"
              style={{ width: getStepperIndex(ticket.status) >= 0 ? `calc(83.33% * ${getStepperIndex(ticket.status) / (steps.length - 1)})` : '0%' }}
            />

            <div className="flex justify-between w-full">
              {steps.map((step, idx) => {
                const currentStep = getStepperIndex(ticket.status);
                const isCompleted = idx <= currentStep;
                
                let dateStr = "-";
                let dateColorClass = "text-slate-400";
                
                if (idx === 0 && ticket.created_at) {
                  dateStr = new Date(ticket.created_at).toLocaleDateString("en-GB", { day: '2-digit', month: '2-digit', year: 'numeric' });
                } else if (idx === 2 && ticket.is_approved && ticket.approved_at) {
                  const d = new Date(ticket.approved_at);
                  dateStr = `${d.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })} - ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
                  dateColorClass = "text-green-500";
                } else if (idx === currentStep && ticket.updated_at) {
                  dateStr = new Date(ticket.updated_at).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });
                }

                return (
                  <div key={step.title} className="flex flex-col items-center w-1/6 relative">
                    {/* Date */}
                    <div className={`absolute -top-8 text-[10px] sm:text-xs font-medium ${dateColorClass} whitespace-nowrap`}>
                      {dateStr}
                    </div>
                    
                    {/* Node Circle */}
                    <div className={`w-3.5 h-3.5 rounded-full mb-3 shadow-sm transition-colors duration-500 ${isCompleted ? 'bg-blue-500' : 'bg-slate-300'}`} />
                    
                    {/* Label */}
                    <div className={`text-xs sm:text-sm font-semibold mb-1 transition-colors duration-500 ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.title}
                    </div>
                    
                    {/* Description */}
                    <div className="text-[10px] sm:text-xs text-slate-400 text-center px-1 leading-tight hidden sm:block h-8">
                      {step.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Issue Details */}
          {ticket.issue_description && isLoggedIn && (
            <div className="mt-16 py-10 border-y border-slate-200 text-left">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-sm font-semibold uppercase tracking-wider text-slate-700">Reported Issue:</span>
                <span className="text-sm text-slate-500">{ticket.issue_description}</span>
              </div>
            </div>
          )}

          {/* Two Column Layout: Cost & Messages */}
          <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
            {/* Cost Information */}
            {isLoggedIn && (ticket.total_estimate > 0 || ticket.total_actual > 0) && (
              <>
              <div className="flex-1 w-full">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Cost Breakdown</h3>

              {ticket.parts && ticket.parts.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-slate-700 mb-2 border-b border-slate-200 pb-1">
                    Inventory Parts
                  </h4>
                  {ticket.parts.map((p: any) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-start text-sm py-2 border-b border-slate-50 last:border-0 pl-4"
                    >
                      <div className="flex flex-col">
                        <span className="text-slate-700">
                          {p.title}{" "}
                          {p.product?.title ? `(${p.product.title})` : ""}
                        </span>
                        <span className="text-slate-400 text-xs text-left mt-0.5">
                          SKU: {p.sku || "-"}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        {p.product?.handle && (
                          <a
                            href={`/products/${p.product.handle}`}
                            target="_blank"
                            className="text-blue-500 hover:text-blue-600 text-xs mb-1"
                          >
                            Store link
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {ticket.custom_parts && ticket.custom_parts.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-slate-700 mb-2 border-b border-slate-200 pb-1">
                    Custom Services
                  </h4>
                  {ticket.custom_parts.map((cp: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-sm py-2 border-b border-slate-50 last:border-0 pl-4"
                    >
                      <span className="text-slate-700">
                        {cp.name}
                      </span>
                      <span className="text-slate-700 font-medium">
                        KES {(cp.price / 100).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2 mt-2">
                <div className="flex justify-between text-sm text-slate-500 pl-4">
                  <span>Parts Estimate:</span>
                  <span className="text-slate-700 font-medium">
                    KES {((ticket.parts_estimate || 0) / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-500 pl-4">
                  <span>Labor Estimate:</span>
                  <span className="text-slate-700 font-medium">
                    KES {((ticket.labor_estimate || 0) / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold text-slate-800 border-t border-slate-200 pt-3 mt-3">
                  <span>Total Estimate:</span>
                  <span>
                    KES {((ticket.total_estimate || 0) / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            {/* Divider */}
            <div className="w-full h-px lg:w-px lg:h-auto lg:self-stretch bg-slate-200 block"></div>
            </>
            )}

            {/* RESTORED: Chat Messages Interface */}
            {isLoggedIn && (
              <div className="flex-1 w-full">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Messages</h3>

              {ticket.updates && ticket.updates.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto mb-6 pr-2">
                  {ticket.updates.map((update: any) => (
                    <div
                      key={update.id}
                      className={`border-b border-slate-100 last:border-0 pb-4 ${
                        update.author_type === "customer" ? "text-right" : "text-left"
                      }`}
                    >
                      <p className="text-xs text-slate-400 mb-1.5">
                        <span className="font-medium text-slate-700 uppercase tracking-wider">{update.author_type === "customer" ? "You" : "Technician"}</span>
                        {" "}•{" "}
                        {new Date(update.created_at).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(update.created_at).toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' })}
                      </p>
                      <p className={`text-[13px] text-slate-800 leading-relaxed inline-block px-3.5 py-2 rounded-md max-w-[90%] text-left ${update.author_type === "customer" ? "bg-green-100" : "bg-blue-100"}`}>{update.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">No messages yet.</p>
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
                  className="flex-1 px-4 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-slate-400 transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-800 text-white text-sm font-medium rounded hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed whitespace-nowrap transition-colors"
                >
                  Send Reply
                </button>
              </form>
            </div>
            )}
          </div>

          {/* Accessories & Documents Group */}
          <div className="flex flex-col gap-4 border-t border-slate-200 pt-10">
            {/* Included Accessories */}
            {ticket.accessories && isLoggedIn && (
              <div className="text-left">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">Included Accessories & Downloadable documents</h3>
                <div className="flex flex-wrap gap-2">
                  {ticket.accessories.split(',').map((acc: string, i: number) => {
                    const colors = [
                      "bg-red-50 text-red-700 border-red-200",
                      "bg-blue-50 text-blue-700 border-blue-200",
                      "bg-green-50 text-green-700 border-green-200",
                      "bg-yellow-50 text-yellow-700 border-yellow-200",
                      "bg-purple-50 text-purple-700 border-purple-200",
                      "bg-pink-50 text-pink-700 border-pink-200",
                      "bg-indigo-50 text-indigo-700 border-indigo-200",
                      "bg-orange-50 text-orange-700 border-orange-200"
                    ];
                    // Deterministically pick a color based on index so it doesn't flicker on re-renders
                    const color = colors[i % colors.length];
                    return (
                      <span key={i} className={`px-3 py-1 rounded-md text-xs font-semibold border ${color} shadow-sm`}>
                        {acc.trim()}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Dynamic Documents Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
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


        </div>
      )}
    </div>
  );
}
