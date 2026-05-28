import { ShoppingCart, User } from "lucide-preact";
import { STORE_NAME, LOGO_URL } from "../lib/utils.ts";

export function Header({ 
  categories = [],
  isLoggedIn = false
}: { 
  categories?: any[];
  isLoggedIn?: boolean;
}) {
  const maxCategories = categories.slice(0, 4); // Limit to 4 dynamic + "Store" = 5 items.

  return (
    <header class="w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex-shrink-0 flex items-center h-full">
            <a
              href="/"
              f-client-nav
              class="flex items-center h-full"
            >
              <img src={LOGO_URL} alt={`${STORE_NAME} Logo`} class="h-16 w-auto object-contain" />
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
            <div class="relative group">
              <a
                href="/account"
                f-client-nav
                class="text-gray-600 hover:text-gray-900 flex items-center h-full py-2"
              >
                <User class={`w-5 h-5 ${isLoggedIn ? "text-blue-600" : ""}`} />
              </a>
              {isLoggedIn && (
                <div class="absolute right-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-sm">
                  <div class="bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden flex flex-col py-1.5 w-48">
                    <a href="/account" f-client-nav class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600">Dashboard</a>
                    <a href="/account/orders" f-client-nav class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600">My Orders</a>
                    <a href="/repairs" f-client-nav class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600">My Repairs</a>
                    <a href="/repairs/book" f-client-nav class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600">Book a Repair</a>
                    <div class="h-px bg-gray-100 my-1"></div>
                    <a href="/api/auth/logout" f-client-nav="false" class="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">Log out</a>
                  </div>
                </div>
              )}
            </div>
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
