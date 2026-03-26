import { ShoppingCart, User } from "lucide-preact";

export function Header() {
  return (
    <header class="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
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
            <a
              href="/devices"
              f-client-nav
              class="text-gray-900 font-medium hover:text-blue-600"
            >
              Devices
            </a>
            <a
              href="/accessories"
              f-client-nav
              class="text-gray-900 font-medium hover:text-blue-600"
            >
              Accessories
            </a>
            <a
              href="/cables"
              f-client-nav
              class="text-gray-900 font-medium hover:text-blue-600"
            >
              Cables
            </a>
            <a
              href="/track-service"
              f-client-nav
              class="text-gray-900 font-medium hover:text-blue-600"
            >
              Track Service Status
            </a>
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
