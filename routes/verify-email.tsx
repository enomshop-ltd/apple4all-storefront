import { define } from "../utils.ts";
import { page } from "fresh";
import { CheckCircle2, XCircle } from "lucide-preact";

interface VerifyPageData {
  success: boolean;
  message: string;
  email: string | null;
  token: string | null;
  attempted: boolean;
}

export const handler = define.handlers({
  async GET(ctx) {
    const url = new URL(ctx.req.url);
    const token = url.searchParams.get("token");
    const email = url.searchParams.get("email");

    console.debug(`[Storefront VerifyEmail] GET hit. Email: ${email}, Token provided: ${!!token}`);

    if (!token || !email) {
      console.debug("[Storefront VerifyEmail] Missing email or token. Rendering input form.");
      return page({
        success: false,
        message: "",
        email,
        token,
        attempted: false,
      });
    }

    try {
      const backendUrl = Deno.env.get("MEDUSA_BACKEND_URL") || "http://localhost:9000";
      const publishableKey = Deno.env.get("MEDUSA_PUBLISHABLE_KEY") || "";
      
      console.debug(`[Storefront VerifyEmail] Fetching Medusa backend at: ${backendUrl}`);

      const res = await fetch(`${backendUrl}/store/customers/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": publishableKey,
        },
        body: JSON.stringify({ email, token }),
      });

      console.debug(`[Storefront VerifyEmail] Backend returned Status: ${res.status} ${res.statusText}`);
      const data = await res.json();
      console.debug("[Storefront VerifyEmail] Backend JSON payload:", data);

      if (res.ok && data.success) {
        console.info(`[Storefront VerifyEmail] Verification SUCCESS for: ${email}`);
        return page({
          success: true,
          message: "Your email has been successfully verified!",
          email,
          token,
          attempted: true,
        });
      } else {
        console.warn(`[Storefront VerifyEmail] Verification FAILED. Reason: ${data.error || data.message}`);
        return page({
          success: false,
          message: data.error || data.message || "Failed to verify email. Please check your token and try again.",
          email,
          token,
          attempted: true,
        });
      }
    } catch (e) {
      // The silent failure was happening here
      console.error("[Storefront VerifyEmail] CRITICAL FETCH ERROR (Check MEDUSA_BACKEND_URL env var):", e);
      return page({
        success: false,
        message: "An unexpected network error occurred during verification.",
        email,
        token,
        attempted: true,
      });
    }
  },
});

export default define.page<VerifyPageData>(function VerifyEmailPage({ data }) {
  const showForm = !data.attempted || !data.success;

  return (
    <div class="min-h-[60vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 text-center">
        {!showForm ? (
          <div>
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <CheckCircle2 class="h-8 w-8 text-green-600" />
            </div>
            <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Account Verified</h2>
            <p class="mt-4 text-slate-600 text-lg">
              {data.message}
            </p>
            <div class="mt-8">
              <a
                href="/login"
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
              >
                Log in to your account
              </a>
            </div>
          </div>
        ) : (
          <div>
            {data.attempted && !data.success && (
              <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                <XCircle class="h-8 w-8 text-red-600" />
              </div>
            )}
            <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">
              {data.attempted && !data.success ? "Verification Failed" : "Verify Email"}
            </h2>
            <p class="mt-4 text-slate-600 text-sm">
              {data.attempted && !data.success 
                ? data.message 
                : "Please enter the verification code sent to your email to activate your account."}
            </p>

            <form method="get" class="mt-8 space-y-6 text-left">
              <div class="space-y-2">
                <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  id="email" 
                  required 
                  value={data.email || ""} 
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors"
                />
              </div>

              <div class="space-y-2">
                <label for="token" class="block text-sm font-medium text-gray-700">Verification Code</label>
                <input 
                  type="text" 
                  name="token" 
                  id="token" 
                  required 
                  value={data.token || ""}
                  placeholder="e.g. 9EBCB7"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors uppercase tracking-widest text-center font-mono text-lg"
                />
              </div>

              <button 
                type="submit"
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
              >
                Verify Account
              </button>
            </form>

            <div class="mt-6 border-t border-slate-100 pt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/login"
                class="flex-1 flex justify-center py-2 px-4 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
              >
                Back to Sign in
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});