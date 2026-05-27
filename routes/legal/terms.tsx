import { define } from "../../utils.ts";
import { page } from "fresh";
import { Head } from "fresh/runtime";
import { STORE_NAME } from "../../utils.ts";

export const handler = define.handlers({
  GET(ctx) {
    ctx.state.title = `Terms of Service - ${STORE_NAME}`;
    ctx.state.description =
      "Read our Terms of Service to understand the rules and guidelines for using {STORE_NAME}.";
    return page();
  },
});

export default define.page(function TermsPage(props) {
  return (
    <div class="prose prose-blue max-w-none">
      <Head>
        <title>{props.state.title as string}</title>
        <meta name="description" content={props.state.description as string} />
      </Head>
      <h1 class="text-3xl font-bold mb-6">Terms of Service</h1>
      <p class="text-gray-600 mb-4">Last updated: March 25, 2026</p>

      <h2 class="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
      <p class="text-gray-700 mb-4">
        Welcome to {STORE_NAME}. By accessing our website and purchasing our
        products or services, you agree to be bound by these Terms of Service.
        {STORE_NAME} is a tech shop located in Westlands, Nairobi, Kenya,
        specializing in Mac sales, repairs, and replacement parts.
      </p>

      <h2 class="text-xl font-semibold mt-8 mb-4">2. Products and Services</h2>
      <p class="text-gray-700 mb-4">
        We offer both new and certified refurbished Apple devices. All
        refurbished devices undergo rigorous testing to ensure quality. We also
        provide repair services and sell replacement parts. Prices and
        availability are subject to change without notice.
      </p>

      <h2 class="text-xl font-semibold mt-8 mb-4">3. Warranty and Returns</h2>
      <ul class="text-gray-700 mb-4 list-disc pl-5 space-y-2">
        <li><strong>Warranty Period:</strong> All repairs, refurbished items, used items, and accessories only come with a 90-day warranty covering hardware defects. Physical damage, liquid damage, and unauthorized modifications void this warranty.</li>
        <li><strong>Refunds:</strong> Refunds are only made in the form of store credit, and only if all other means have been exhausted (i.e., the item cannot be exchanged or repaired).</li>
        <li><strong>Screens:</strong> Screens once sold cannot be returned. Any defects must be reported within 48 hours of purchase or installation.</li>
      </ul>

      <h2 class="text-xl font-semibold mt-8 mb-4">4. Repairs, Services & Payments</h2>
      <ul class="text-gray-700 mb-4 list-disc pl-5 space-y-2">
        <li><strong>Data Loss Liability & Waivers:</strong> When you submit a device for repair, you authorize us to perform necessary diagnostics. The customer is 100% responsible for backing up their data before service, and {STORE_NAME} is entirely free from liability if data is lost, corrupted, or wiped during the repair or diagnostic process.</li>
        <li><strong>Abandoned Device Policy:</strong> Devices left for more than 45 days after the customer has been notified of completion (or a finalized quote) will be considered abandoned. {STORE_NAME} reserves the right to sell or recycle abandoned devices to recover service costs.</li>
        <li><strong>Unpredictable/Incidental Damage:</strong> Servicing heavily damaged devices (such as shattered screens or bent enclosures) carries inherent risks. The customer acknowledges that attempting repairs may result in unavoidable incidental damage (e.g., existing cracks spreading). {STORE_NAME} is not liable for such damage occurring during standard teardown or repair procedures.</li>
        <li><strong>Custom Parts & Deposits:</strong> For repairs requiring specially ordered parts, a non-refundable deposit may be required. If the customer cancels the repair after the custom part has been ordered, the deposit will not be refunded. Devices will not be released until the full payment balance clears.</li>
        <li><strong>Job Cards & Receipts:</strong> Any work done or any item sold without an official job card or a receipt will not be acknowledged.</li>
        <li><strong>Payments:</strong> Any money paid elsewhere other than directly to the company accounts or its official branches/affiliates will not be recognized.</li>
      </ul>

      <h2 class="text-xl font-semibold mt-8 mb-4">
        5. Limitation of Liability
      </h2>
      <p class="text-gray-700 mb-4">
        {STORE_NAME} shall not be liable for any indirect, incidental, special,
        consequential, or punitive damages resulting from your use of our
        services or products.
      </p>

      <h2 class="text-xl font-semibold mt-8 mb-4">6. Contact Information</h2>
      <p class="text-gray-700 mb-4">
        If you have any questions about these Terms, please contact us at
        support@apple4all.co.ke or visit our store in Westlands, Nairobi.
      </p>
    </div>
  );
});
