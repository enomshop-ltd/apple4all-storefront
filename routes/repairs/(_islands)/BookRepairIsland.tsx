import { useState } from "preact/hooks";
import { CheckCircle2, ChevronRight, ChevronLeft } from "lucide-preact";

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
      setError("You must accept the terms to proceed.");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/repairs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          device: { brand, model_name: modelName, serial_number: serialNumber },
          ticket: { issue_description: issueDescription, accessories: accessories || undefined }
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("[BookRepairIsland] Failed to book repair:", errText);
        throw new Error("Failed to submit request.");
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
      <div class="max-w-2xl mx-auto py-20 px-8 text-center animate-fade-in">
        <div class="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 class="w-8 h-8" />
        </div>
        <h2 class="text-4xl md:text-6xl font-[Oswald] uppercase tracking-tighter leading-none mb-6 text-slate-900">
          Request<br/>Received
        </h2>
        <p class="text-slate-500 font-serif italic text-xl mb-12">
          Your device has been successfully registered. Your ticket number is:
        </p>
        <div class="text-3xl md:text-5xl font-[Oswald] uppercase tracking-wider text-slate-900 mb-16 border-b-2 border-black pb-4 inline-block">
          {successTicket}
        </div>
        <div class="flex flex-col sm:flex-row gap-6 justify-center">
          <a
            href={`/repairs/track?token=${successTicket}`}
            class="px-8 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors"
          >
            Track Status
          </a>
          <a
            href="/account/repairs"
            class="px-8 py-4 bg-transparent text-slate-900 border border-slate-300 text-xs font-bold uppercase tracking-widest hover:border-black transition-colors"
          >
            Dashboard
          </a>
        </div>
      </div>
    );
  }

  const stepLabels = ["Device Info", "Issue Details", "Review"];

  return (
    <div class="w-full mx-auto mt-8">
      
      {/* Minimal Stepper */}
      <div class="mb-16 flex items-center justify-between border-b border-slate-200 pb-4">
        <span class="text-xs font-bold uppercase tracking-widest text-slate-400">
          Step 0{step} <span class="mx-2 text-slate-300">/</span> 03
        </span>
        <span class="text-xs font-bold uppercase tracking-widest text-slate-900">
          {stepLabels[step - 1]}
        </span>
      </div>

      <div class="px-0">
        {error && (
          <div class="mb-10 p-4 bg-red-50 text-red-800 border-l-2 border-red-800 font-serif italic flex items-center gap-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* STEP 1: DEVICE DETAILS */}
          <div class={step === 1 ? "block animate-fade-in" : "hidden"}>
            <h3 class="text-4xl md:text-5xl font-[Oswald] uppercase tracking-tighter text-slate-900 mb-10 leading-none">
              Device<br/>Information
            </h3>
            <div class="space-y-8">
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Brand</label>
                <div class="relative">
                  <select
                    value={brand}
                    onInput={(e) => setBrand((e.target as HTMLSelectElement).value)}
                    class="w-full px-0 py-4 bg-transparent border-0 border-b border-slate-300 focus:ring-0 focus:border-black outline-none appearance-none font-sans text-lg text-slate-900 transition-colors rounded-none"
                    required
                  >
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Google">Google</option>
                    <option value="Other">Other</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-900">
                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Model Name</label>
                <input
                  type="text"
                  value={modelName}
                  onInput={(e) => setModelName((e.target as HTMLInputElement).value)}
                  placeholder="e.g. MacBook Pro M2"
                  class="w-full px-0 py-4 bg-transparent border-0 border-b border-slate-300 focus:ring-0 focus:border-black outline-none font-sans text-lg text-slate-900 placeholder:text-slate-300 transition-colors rounded-none"
                  required
                />
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Serial / IMEI</label>
                <input
                  type="text"
                  value={serialNumber}
                  onInput={(e) => setSerialNumber((e.target as HTMLInputElement).value)}
                  placeholder="Required for parts lookup"
                  class="w-full px-0 py-4 bg-transparent border-0 border-b border-slate-300 focus:ring-0 focus:border-black outline-none font-mono text-lg text-slate-900 uppercase placeholder:text-slate-300 transition-colors rounded-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* STEP 2: ISSUE DETAILS */}
          <div class={step === 2 ? "block animate-fade-in" : "hidden"}>
            <h3 class="text-4xl md:text-5xl font-[Oswald] uppercase tracking-tighter text-slate-900 mb-10 leading-none">
              Report<br/>Issue
            </h3>
            <div class="space-y-10">
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Description</label>
                <textarea
                  value={issueDescription}
                  onInput={(e) => setIssueDescription((e.target as HTMLTextAreaElement).value)}
                  rows={4}
                  placeholder="Describe the problem in detail..."
                  class="w-full px-0 py-4 bg-transparent border-0 border-b border-slate-300 focus:ring-0 focus:border-black outline-none resize-y text-slate-900 font-sans text-lg placeholder:text-slate-300 transition-colors rounded-none"
                  required
                />
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Included Accessories</label>
                <input
                  type="text"
                  value={accessories}
                  onInput={(e) => setAccessories((e.target as HTMLInputElement).value)}
                  placeholder="e.g. Charger, Case (Optional)"
                  class="w-full px-0 py-4 bg-transparent border-0 border-b border-slate-300 focus:ring-0 focus:border-black outline-none font-sans text-lg text-slate-900 placeholder:text-slate-300 transition-colors rounded-none"
                />
              </div>
            </div>
          </div>

          {/* STEP 3: REVIEW & SUBMIT */}
          <div class={step === 3 ? "block animate-fade-in" : "hidden"}>
            <h3 class="text-4xl md:text-5xl font-[Oswald] uppercase tracking-tighter text-slate-900 mb-10 leading-none">
              Review &<br/>Confirm
            </h3>
            
            <div class="mb-12">
              <dl class="space-y-6">
                <div class="border-b border-slate-200 pb-4">
                  <dt class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Device</dt>
                  <dd class="text-slate-900 font-medium text-lg">{brand} {modelName} <span class="text-slate-400 ml-2 font-mono text-sm">{serialNumber}</span></dd>
                </div>
                <div class="border-b border-slate-200 pb-4">
                  <dt class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Issue</dt>
                  <dd class="text-slate-900 font-serif italic text-lg">{issueDescription}</dd>
                </div>
                {accessories && (
                  <div class="border-b border-slate-200 pb-4">
                    <dt class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Accessories</dt>
                    <dd class="text-slate-900 text-lg">{accessories}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div class="flex items-start gap-4 p-6 bg-slate-50">
              <div class="flex-shrink-0 pt-0.5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted((e.target as HTMLInputElement).checked)}
                  class="w-5 h-5 text-black rounded-none border-slate-300 focus:ring-black"
                />
              </div>
              <label for="terms" class="text-sm text-slate-600 cursor-pointer select-none leading-relaxed">
                <strong class="text-slate-900 block mb-1 font-bold tracking-wide uppercase text-xs">Agreement</strong>
                I agree to the <a href="/legal/terms" target="_blank" class="text-black underline hover:text-slate-600">Terms of Service</a> and authorize diagnostics. I am responsible for backing up my data prior to service.
              </label>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div class="mt-16 pt-8 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                class="px-0 py-4 text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-black transition flex items-center group"
              >
                <ChevronLeft class="w-4 h-4 mr-2" />
                Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                class="px-8 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors flex items-center"
              >
                Next Step
                <ChevronRight class="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !termsAccepted}
                class="px-8 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors disabled:bg-slate-300 disabled:text-slate-500 flex items-center"
              >
                {loading ? "Submitting..." : "Book Repair"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}