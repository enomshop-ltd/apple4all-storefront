import { define } from "../../utils.ts";
import { page } from "fresh";
import { Head } from "fresh/runtime";

export const handler = define.handlers({
  GET(ctx) {
    ctx.state.title = "Careers - Apple4All";
    ctx.state.description =
      "Join the Apple4All team in Westlands, Nairobi. We are always looking for passionate tech enthusiasts.";
    return page();
  },
});

export default define.page(function CareersPage(props) {
  return (
    <div class="prose prose-blue max-w-none">
      <Head>
        <title>{props.state.title as string}</title>
        <meta name="description" content={props.state.description as string} />
      </Head>
      <h1 class="text-4xl font-bold mb-6 text-gray-900">
        Careers at Apple4All
      </h1>

      <p class="text-lg text-gray-700 mb-8 leading-relaxed">
        We're a fast-growing tech shop in Westlands, Nairobi, dedicated to
        providing top-tier Apple products and repair services. We're always on
        the lookout for talented, passionate individuals to join our team. If
        you love technology and helping people, you might be a perfect fit.
      </p>

      <h2 class="text-2xl font-semibold mt-10 mb-6 text-gray-900">
        Open Positions
      </h2>

      <div class="space-y-6">
        <div class="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-white">
          <h3 class="text-xl font-bold text-blue-600 mb-2">
            Senior Mac Technician
          </h3>
          <p class="text-gray-600 mb-4 text-sm">
            Full-time • Westlands, Nairobi
          </p>
          <p class="text-gray-700 mb-4">
            We are seeking an experienced technician capable of performing
            complex logic board repairs, screen replacements, and deep
            diagnostics on MacBooks and iMacs.
          </p>
          <a
            href="mailto:careers@apple4all.co.ke?subject=Application:%20Senior%20Mac%20Technician"
            class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Apply Now
          </a>
        </div>

        <div class="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-white">
          <h3 class="text-xl font-bold text-blue-600 mb-2">
            Sales & Customer Success Associate
          </h3>
          <p class="text-gray-600 mb-4 text-sm">
            Full-time • Westlands, Nairobi
          </p>
          <p class="text-gray-700 mb-4">
            Join our front-of-house team to help customers find the perfect
            refurbished Mac, explain our repair services, and ensure every
            visitor leaves satisfied.
          </p>
          <a
            href="mailto:careers@apple4all.co.ke?subject=Application:%20Sales%20Associate"
            class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Apply Now
          </a>
        </div>
      </div>

      <h2 class="text-2xl font-semibold mt-12 mb-4 text-gray-900">
        Why Work With Us?
      </h2>
      <ul class="list-disc pl-6 text-gray-700 space-y-2">
        <li>Competitive salary and performance bonuses.</li>
        <li>
          Continuous training on the latest Apple hardware and repair
          techniques.
        </li>
        <li>
          A collaborative, tech-forward environment in the heart of Westlands.
        </li>
        <li>Employee discounts on devices and repairs.</li>
      </ul>

      <p class="text-gray-700 mt-8">
        Don't see a position that fits? We're always open to meeting great
        people. Send your CV and a brief introduction to{" "}
        <a
          href="mailto:careers@apple4all.co.ke"
          class="text-blue-600 hover:underline"
        >
          careers@apple4all.co.ke
        </a>.
      </p>
    </div>
  );
});
