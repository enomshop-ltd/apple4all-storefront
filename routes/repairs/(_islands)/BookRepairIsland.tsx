import { useState } from "preact/hooks";
import { CheckCircle2, ChevronRight, ChevronLeft, Wrench, Smartphone, FileText } from "lucide-preact";

export default function BookRepairIsland() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successTicket, setSuccessTicket] = useState<string | null>(null);

  // Stepper State
  const [step, setStep] = useState(1);

  // Form State
  const [brand, setBrand] = useState("Apple");
  const [modelName, setModelName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [accessories, setAccessories] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const nextStep = () => {
    if (step === 1) {
      if (!brand || !modelName || !serialNumber) {
        setError("Please fill out all required device fields.");
        return;
      }
    } else if (step === 2) {
      if (!issueDescription) {
        setError("Please provide an issue description.");
        return;
      }
    }
    setError(null);
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError("You must accept the terms and conditions to proceed.");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
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
          ticket: {
            issue_description: issueDescription,
            accessories: accessories || undefined,
          }
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("[BookRepairIsland] Failed to book repair:", errText);
        throw new Error("Failed to submit repair request. Please try again.");
      }

      const data = await response.json();
      const ticketNumber = data.repair_ticket?.ticket_number || data.ticket_number;
      setSuccessTicket(ticketNumber);
      
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (successTicket) {
    return (
      <div class="max-w-2xl mx-auto p-10 bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-3xl text-center shadow-xl">
        <div class="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transform scale-110">
          <CheckCircle2 class="w-10 h-10" />
        </div>
        <h2 class="text-3xl font-extrabold text-green-900 mb-3">Booking Confirmed!</h2>
        <p class="text-green-800 mb-8 text-lg">
          Your device has been successfully registered for repair. Your ticket number is:
        </p>
        <div class="text-4xl font-mono font-bold text-slate-900 mb-10 bg-white/80 py-4 px-8 inline-block rounded-2xl border-2 border-green-300 shadow-inner">
          {successTicket}
        </div>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`/repairs/track?token=${successTicket}`}
            class="inline-block px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition transform hover:-translate-y-1 hover:shadow-lg"
          >
            Track Repair Live
          </a>
          <a
            href="/account/repairs"
            class="inline-block px-8 py-4 bg-white text-slate-800 font-bold rounded-xl border border-slate-300 hover:bg-slate-50 transition"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div class="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200/60">
      
      {/* Stepper Header */}
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
        <div class="flex items-center justify-between relative">
          {/* Progress Bar Background */}
          <div class="absolute top-1/2 left-0 w-full h-1 bg-white/20 -z-10 -translate-y-1/2"></div>
          {/* Active Progress Bar */}
          <div 
            class="absolute top-1/2 left-0 h-1 bg-white -z-10 -translate-y-1/2 transition-all duration-500 ease-out"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>

          {[
            { num: 1, label: "Device Details", icon: <Smartphone class="w-5 h-5" /> },
            { num: 2, label: "Issue Info", icon: <Wrench class="w-5 h-5" /> },
            { num: 3, label: "Review", icon: <FileText class="w-5 h-5" /> }
          ].map((s) => (
            <div key={s.num} class="flex flex-col items-center gap-2 relative bg-transparent z-10">
              <div class={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 shadow-md ${
                step >= s.num ? "bg-white text-blue-600 ring-4 ring-blue-400/30" : "bg-blue-800 text-blue-300 border border-blue-500/50"
              }`}>
                {step > s.num ? <CheckCircle2 class="w-6 h-6" /> : s.icon}
              </div>
              <span class={`text-xs sm:text-sm font-medium ${step >= s.num ? "text-white" : "text-blue-300"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div class="p-8 sm:p-10">
        {error && (
          <div class="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg font-medium flex items-center gap-3">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* STEP 1: DEVICE DETAILS */}
          <div class={step === 1 ? "block animate-fade-in" : "hidden"}>
            <h3 class="text-2xl font-bold text-slate-800 mb-6">What device are we fixing?</h3>
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Brand <span class="text-red-500">*</span></label>
                <div class="relative">
                  <select
                    value={brand}
                    onInput={(e) => setBrand((e.target as HTMLSelectElement).value)}
                    class="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-blue-500 outline-none bg-slate-50 hover:bg-white transition-colors appearance-none font-medium text-slate-800 text-lg"
                    required
                  >
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Google">Google</option>
                    <option value="Other">Other</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-500">
                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Model Name <span class="text-red-500">*</span></label>
                <input
                  type="text"
                  value={modelName}
                  onInput={(e) => setModelName((e.target as HTMLInputElement).value)}
                  placeholder="e.g. MacBook Pro M2 2023"
                  class="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-blue-500 outline-none bg-slate-50 hover:bg-white transition-colors font-medium text-slate-800 text-lg"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Serial Number / IMEI <span class="text-red-500">*</span></label>
                <input
                  type="text"
                  value={serialNumber}
                  onInput={(e) => setSerialNumber((e.target as HTMLInputElement).value)}
                  placeholder="Required for accurate parts lookup"
                  class="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-blue-500 outline-none bg-slate-50 hover:bg-white transition-colors font-mono text-slate-800 text-lg uppercase"
                  required
                />
              </div>
            </div>
          </div>

          {/* STEP 2: ISSUE DETAILS */}
          <div class={step === 2 ? "block animate-fade-in" : "hidden"}>
            <h3 class="text-2xl font-bold text-slate-800 mb-6">What seems to be the problem?</h3>
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Issue Description <span class="text-red-500">*</span></label>
                <textarea
                  value={issueDescription}
                  onInput={(e) => setIssueDescription((e.target as HTMLTextAreaElement).value)}
                  rows={5}
                  placeholder="Please describe the issue in as much detail as possible (e.g., 'Screen is cracked in the bottom left corner', 'Battery dies after 2 hours')."
                  class="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-blue-500 outline-none resize-y bg-slate-50 hover:bg-white transition-colors text-slate-800"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Included Accessories <span class="text-slate-400 font-normal ml-1">(Optional)</span></label>
                <input
                  type="text"
                  value={accessories}
                  onInput={(e) => setAccessories((e.target as HTMLInputElement).value)}
                  placeholder="e.g. 140W Charger, MagSafe Cable, Case"
                  class="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-blue-500 outline-none bg-slate-50 hover:bg-white transition-colors text-slate-800"
                />
                <p class="text-xs text-slate-500 mt-2">Only include items you plan to drop off with the device.</p>
              </div>
            </div>
          </div>

          {/* STEP 3: REVIEW & SUBMIT */}
          <div class={step === 3 ? "block animate-fade-in" : "hidden"}>
            <h3 class="text-2xl font-bold text-slate-800 mb-6">Review & Confirm</h3>
            
            <div class="bg-slate-50 rounded-2xl border border-slate-200 p-6 mb-8">
              <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <dt class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Device</dt>
                  <dd class="text-slate-900 font-medium">{brand} {modelName}</dd>
                </div>
                <div>
                  <dt class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Serial Number</dt>
                  <dd class="text-slate-900 font-mono text-sm">{serialNumber}</dd>
                </div>
                <div class="sm:col-span-2 pt-2 border-t border-slate-200">
                  <dt class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Reported Issue</dt>
                  <dd class="text-slate-900 italic">"{issueDescription}"</dd>
                </div>
                {accessories && (
                  <div class="sm:col-span-2 pt-2 border-t border-slate-200">
                    <dt class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Included Accessories</dt>
                    <dd class="text-slate-900">{accessories}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-start gap-4">
              <div class="flex-shrink-0 pt-0.5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted((e.target as HTMLInputElement).checked)}
                  class="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </div>
              <label for="terms" class="text-sm text-slate-700 cursor-pointer select-none">
                <strong class="text-slate-900 block mb-1">Legal & Compliance Agreement <span class="text-red-500">*</span></strong>
                I agree to the <a href="/legal/terms" target="_blank" class="text-blue-600 hover:underline">Terms of Service</a> and authorize diagnostics to be performed on my device. I understand that I am responsible for backing up my data prior to service, and the store is not liable for data loss.
              </label>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div class="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                class="px-6 py-3 bg-white text-slate-700 font-bold rounded-xl border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition flex items-center group"
              >
                <ChevronLeft class="w-5 h-5 mr-1 text-slate-400 group-hover:text-slate-700 transition" />
                Back
              </button>
            ) : (
              <div></div> // Empty div for flex spacing
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                class="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition transform hover:-translate-y-0.5 flex items-center group"
              >
                Continue
                <ChevronRight class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !termsAccepted}
                class="px-10 py-3.5 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 hover:shadow-xl transition transform hover:-translate-y-0.5 disabled:bg-slate-400 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none flex items-center"
              >
                {loading ? (
                  <>
                    <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 class="w-5 h-5 mr-2" />
                    Confirm & Book Repair
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}