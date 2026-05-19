import { Handlers, PageProps } from "$fresh/server.ts";
import { medusaUrl } from "../lib/sdk.ts";
import { CheckCircle2, XCircle } from "lucide-preact";

interface VerifyPageData {
  success: boolean;
  message: string;
}

export const handler: Handlers<VerifyPageData> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    const email = url.searchParams.get("email");

    if (!token || !email) {
      return ctx.render({
        success: false,
        message: "Missing verification token or email parameters.",
      });
    }

    try {
      // Call Medusa backend to verify the email
      // We expect the user to have implemented POST /store/customers/verify-email
      const res = await fetch(`${medusaUrl}/store/customers/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        return ctx.render({
          success: true,
          message: "Your email has been successfully verified!",
        });
      } else {
        return ctx.render({
          success: false,
          message: data.error || "Failed to verify email.",
        });
      }
    } catch (e) {
      return ctx.render({
        success: false,
        message: "An unexpected error occurred during verification.",
      });
    }
  },
};

export default function VerifyEmailPage({ data }: PageProps<VerifyPageData>) {
  return (
    <div class="min-h-[60vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 text-center">
        {data.success ? (
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
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <XCircle class="h-8 w-8 text-red-600" />
            </div>
            <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Verification Failed</h2>
            <p class="mt-4 text-slate-600 text-lg">
              {data.message}
            </p>
            <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/login"
                class="flex-1 flex justify-center py-3 px-4 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
              >
                Return to Login
              </a>
              <a
                href="/account/support"
                class="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
