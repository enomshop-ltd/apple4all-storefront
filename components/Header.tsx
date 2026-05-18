import { ShoppingCart, User } from "lucide-preact";

import { getCategories } from "../lib/data.ts";

export async function Header() {
  const categories = await getCategories();
  const maxCategories = categories.slice(0, 4); // Limit to 4 dynamic + "Store" = 5 items.

  return (
    <header class="w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex-shrink-0 flex items-center gap-2">
            <a
              href="/"
              f-client-nav
              class="flex items-center gap-2 font-bold text-2xl tracking-tighter"
            >
              <img src="/logo.svg" alt="Apple4All Logo" class="h-8 w-auto" />
              Apple4All
            </a>
          </div>
          <nav class="hidden md:flex space-x-8">
            <a
              href="/"
              f-client-nav
              class="text-gray-900 font-medium hover:text-blue-600"
            >
              Store
            </a>
            {maxCategories.map((category: any) => (
              <a
                href={`/shop/${category.handle}`}
                f-client-nav
                class="text-gray-900 font-medium hover:text-blue-600 capitalize"
              >
                {category.name}
              </a>
            ))}
          </nav>
          <div class="flex items-center space-x-4">
            <a
              href="/account"
              f-client-nav
              class="text-gray-600 hover:text-gray-900"
            >
              <User class="w-5 h-5" />
            </a>
            <a
              href="/cart"
              f-client-nav
              class="text-gray-600 hover:text-gray-900"
            >
              <ShoppingCart class="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
