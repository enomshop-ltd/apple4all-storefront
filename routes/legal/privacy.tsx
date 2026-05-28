import { define } from "../../lib/utils.ts";
import { page } from "fresh";
import { Head } from "fresh/runtime";
import { STORE_NAME, STORE_DOMAIN } from "../../lib/utils.ts";

export const handler = define.handlers({
  GET(ctx) {
    ctx.state.title = `Privacy Policy - ${STORE_NAME}`;
    ctx.state.description =
      `Learn how ${STORE_NAME} collects, uses, and protects your personal information.`;
    return page();
  },
});

export default define.page(function PrivacyPage(props) {
  return (
    <div class="prose prose-blue max-w-none">
      <Head>
        <title>{props.state.title as string}</title>
        <meta name="description" content={props.state.description as string} />
      </Head>
      <h1 class="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p class="text-gray-600 mb-4">Last updated: March 25, 2026</p>

      <h2 class="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
      <p class="text-gray-700 mb-4">
        {STORE_NAME} ("we", "our", or "us") respects your privacy and is committed
        to protecting your personal data. This Privacy Policy outlines how we
        collect, use, and safeguard your information when you visit our website
        or use our services in Westlands, Nairobi.
      </p>

      <h2 class="text-xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
      <p class="text-gray-700 mb-4">
        We may collect personal information such as your name, email address,
        phone number, shipping and billing addresses, and payment details when
        you make a purchase, create an account, or contact us for support or
        repairs.
      </p>

      <h2 class="text-xl font-semibold mt-8 mb-4">
        3. How We Use Your Information
      </h2>
      <p class="text-gray-700 mb-4">
        We use your information to process transactions, provide customer
        support, manage your account, communicate with you about your orders,
        and improve our products and services. With your consent, we may also
        send you promotional emails about new products or special offers.
      </p>

      <h2 class="text-xl font-semibold mt-8 mb-4">4. Data Security</h2>
      <p class="text-gray-700 mb-4">
        We implement appropriate technical and organizational security measures
        to protect your personal data against unauthorized access, alteration,
        disclosure, or destruction. However, no method of transmission over the
        internet or electronic storage is 100% secure.
      </p>

      <h2 class="text-xl font-semibold mt-8 mb-4">
        5. Sharing Your Information
      </h2>
      <p class="text-gray-700 mb-4">
        We do not sell, trade, or rent your personal identification information
        to others. We may share generic aggregated demographic information not
        linked to any personal identification information with our business
        partners and trusted affiliates.
      </p>

      <h2 class="text-xl font-semibold mt-8 mb-4">6. Your Rights</h2>
      <p class="text-gray-700 mb-4">
        You have the right to access, update, or delete your personal
        information. If you wish to exercise these rights, please contact us.
      </p>

      <h2 class="text-xl font-semibold mt-8 mb-4">7. Contact Us</h2>
      <p class="text-gray-700 mb-4">
        If you have any questions about this Privacy Policy, please contact us
        at privacy@{STORE_DOMAIN}.
      </p>
    </div>
  );
});
