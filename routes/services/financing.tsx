import { define } from "../../lib/utils.ts";
import { page } from "fresh";
import { Head } from "fresh/runtime";
import { CheckCircle2, CreditCard, ShieldCheck } from "lucide-preact";
import { STORE_NAME } from "../../lib/utils.ts";

export const handler = define.handlers({
  GET(ctx) {
    ctx.state.title = `Financing Options - ${STORE_NAME}`;
    ctx.state.description =
      "Flexible financing options for purchasing refurbished Macs at {STORE_NAME} in Westlands, Nairobi.";
    return page();
  },
});

export default define.page(function FinancingPage(props) {
  return (
    <div class="max-w-7xl mx-auto px-4 py-12">
      <Head>
        <title>{props.state.title as string}</title>
        <meta name="description" content={props.state.description as string} />
      </Head>
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold mb-6 text-gray-900">
          Flexible Financing Options
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          At {STORE_NAME}, we believe premium technology should be accessible.
          That's why we offer flexible financing plans to help you spread the
          cost of your refurbished Mac over time.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div class="p-8 bg-transparent rounded-2xl border border-gray-200/60 hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-slate-200 text-slate-800 rounded-xl flex items-center justify-center mb-6">
            <CreditCard class="w-6 h-6" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">
            Lipa Mdogo Mdogo
          </h3>
          <p class="text-gray-600 leading-relaxed mb-4">
            Pay for your device in manageable installments over 3 to 6 months. A
            down payment is required, and the balance is spread out to fit your
            budget. We only release the device after you finish payment.
          </p>
          <ul class="space-y-2 text-sm text-gray-600">
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-green-500" /> Flexible terms
            </li>
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-green-500" />{" "}
              Quick approval process
            </li>
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-green-500" />{" "}
              Available for select devices
            </li>
          </ul>
        </div>

        <div class="p-8 bg-transparent rounded-2xl border border-gray-200/60 hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-slate-200 text-slate-800 rounded-xl flex items-center justify-center mb-6">
            <ShieldCheck class="w-6 h-6" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">
            Corporate & Business Accounts
          </h3>
          <p class="text-gray-600 leading-relaxed mb-4">
            For businesses outfitting their teams or requiring ongoing maintenance, we offer tailored payment
            plans and bulk purchasing discounts. Contact our B2B team for
            customized solutions.
          </p>
          <ul class="space-y-2 text-sm text-gray-600">
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-green-500" />{" "}
              Net 30 terms available (repairs only)
            </li>
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-green-500" />{" "}
              Dedicated account manager
            </li>
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-green-500" /> Volume discounts
            </li>
          </ul>
        </div>
      </div>

      <div class="bg-slate-900 text-white p-10 rounded-2xl text-center">
        <h2 class="text-3xl font-bold mb-4">Ready to Apply?</h2>
        <p class="text-slate-300 mb-8 max-w-xl mx-auto text-lg">
          Visit our store in Westlands, Nairobi with your national ID and proof
          of income to start the application process.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/about/contact"
            class="bg-white text-slate-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
});
