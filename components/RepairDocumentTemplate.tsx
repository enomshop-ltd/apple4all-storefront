import { JSX } from "preact";

export function RepairDocumentTemplate({ ticket, type, qrCodeUrl }: { ticket: any, type: string, qrCodeUrl: string }) {
  const date = new Date(ticket.created_at || Date.now()).toLocaleDateString("en-GB");
  
  let totalRaw = 0;
  if (type === "quote" || type === "job_card") {
    totalRaw = ticket.total_estimate || 0;
  } else {
    totalRaw = ticket.total_actual || ticket.total_estimate || 0;
  }
  
  const currencyCode = "KES";
  const formatAmount = (amt: number) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: currencyCode }).format(amt);
  const total = formatAmount(totalRaw);

  const customerName = ticket.customer?.first_name 
    ? `${ticket.customer.first_name} ${ticket.customer.last_name}`
    : "Customer";

  const isReceipt = type === "receipt";
  const balanceDueRaw = isReceipt ? 0 : totalRaw;
  const balanceDue = formatAmount(balanceDueRaw);

  let title = "Document";
  let headerValueLabel = "Balance Due";
  let headerValue = balanceDue;
  let termsText = "Due on Receipt";
  let footerText = "Thanks for your business.";

  if (type === "job_card") {
    title = "Job Card";
    headerValueLabel = "Status";
    headerValue = ticket.status.toUpperCase();
    termsText = "Standard Intake";
    footerText = "Thanks for trusting us with your device.";
  } else if (type === "quote") {
    title = "Repair Quote";
    headerValueLabel = "Estimated Cost";
    headerValue = total;
    termsText = "Valid for 14 days";
    footerText = "Please review and approve this quote to proceed.";
  } else if (type === "invoice") {
    title = "Tax Invoice";
    headerValueLabel = "Balance Due";
    headerValue = balanceDue;
    termsText = "Due on Receipt";
  } else if (type === "receipt") {
    title = "Receipt";
    headerValueLabel = "Amount Paid";
    headerValue = total;
    termsText = "Paid in Full";
  }

  const isJobCard = type === "job_card";

  return (
    <div className="bg-[#ffffff] text-[#111827] font-sans text-[13px] w-[700px] p-8 mx-auto" style={{ boxSizing: "border-box" }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="mb-4">
             <h1 className="text-2xl font-black tracking-tighter text-[#2563eb]">URBAN DEVICE</h1>
          </div>
          <div className="text-[12px] text-[#4b5563] leading-snug space-y-0.5">
            <p className="font-bold text-[#111827] text-sm mb-1">Urban Device Care Ltd</p>
            <p>Bekim house, Westlands crossway Road</p>
            <p>Nairobi 00800, Kenya</p>
            <p>0115682959 | info@urbandevicecare.co.uk</p>
            <p>KRA PIN P052534849N</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-normal text-[#1f2937] mb-2 tracking-wide uppercase">{title}</h2>
          <p className="text-sm font-semibold mb-6 text-[#374151]"># {ticket.ticket_number}</p>
          
          <div className="text-[12px] text-[#4b5563] mb-1">{headerValueLabel}</div>
          <div className="text-lg font-bold text-[#111827]">{headerValue}</div>
        </div>
      </div>

      <div className="mt-8 mb-6 grid grid-cols-2 gap-8">
        <div className="pt-2">
          <p className="font-bold text-[#111827] text-sm">{customerName}</p>
          <div className="mt-2 text-[#4b5563] text-[12px]">
             <p><span className="font-semibold text-[#1f2937]">Device:</span> {ticket.device?.brand} {ticket.device?.model_name}</p>
             <p><span className="font-semibold text-[#1f2937]">Serial:</span> {ticket.device?.serial_number || "N/A"}</p>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12px] text-right w-64">
            <div className="text-[#4b5563]">Date :</div>
            <div className="text-[#111827]">{date}</div>
            
            <div className="text-[#4b5563]">Terms :</div>
            <div className="text-[#111827]">{termsText}</div>
            
            {!isJobCard && (
              <>
                <div className="text-[#4b5563]">Due Date :</div>
                <div className="text-[#111827]">{date}</div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8">
         <h4 className="font-semibold text-[#111827] mb-2 text-[12px]">Reported Issue:</h4>
         <p className="text-[12px] text-[#374151] p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg">{ticket.issue_description || "No specific issue reported."}</p>
      </div>

      {/* Dynamic Content: Assessment vs Financial Table */}
      {isJobCard ? (
        <div className="mb-16">
          <h4 className="font-semibold text-[#111827] mb-3 text-[12px]">Intake Assessment</h4>
          <table className="w-full text-[12px] border border-[#e5e7eb] rounded-lg overflow-hidden">
            <tbody className="divide-y divide-[#e5e7eb] text-[#1f2937]">
              <tr>
                <td className="py-3 px-4 font-semibold bg-[#f9fafb] w-1/3">Physical Condition</td>
                <td className="py-3 px-4">{ticket.physical_condition || "Not specified during intake."}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold bg-[#f9fafb]">Included Accessories</td>
                <td className="py-3 px-4">{ticket.accessories || "None"}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold bg-[#f9fafb]">Diagnostic Request</td>
                <td className="py-3 px-4">Standard full-device diagnostic authorized.</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <>
          {/* Items Table */}
          <table className="w-full mb-8 text-[12px]">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-2.5 px-3 font-normal text-center w-12">#</th>
                <th className="py-2.5 px-3 font-normal text-left">Description</th>
                <th className="py-2.5 px-3 font-normal text-center w-24">Qty</th>
                <th className="py-2.5 px-3 font-normal text-right w-24">Rate</th>
                <th className="py-2.5 px-3 font-normal text-right w-24">Amount</th>
              </tr>
            </thead>
            <tbody className="text-[#1f2937]">
              {(ticket.parts && ticket.parts.length > 0) ? (
                ticket.parts.map((p: any, idx: number) => (
                  <tr key={p.id || idx} className="border-b border-[#e5e7eb]">
                    <td className="py-3.5 px-3 text-center">{idx + 1}</td>
                    <td className="py-3.5 px-3">
                      {p.title} {p.product?.title ? `(${p.product.title})` : ""}
                    </td>
                    <td className="py-3.5 px-3 text-center">1.00</td>
                    <td className="py-3.5 px-3 text-right">{formatAmount(p.price || p.estimated_price || 0)}</td>
                    <td className="py-3.5 px-3 text-right">{formatAmount(p.price || p.estimated_price || 0)}</td>
                  </tr>
                ))
              ) : (
                 <tr className="border-b border-[#e5e7eb]">
                    <td className="py-3.5 px-3 text-center">1</td>
                    <td className="py-3.5 px-3">Standard Repair Service {type === "quote" ? "(Estimate)" : ""}</td>
                    <td className="py-3.5 px-3 text-center">1.00</td>
                    <td className="py-3.5 px-3 text-right">{total}</td>
                    <td className="py-3.5 px-3 text-right">{total}</td>
                 </tr>
              )}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-16">
            <div className="w-[300px]">
              <div className="flex justify-between py-2 text-[12px]">
                <span className="font-bold text-[#111827] text-right flex-1 pr-6">Sub Total</span>
                <span className="text-right w-28">{total}</span>
              </div>
              
              <div className="flex justify-between py-2 text-[12px] border-t border-b border-[#e5e7eb] my-1">
                <span className="font-bold text-[#111827] text-right flex-1 pr-6">
                  {type === "quote" ? "Estimated Total" : "Total"}
                </span>
                <span className="font-bold text-[#111827] text-right w-28">{total}</span>
              </div>
              
              {isReceipt && (
                <div className="flex justify-between py-2 text-[12px]">
                  <span className="text-[#4b5563] text-right flex-1 pr-6">Payment Made</span>
                  <span className="text-[#ef4444] text-right w-28">(-) {total}</span>
                </div>
              )}
              
              <div className="flex justify-between py-2.5 px-2 text-[12px] bg-[#f3f4f6] mt-2">
                <span className="font-bold text-[#111827] text-right flex-1 pr-4">
                  {type === "quote" ? "Estimated Balance" : "Balance Due"}
                </span>
                <span className="font-bold text-[#111827] text-right w-28">{balanceDue}</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Footer / Notes */}
      <div className="flex justify-between items-end">
        <div className="text-[12px] text-[#1f2937] space-y-1">
          <p>{footerText}</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <img src={qrCodeUrl} alt="Track QR Code" className="w-16 h-16 object-contain mix-blend-multiply" />
          <span className="text-[9px] text-[#9ca3af] uppercase tracking-wider">Track Online</span>
        </div>
      </div>
    </div>
  );
}
