import { define } from "../../lib/utils.ts";
import { page } from "fresh";
import { Head } from "fresh/runtime";
import { CheckCircle2, DollarSign, RefreshCw } from "lucide-preact";
import { STORE_NAME } from "../../lib/utils.ts";

export const handler = define.handlers({
  GET(ctx) {
    ctx.state.title = `Trade-In Your Mac - ${STORE_NAME}`;
    ctx.state.description =
      "Trade in your old Mac for credit towards a newer model at {STORE_NAME} in Westlands, Nairobi.";
    return page();
  },
});

export default define.page(function TradeInPage(props) {
  return (
    <div class="max-w-7xl mx-auto px-4 py-12">
      <Head>
        <title>{props.state.title as string}</title>
        <meta name="description" content={props.state.description as string} />
      </Head>
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold mb-6 text-gray-900">
          Trade In Your Old Mac
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Upgrade to a newer, faster refurbished Mac by trading in your current
          device. We offer competitive valuations for your old Apple products in
          Nairobi.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div class="text-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <div class="w-16 h-16 mx-auto bg-slate-200 text-slate-800 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">
            1. Get an Estimate
          </h3>
          <p class="text-gray-600 leading-relaxed">
            Bring your device to our Westlands store or contact us with your
            Mac's serial number and condition for an initial quote.
          </p>
        </div>

        <div class="text-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <div class="w-16 h-16 mx-auto bg-slate-200 text-slate-800 rounded-full flex items-center justify-center mb-6">
            <RefreshCw class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">2. We Inspect It</h3>
          <p class="text-gray-600 leading-relaxed">
            Our technicians will thoroughly test your device to confirm its
            condition and finalize the trade-in value.
          </p>
        </div>

        <div class="text-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <div class="w-16 h-16 mx-auto bg-slate-200 text-slate-800 rounded-full flex items-center justify-center mb-6">
            <DollarSign class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">3. Get Credit</h3>
          <p class="text-gray-600 leading-relaxed">
            Apply the value of your old Mac directly towards the purchase of a
            newer refurbished model from our store.
          </p>
        </div>
      </div>

      <div class="bg-slate-200 p-10 rounded-2xl border border-slate-300">
        <h2 class="text-3xl font-bold mb-6 text-slate-900 text-center">
          What We Accept
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <ul class="space-y-3 text-slate-800">
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-5 h-5 text-slate-900" />{" "}
              MacBook Pro (2015 and newer)
            </li>
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-5 h-5 text-slate-900" />{" "}
              MacBook Air (2015 and newer)
            </li>
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-5 h-5 text-slate-900" />{" "}
              iMac (2015 and newer)
            </li>
          </ul>
          <ul class="space-y-3 text-slate-800">
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-5 h-5 text-slate-900" />{" "}
              Mac mini (2014 and newer)
            </li>
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-5 h-5 text-slate-900" />{" "}
              iPads (Select models)
            </li>
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-5 h-5 text-slate-900" />{" "}
              iPhones (Select models)
            </li>
          </ul>
        </div>

        <div class="mt-10 text-center">
          <a
            href="/about/contact"
            class="inline-block bg-slate-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
          >
            Start Your Trade-In
          </a>
        </div>
      </div>
    </div>
  );
});
