import { useState, useEffect } from "preact/hooks";

export default function TrackRepairIsland({
  backendUrl,
  initialToken,
  initialTicket,
  publishableApiKey,
}: {
  backendUrl: string;
  initialToken?: string;
  initialTicket?: string;
  publishableApiKey?: string;
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
      const response = await fetch(
        `${backendUrl}/store/repairs/token/${token}`,
        {
          credentials: "omit",
          headers: publishableApiKey
            ? { "x-publishable-api-key": publishableApiKey }
            : {},
        },
      );
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
    console.debug(
      `[TrackRepairIsland] Searching for ticket number: ${ticketNumber}`,
    );

    try {
      const response = await fetch(
        `${backendUrl}/store/repairs/${encodeURIComponent(ticketNumber)}`,
        {
          credentials: "omit",
          headers: publishableApiKey
            ? { "x-publishable-api-key": publishableApiKey }
            : {},
        },
      );

      if (!response.ok) {
        console.error(
          `[TrackRepairIsland] Repair ticket not found for ticket number: ${ticketNumber}, status: ${response.status}`,
        );
        throw new Error("Repair ticket not found");
      }

      const data = await response.json();
      console.debug(
        `[TrackRepairIsland] Successfully fetched repair ticket:`,
        data.repair_ticket,
      );
      setTicket(data.repair_ticket);
    } catch (err: any) {
      console.error(`[TrackRepairIsland] Error during fetch:`, err);
      setError(err.message || "Failed to find repair ticket");
    } finally {
      setLoading(false);
      console.debug(`[TrackRepairIsland] Search finished.`);
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
    <div class="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Track Your Repair</h1>
        <p className="text-gray-600">
          Enter your repair ticket number to check repair status
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            value={ticketNumber}
            onInput={(e) =>
              setTicketNumber((e.target as HTMLInputElement).value)
            }
            placeholder="Enter ticket number (e.g., REPAIR-1234)..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Searching..." : "Track"}
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      {ticket && (
        <div className="space-y-6">
          {/* Status Overview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {ticket.ticket_number}
                </h2>
                <p className="text-gray-600">
                  {ticket.device?.brand} {ticket.device?.model_name}
                </p>
                <p className="text-sm text-gray-500">
                  S/N: {ticket.device?.serial_number}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-white font-medium ${
                  getStatusInfo(ticket.status).color
                }`}
              >
                {getStatusInfo(ticket.status).label}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    getStatusInfo(ticket.status).color
                  }`}
                  style={{
                    width: `${getStatusInfo(ticket.status).progress}%`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-600">
                <span>Received</span>
                <span>Diagnosing</span>
                <span>Repairing</span>
                <span>Ready</span>
              </div>
            </div>

            {/* Issue Description */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Issue Description</h3>
              <p className="text-gray-700">{ticket.issue_description}</p>
              {ticket.accessories && (
                <p className="text-sm text-gray-600 mt-2">
                  Accessories: {ticket.accessories}
                </p>
              )}
            </div>
          </div>

          {/* Cost Information */}
          {(ticket.total_estimate > 0 || ticket.total_actual > 0) && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Cost Breakdown</h3>

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
                        ${(cp.price / 100).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Parts Estimate:</span>
                  <span className="font-medium">
                    ${((ticket.parts_estimate || 0) / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Labor Estimate:</span>
                  <span className="font-medium">
                    ${((ticket.labor_estimate || 0) / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                  <span>Total Estimate:</span>
                  <span>
                    ${((ticket.total_estimate || 0) / 100).toFixed(2)}
                  </span>
                </div>

                <div className="mt-4 flex gap-3 pt-4 border-t border-gray-100">
                  <a
                    href={
                      initialToken
                        ? `${backendUrl}/store/repairs/token/${initialToken}/document?type=quote`
                        : `${backendUrl}/store/repairs/${ticket.id}/document?type=quote`
                    }
                    target="_blank"
                    className="flex-1 text-center px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition font-medium text-sm border border-gray-200"
                  >
                    Download Quote (PDF)
                  </a>
                  {ticket.status === "completed" ||
                  ticket.status === "ready" ? (
                    <a
                      href={
                        initialToken
                          ? `${backendUrl}/store/repairs/token/${initialToken}/document?type=invoice`
                          : `${backendUrl}/store/repairs/${ticket.id}/document?type=invoice`
                      }
                      target="_blank"
                      className="flex-1 text-center px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition font-medium text-sm border border-blue-200"
                    >
                      Download Invoice (PDF)
                    </a>
                  ) : null}
                </div>
              </div>

              {!ticket.terms_accepted && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
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
                      const terms = (
                        document.getElementById(
                          "termsCheck",
                        ) as HTMLInputElement
                      ).checked;
                      const dataWipe = (
                        document.getElementById("dataCheck") as HTMLInputElement
                      ).checked;

                      if (!terms) {
                        alert("Please agree to the Repair Terms to continue.");
                        return;
                      }

                      try {
                        let response;
                        if (initialToken) {
                          response = await fetch(
                            `${backendUrl}/store/repairs/compliance`,
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                ...(publishableApiKey
                                  ? { "x-publishable-api-key": publishableApiKey }
                                  : {}),
                              },
                              body: JSON.stringify({
                                token: initialToken,
                                terms_accepted: true,
                                data_wiped_consent: dataWipe,
                              }),
                            },
                          );
                        } else {
                          response = await fetch(
                            `${backendUrl}/store/repairs/${ticket.id}/compliance`,
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                ...(publishableApiKey
                                  ? { "x-publishable-api-key": publishableApiKey }
                                  : {}),
                              },
                              body: JSON.stringify({
                                terms_accepted: true,
                                data_wiped_consent: dataWipe,
                              }),
                            },
                          );
                        }

                        if (response.ok) {
                          alert("Terms accepted successfully!");
                          if (initialToken) handleTokenSearch(initialToken);
                          else handleSearch(new Event("submit") as any);
                        } else {
                          throw new Error("Failed to accept terms");
                        }
                      } catch (err: any) {
                        alert(
                          err.message || "Failed to update compliance details",
                        );
                      }
                    }}
                    className="w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
                  >
                    Accept & Continue
                  </button>
                </div>
              )}

              {ticket.status === "awaiting_approval" &&
                !ticket.is_approved &&
                ticket.terms_accepted && (
                  <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded">
                    <p className="text-orange-800 font-medium mb-3">
                      Your approval is required to proceed with the repair.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          console.debug(
                            `[TrackRepairIsland] Approving repair for ticket ID: ${ticket.id}`,
                          );
                          try {
                            let response;
                            if (initialToken) {
                              response = await fetch(
                                `${backendUrl}/store/repairs/approve`,
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                    ...(publishableApiKey
                                      ? { "x-publishable-api-key": publishableApiKey }
                                      : {}),
                                  },
                                  body: JSON.stringify({
                                    token: initialToken,
                                    approved: true,
                                  }),
                                },
                              );
                            } else {
                              response = await fetch(
                                `${backendUrl}/store/repairs/${ticket.id}/approve`,
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                    ...(publishableApiKey
                                      ? { "x-publishable-api-key": publishableApiKey }
                                      : {}),
                                  },
                                  body: JSON.stringify({ approved: true }),
                                },
                              );
                            }
                            if (response.ok) {
                              alert(
                                "Repair approved! Work will begin shortly.",
                              );
                              if (initialToken) handleTokenSearch(initialToken);
                              else handleSearch(new Event("submit") as any);
                              console.debug(
                                `[TrackRepairIsland] Successfully approved repair ticket ID: ${ticket.id}`,
                              );
                            } else {
                              throw new Error("Failed to approve repair");
                            }
                          } catch (err) {
                            console.error(
                              `[TrackRepairIsland] Error approving repair ticket ID: ${ticket.id}`,
                              err,
                            );
                            alert("Failed to approve repair");
                          }
                        }}
                        className="flex-1 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                      >
                        Approve Repair
                      </button>
                      <button
                        onClick={async () => {
                          if (
                            !confirm(
                              "Are you sure you want to decline this repair? This will cancel the ticket.",
                            )
                          )
                            return;
                          console.debug(
                            `[TrackRepairIsland] Declining repair for ticket ID: ${ticket.id}`,
                          );
                          try {
                            let response;
                            if (initialToken) {
                              response = await fetch(
                                `${backendUrl}/store/repairs/approve`,
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                    ...(publishableApiKey
                                      ? { "x-publishable-api-key": publishableApiKey }
                                      : {}),
                                  },
                                  body: JSON.stringify({
                                    token: initialToken,
                                    approved: false,
                                  }),
                                },
                              );
                            } else {
                              response = await fetch(
                                `${backendUrl}/store/repairs/${ticket.id}/approve`,
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                    ...(publishableApiKey
                                      ? { "x-publishable-api-key": publishableApiKey }
                                      : {}),
                                  },
                                  body: JSON.stringify({ approved: false }),
                                },
                              );
                            }
                            if (response.ok) {
                              alert("Repair has been declined and cancelled.");
                              if (initialToken) handleTokenSearch(initialToken);
                              else handleSearch(new Event("submit") as any);
                            } else {
                              throw new Error("Failed to decline repair");
                            }
                          } catch (err) {
                            console.error(
                              `[TrackRepairIsland] Error declining repair ticket ID: ${ticket.id}`,
                              err,
                            );
                            alert("Failed to decline repair");
                          }
                        }}
                        className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        Decline Repair
                      </button>
                    </div>
                  </div>
                )}

              {ticket.is_approved && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-green-800 text-sm">
                    Approved on{" "}
                    {new Date(ticket.approved_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Timeline */}
          {ticket.estimated_completion && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Timeline</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Estimated Completion</p>
                  <p className="text-lg font-semibold">
                    {new Date(ticket.estimated_completion).toLocaleDateString()}
                  </p>
                </div>
                {ticket.warranty_expiry && (
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Warranty Until</p>
                    <p className="text-lg font-semibold">
                      {new Date(ticket.warranty_expiry).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Media Gallery */}
          {ticket.media && ticket.media.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Device Photos</h3>
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

          {/* Customer-visible Notes */}
          {ticket.notes &&
            ticket.notes.filter((n: any) => !n.is_internal).length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Updates</h3>
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

          {/* Chat Messages */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Messages</h3>

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
                const input = form.elements.namedItem(
                  "message",
                ) as HTMLInputElement;
                const message = input.value.trim();

                if (!message) return;

                try {
                  const submitBtn = form.querySelector(
                    'button[type="submit"]',
                  ) as HTMLButtonElement;
                  submitBtn.disabled = true;
                  submitBtn.textContent = "Sending...";

                  const bodyData: any = { message };
                  if (initialToken) {
                    bodyData.token = initialToken;
                  }

                  const response = await fetch(
                    `${backendUrl}/store/repairs/${ticket.id}/messages`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        ...(publishableApiKey
                          ? { "x-publishable-api-key": publishableApiKey }
                          : {}),
                      },
                      body: JSON.stringify(bodyData),
                      credentials: "omit",
                    },
                  );

                  if (!response.ok) throw new Error("Failed to send message");

                  // Refresh ticket data
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
                  const submitBtn = form.querySelector(
                    'button[type="submit"]',
                  ) as HTMLButtonElement;
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
        </div>
      )}
    </div>
  );
}
