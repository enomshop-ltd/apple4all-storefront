import { define } from "../../utils.ts";
import { page } from "fresh";
import { Head } from "fresh/runtime";
import { STORE_NAME } from "../../utils.ts";

export const handler = define.handlers({
  GET(ctx) {
    ctx.state.title = `Our Story - ${STORE_NAME}`;
    ctx.state.description =
      "Learn about {STORE_NAME}, a premier tech shop in Westlands, Nairobi specializing in Mac sales and services.";
    return page();
  },
});

export default define.page(function OurStoryPage(props) {
  return (
    <div class="prose prose-blue max-w-none">
      <Head>
        <title>{props.state.title as string}</title>
        <meta name="description" content={props.state.description as string} />
      </Head>
      <h1 class="text-4xl font-bold mb-6 text-gray-900">Our Story</h1>

      <img
        src="https://picsum.photos/seed/nairobi-tech/800/400"
        alt={`${STORE_NAME} Storefront in Westlands`}
        class="w-full h-64 object-cover rounded-xl mb-8"
      />

      <p class="text-lg text-gray-700 mb-6 leading-relaxed">
        Located in the heart of Westlands, Nairobi, Apple4All began with a
        simple mission: to make premium Apple technology accessible and
        sustainable for everyone in Kenya. We recognized a growing need for
        reliable, high-quality Mac products and expert repair services that
        didn't break the bank.
      </p>

      <h2 class="text-2xl font-semibold mt-10 mb-4 text-gray-900">
        More Than Just a Store
      </h2>
      <p class="text-gray-700 mb-6 leading-relaxed">
        We are a dedicated team of Apple enthusiasts and certified technicians.
        Whether you're a student looking for your first MacBook, a creative
        professional needing a powerful iMac, or a business outfitting your
        entire team, we provide tailored solutions. We don't just sell devices;
        we offer peace of mind through our rigorous refurbishment process and
        comprehensive warranties.
      </p>

      <h2 class="text-2xl font-semibold mt-10 mb-4 text-gray-900">
        Expertise You Can Trust
      </h2>
      <p class="text-gray-700 mb-6 leading-relaxed">
        Beyond sales, our service center is equipped to handle everything from
        routine battery replacements to complex logic board repairs. We stock
        genuine and high-quality replacement parts to ensure your Mac runs like
        new. Our commitment to transparency means you'll always know what you're
        paying for and why.
      </p>

      <h2 class="text-2xl font-semibold mt-10 mb-4 text-gray-900">
        Our Commitment to Sustainability
      </h2>
      <p class="text-gray-700 mb-6 leading-relaxed">
        By choosing refurbished tech and opting to repair rather than replace,
        you're joining us in reducing e-waste. We believe in extending the
        lifecycle of these incredible machines, contributing to a greener future
        for Kenya and the planet.
      </p>

      <div class="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-100">
        <h3 class="text-xl font-semibold text-blue-900 mb-2">Visit Us Today</h3>
        <p class="text-blue-800">
          Drop by our store in Westlands to explore our inventory, chat with our
          technicians, or just talk tech. We're here for all your Apple needs.
        </p>
      </div>
    </div>
  );
});
