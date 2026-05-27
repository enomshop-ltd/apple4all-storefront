import { define } from "../../lib/utils.ts";
import { page } from "fresh";
import { Head } from "fresh/runtime";
import { STORE_NAME } from "../../lib/utils.ts";

export const handler = define.handlers({
  GET(ctx) {
    ctx.state.title = `Cookie Policy - ${STORE_NAME}`;
    ctx.state.description =
      "Learn how Apple4All uses cookies to improve your browsing experience.";
    return page();
  },
});

export default define.page(function CookiesPage(props) {
  return (
    <div class="prose prose-blue max-w-none">
      <Head>
        <title>{props.state.title as string}</title>
        <meta name="description" content={props.state.description as string} />
      </Head>
      <h1 class="text-3xl font-bold mb-6">Cookie Policy</h1>
      <p class="text-gray-600 mb-4">Last updated: March 25, 2026</p>

      <h2 class="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
      <p class="text-gray-700 mb-4">
        {STORE_NAME} ("we", "our", or "us") uses cookies and similar tracking
        technologies on our website. This Cookie Policy explains what cookies
        are, how we use them, and your choices regarding their use.
      </p>

      <h2 class="text-xl font-semibold mt-8 mb-4">2. What Are Cookies?</h2>
      <p class="text-gray-700 mb-4">
        Cookies are small text files placed on your device (computer,
        smartphone, or tablet) when you visit a website. They are widely used to
        make websites work more efficiently, as well as to provide information
        to the owners of the site.
      </p>

      <h2 class="text-xl font-semibold mt-8 mb-4">3. How We Use Cookies</h2>
      <p class="text-gray-700 mb-4">
        We use cookies for several purposes:
      </p>
      <ul class="list-disc pl-6 text-gray-700 mb-4 space-y-2">
        <li>
          <strong>Essential Cookies:</strong>{" "}
          These are necessary for the website to function properly. They enable
          core functionalities such as security, network management, and
          accessibility. You may disable these by changing your browser
          settings, but this may affect how the website functions.
        </li>
        <li>
          <strong>Performance and Analytics Cookies:</strong>{" "}
          These cookies collect information about how visitors use our website,
          for instance, which pages visitors go to most often. We use this
          information to improve how our website works.
        </li>
        <li>
          <strong>Functionality Cookies:</strong>{" "}
          These cookies allow our website to remember choices you make (such as
          your user name, language, or the region you are in) and provide
          enhanced, more personal features.
        </li>
        <li>
          <strong>Targeting or Advertising Cookies:</strong>{" "}
          These cookies are used to deliver advertisements more relevant to you
          and your interests. They are also used to limit the number of times
          you see an advertisement as well as help measure the effectiveness of
          the advertising campaign.
        </li>
      </ul>

      <h2 class="text-xl font-semibold mt-8 mb-4">4. Managing Cookies</h2>
      <p class="text-gray-700 mb-4">
        Most web browsers allow some control of most cookies through the browser
        settings. To find out more about cookies, including how to see what
        cookies have been set and how to manage and delete them, visit{" "}
        <a
          href="https://www.allaboutcookies.org/"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-600 hover:underline"
        >
          www.allaboutcookies.org
        </a>.
      </p>

      <h2 class="text-xl font-semibold mt-8 mb-4">5. Changes to This Policy</h2>
      <p class="text-gray-700 mb-4">
        We may update this Cookie Policy from time to time to reflect changes in
        our practices or for other operational, legal, or regulatory reasons.
        Please revisit this page regularly to stay informed about our use of
        cookies.
      </p>

      <h2 class="text-xl font-semibold mt-8 mb-4">6. Contact Us</h2>
      <p class="text-gray-700 mb-4">
        If you have any questions about our use of cookies, please contact us at
        privacy@apple4all.co.ke.
      </p>
    </div>
  );
});
