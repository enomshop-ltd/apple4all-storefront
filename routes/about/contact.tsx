import { define } from "../../lib/utils.ts";
import { page } from "fresh";
import { Head } from "fresh/runtime";
import { Clock, Mail, MapPin, Phone } from "lucide-preact";
import { STORE_NAME, STORE_DOMAIN } from "../../lib/utils.ts";
import ContactForm from "../../islands/ContactForm.tsx";

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
    <div class="w-full">
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
            <div class="p-3 bg-slate-200 text-slate-800 rounded-lg">
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
            <div class="p-3 bg-slate-200 text-slate-800 rounded-lg">
              <Phone class="w-6 h-6" />
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-1">Call Us</h3>
              <p class="text-gray-600">
                Sales & Support:{" "}
                <a
                  href="tel:+254115682959"
                  class="text-slate-900 hover:underline"
                >
                  +254 11 568 2959
                </a>
                <br />
                Repairs:{" "}
                <a
                  href="tel:+254115682959"
                  class="text-slate-900 hover:underline"
                >
                  +254 11 568 2959
                </a>
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="p-3 bg-slate-200 text-slate-800 rounded-lg">
              <Mail class="w-6 h-6" />
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-1">Email Us</h3>
              <p class="text-gray-600">
                General Inquiries:{" "}
                <a
                  href={`mailto:info@${STORE_DOMAIN}`}
                  class="text-slate-900 hover:underline"
                >
                  info@{STORE_DOMAIN}
                </a>
                <br />
                Support:{" "}
                <a
                  href={`mailto:support@${STORE_DOMAIN}`}
                  class="text-slate-900 hover:underline"
                >
                  support@{STORE_DOMAIN}
                </a>
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="p-3 bg-slate-200 text-slate-800 rounded-lg">
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

        <div class="p-8">
          <h3 class="text-2xl font-semibold text-gray-900 mb-6">
            Send us a Message
          </h3>
          <ContactForm storeDomain={STORE_DOMAIN} />
        </div>
      </div>
    </div>
  );
});
