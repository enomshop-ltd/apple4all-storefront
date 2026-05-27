import { define } from "../../utils.ts";
import { page } from "fresh";
import { Head } from "fresh/runtime";
import { Battery, Cpu, MonitorSmartphone, Wrench, Search, ShieldCheck, BookOpen } from "lucide-preact";
import TrackRepairIsland from "../repairs/(_islands)/TrackRepairIsland.tsx";
import { STORE_NAME } from "../../utils.ts";

export const handler = define.handlers({
  GET(ctx) {
    ctx.state.title = `Mac Repairs & Services - ${STORE_NAME}`;
    ctx.state.description =
      "Expert Mac repair services in Westlands, Nairobi. From screen replacements to logic board repairs. Track your ongoing repair live.";
    return page({ 
      backendUrl: Deno.env.get("MEDUSA_BACKEND_URL")!,
      publishableKey: Deno.env.get("MEDUSA_PUBLISHABLE_KEY") || "" 
    });
  },
});

export default define.page(function RepairsPage({ state, data }) {
  const { backendUrl, publishableKey } = data;

  return (
    <div class="max-w-6xl mx-auto px-4 py-8">
      <Head>
        <title>{state.title as string}</title>
        <meta name="description" content={state.description as string} />
      </Head>

      <div class="text-center mb-16 space-y-6">
        <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
          Expert Mac Repairs.
        </h1>
        <p class="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto font-light">
          Fast, reliable, and affordable repair services for all Mac models in Nairobi.
          Track your repair live in our portal.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-start">
        {/* Left Column: Track Repair (Interactive) */}
        <div class="lg:col-span-7 bg-white rounded-3xl border border-gray-100 shadow-sm p-2 md:p-8 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div class="absolute top-0 right-0 p-8 opacity-5">
            <Search class="w-48 h-48" />
          </div>
          <div class="relative z-10 flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900 px-4 pt-4 md:px-0 md:pt-0">Track or Book</h2>
            <a href="/repairs/book" class="mr-4 md:mr-0 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium text-sm">
              Book a Repair
            </a>
          </div>
          <div class="relative z-10">
            <TrackRepairIsland backendUrl={backendUrl} publishableApiKey={publishableKey} />
          </div>
        </div>

        {/* Right Column: Services list */}
        <div class="lg:col-span-5 flex flex-col gap-6">
          <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:bg-gray-100 transition-colors">
            <div class="flex items-center gap-4 mb-3">
              <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <MonitorSmartphone class="w-5 h-5" />
              </div>
              <h3 class="text-xl font-bold text-gray-900">Screen Replacement</h3>
            </div>
            <p class="text-gray-600 text-sm leading-relaxed mb-3">Premium screen replacements for MacBooks, iMacs, and iPads restoring visual clarity.</p>
            <p class="text-sm font-semibold text-blue-600">From KES 15,000</p>
          </div>

          <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:bg-gray-100 transition-colors">
            <div class="flex items-center gap-4 mb-3">
              <div class="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <Battery class="w-5 h-5" />
              </div>
              <h3 class="text-xl font-bold text-gray-900">Battery Replacement</h3>
            </div>
            <p class="text-gray-600 text-sm leading-relaxed mb-3">High-capacity alternatives to keep you powered up all day.</p>
            <p class="text-sm font-semibold text-green-600">From KES 8,000</p>
          </div>

          <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:bg-gray-100 transition-colors">
            <div class="flex items-center gap-4 mb-3">
              <div class="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <Cpu class="w-5 h-5" />
              </div>
              <h3 class="text-xl font-bold text-gray-900">Logic Board Repair</h3>
            </div>
            <p class="text-gray-600 text-sm leading-relaxed mb-3">Advanced micro-soldering to diagnose and repair complex failures.</p>
            <p class="text-sm font-semibold text-purple-600">Quote upon diagnosis</p>
          </div>

          <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:bg-gray-100 transition-colors">
            <div class="flex items-center gap-4 mb-3">
              <div class="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                <Wrench class="w-5 h-5" />
              </div>
              <h3 class="text-xl font-bold text-gray-900">Upgrades & Maintenance</h3>
            </div>
            <p class="text-gray-600 text-sm leading-relaxed mb-3">SSD upgrades, RAM expansions, and deep cleaning for optimal cooling.</p>
            <p class="text-sm font-semibold text-orange-600">From KES 5,000</p>
          </div>

          <div class="bg-blue-50 rounded-2xl p-6 border border-blue-100 hover:bg-blue-100 transition-colors">
            <a href="/services/guides" f-client-nav class="block">
              <div class="flex items-center gap-4 mb-3">
                <div class="w-10 h-10 bg-blue-200 text-blue-700 rounded-lg flex items-center justify-center">
                  <BookOpen class="w-5 h-5" />
                </div>
                <h3 class="text-xl font-bold text-gray-900">DIY Repair Guides</h3>
              </div>
              <p class="text-gray-600 text-sm leading-relaxed mb-3">Feeling adventurous? Access free, open-source repair guides powered by iFixit for your Apple devices.</p>
              <p class="text-sm font-semibold text-blue-600 flex items-center gap-1">Browse Guides &rarr;</p>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div class="bg-black text-white p-10 md:p-14 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div class="max-w-xl">
          <div class="flex items-center gap-2 mb-4 text-blue-400">
            <ShieldCheck class="w-6 h-6" />
            <span class="font-semibold uppercase tracking-wider text-sm">Certified Repair Center</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Quality Service Guaranteed</h2>
          <p class="text-gray-400 text-lg">
            Bring your device to our Westlands store for a free initial diagnostic, or contact us to get an estimated quote. We handle every device with the utmost care.
          </p>
        </div>
        <div class="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <a
            href="tel:+254700000000"
            class="bg-white text-black px-8 py-4 rounded-xl font-bold text-center hover:bg-gray-200 transition-colors flex-1"
          >
            Call Now
          </a>
          <a
            href="/about/contact"
            f-client-nav
            class="bg-gray-800 text-white px-8 py-4 rounded-xl font-bold text-center hover:bg-gray-700 transition-colors border border-gray-700 flex-1"
          >
            Find Our Store
          </a>
        </div>
      </div>
    </div>
  );
});

