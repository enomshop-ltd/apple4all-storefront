import { define } from "../../lib/utils.ts";
import { page } from "fresh";
import { Head } from "fresh/runtime";
import { Clock, Mail, MapPin, Phone } from "lucide-preact";
import { STORE_NAME } from "../../lib/utils.ts";

export const handler = define.handlers({
  GET(ctx) {
    ctx.state.title = `Contact Us - ${STORE_NAME}`;
    ctx.state.description =
      "Get in touch with {STORE_NAME} in Westlands, Nairobi for Mac sales, repairs, and support.";
    return page();
  },
});

export default define.page(function ContactPage(props) {
  return (
    <div class="max-w-4xl mx-auto">
      <Head>
        <title>{props.state.title as string}</title>
        <meta name="description" content={props.state.description as string} />
      </Head>
      <h1 class="text-4xl font-bold mb-6 text-gray-900 text-center">
        Contact Us
      </h1>
      <p class="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto">
        Have a question about a refurbished Mac, need a repair quote, or looking
        for a specific replacement part? Our team in Westlands is ready to help.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div class="space-y-8">
          <div class="flex items-start gap-4">
            <div class="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <MapPin class="w-6 h-6" />
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-1">
                Visit Our Store
              </h3>
              <p class="text-gray-600 leading-relaxed">
                {STORE_NAME} Tech Shop<br />
                Westlands Commercial Center<br />
                Ring Road Parklands<br />
                Nairobi, Kenya
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Phone class="w-6 h-6" />
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-1">Call Us</h3>
              <p class="text-gray-600">
                Sales & Support:{" "}
                <a
                  href="tel:+254700000000"
                  class="text-blue-600 hover:underline"
                >
                  +254 700 000 000
                </a>
                <br />
                Repairs:{" "}
                <a
                  href="tel:+254711111111"
                  class="text-blue-600 hover:underline"
                >
                  +254 711 111 111
                </a>
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Mail class="w-6 h-6" />
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-1">Email Us</h3>
              <p class="text-gray-600">
                General Inquiries:{" "}
                <a
                  href="mailto:info@apple4all.co.ke"
                  class="text-blue-600 hover:underline"
                >
                  info@apple4all.co.ke
                </a>
                <br />
                Support:{" "}
                <a
                  href="mailto:support@apple4all.co.ke"
                  class="text-blue-600 hover:underline"
                >
                  support@apple4all.co.ke
                </a>
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Clock class="w-6 h-6" />
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-1">
                Business Hours
              </h3>
              <p class="text-gray-600">
                Monday - Friday: 9:00 AM - 6:00 PM<br />
                Saturday: 10:00 AM - 4:00 PM<br />
                Sunday & Public Holidays: Closed
              </p>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 p-8 rounded-2xl border border-gray-100">
          <h3 class="text-2xl font-semibold text-gray-900 mb-6">
            Send us a Message
          </h3>
          <form class="space-y-4">
            <div>
              <label
                for="name"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="john@example.com"
                required
              />
            </div>
            <div>
              <label
                for="subject"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
              >
                <option>Sales Inquiry</option>
                <option>Repair Quote</option>
                <option>Trade-In Evaluation</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label
                for="message"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                placeholder="How can we help you?"
                required
              >
              </textarea>
            </div>
            <button
              type="button"
              class="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
});
