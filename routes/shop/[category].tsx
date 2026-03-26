import { page } from "fresh";
import { Head } from "fresh/runtime";
import { define } from "../../utils.ts";
import Shop from "../../islands/Shop.tsx";

export const handler = define.handlers({
  GET(ctx) {
    const category = ctx.params.category;
    const title = category.charAt(0).toUpperCase() + category.slice(1);
    ctx.state.title = `${title} - Apple4All`;
    ctx.state.description = `Shop all our refurbished ${title} products.`;
    return page();
  },
});

export default define.page(function CategoryPage(props) {
  const category = props.params.category;
  const title = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <main class="flex-1">
      <Head>
        <title>{title} - Apple4All</title>
        <meta
          name="description"
          content={`Shop all our refurbished ${title} products.`}
        />
        <meta property="og:title" content={`${title} - Apple4All`} />
        <meta
          property="og:description"
          content={`Shop all our refurbished ${title} products.`}
        />
      </Head>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
        <p class="text-lg text-gray-600">
          Browse our selection of certified refurbished {title}s.
        </p>
      </div>
      <Shop category={category} />
    </main>
  );
});
