import { define } from "../../utils.ts";
import { page } from "fresh";
import { Head } from "fresh/runtime";
import { Battery, Cpu, MonitorSmartphone, Wrench } from "lucide-preact";

export const handler = define.handlers({
  GET(ctx) {
    ctx.state.title = "Mac Repairs & Services - Apple4All";
    ctx.state.description =
      "Expert Mac repair services in Westlands, Nairobi. From screen replacements to logic board repairs.";
    return page();
  },
});

export default define.page(function RepairsPage(props) {
  return (
    <div class="max-w-4xl mx-auto">
      <Head>
        <title>{props.state.title as string}</title>
        <meta name="description" content={props.state.description as string} />
      </Head>
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold mb-6 text-gray-900">
          Expert Mac Repairs in Nairobi
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          At Apple4All in Westlands, our certified technicians provide fast,
          reliable, and affordable repair services for all Mac models. We use
          high-quality replacement parts to bring your device back to life.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div class="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
            <MonitorSmartphone class="w-6 h-6" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">
            Screen Replacement
          </h3>
          <p class="text-gray-600 leading-relaxed mb-4">
            Cracked or malfunctioning display? We offer premium screen
            replacements for MacBooks, iMacs, and iPads, restoring your device's
            visual clarity.
          </p>
          <p class="text-sm font-medium text-blue-600">From KES 15,000</p>
        </div>

        <div class="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
            <Battery class="w-6 h-6" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">
            Battery Replacement
          </h3>
          <p class="text-gray-600 leading-relaxed mb-4">
            Is your Mac not holding a charge? We replace old, swollen, or
            degraded batteries with high-capacity alternatives to keep you
            powered up.
          </p>
          <p class="text-sm font-medium text-blue-600">From KES 8,000</p>
        </div>

        <div class="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
            <Cpu class="w-6 h-6" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">
            Logic Board Repair
          </h3>
          <p class="text-gray-600 leading-relaxed mb-4">
            Liquid damage or power issues? Our advanced micro-soldering
            technicians can diagnose and repair complex logic board failures,
            saving you from a costly replacement.
          </p>
          <p class="text-sm font-medium text-blue-600">Quote upon diagnosis</p>
        </div>

        <div class="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
            <Wrench class="w-6 h-6" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">
            Upgrades & Maintenance
          </h3>
          <p class="text-gray-600 leading-relaxed mb-4">
            Speed up your older Mac with SSD upgrades, RAM expansions, macOS
            installations, and deep cleaning services to prevent overheating.
          </p>
          <p class="text-sm font-medium text-blue-600">From KES 5,000</p>
        </div>
      </div>

      <div class="bg-blue-600 text-white p-10 rounded-2xl text-center">
        <h2 class="text-3xl font-bold mb-4">Need a Repair?</h2>
        <p class="text-blue-100 mb-8 max-w-xl mx-auto text-lg">
          Bring your device to our Westlands store for a free initial
          diagnostic, or contact us to get an estimated quote.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/about/contact"
            class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Contact Us
          </a>
          <a
            href="tel:+254700000000"
            class="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors border border-blue-500"
          >
            Call Now
          </a>
        </div>
      </div>
    </div>
  );
});
