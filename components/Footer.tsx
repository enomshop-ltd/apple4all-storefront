import { STORE_NAME } from "../lib/utils.ts";
export function Footer() {
  return (
    <footer class="bg-white border-t border-gray-200 pt-16 pb-8">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div>
            <h3 class="font-semibold mb-4">Shop</h3>
            <ul class="space-y-2 text-sm text-gray-600">
              <li>
                <a href="/shop/iphone" f-client-nav>
                  iPhone
                </a>
              </li>
              <li>
                <a href="/shop/mac" f-client-nav>
                  Mac
                </a>
              </li>
              <li>
                <a href="/shop/ipad" f-client-nav>
                  iPad
                </a>
              </li>
              <li>
                <a href="/shop/watch" f-client-nav>
                  Watch
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold mb-4">Services</h3>
            <ul class="space-y-2 text-sm text-gray-600">
              <li>
                <a href="/services/repairs" f-client-nav>
                  Repairs
                </a>
              </li>
              <li>
                <a href="/services/guides" f-client-nav>
                  DIY Guides (iFixit)
                </a>
              </li>
              <li>
                <a href="/services/trade-in" f-client-nav>
                  Trade-in
                </a>
              </li>
              <li>
                <a href="/services/financing" f-client-nav>
                  Financing
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold mb-4">About</h3>
            <ul class="space-y-2 text-sm text-gray-600">
              <li>
                <a href="/about/our-story" f-client-nav>
                  Our Story
                </a>
              </li>
              <li>
                <a href="/about/careers" f-client-nav>
                  Careers
                </a>
              </li>
              <li>
                <a href="/about/contact" f-client-nav>
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="hover:text-red-600 transition-colors"
                  title="Watch us attempt repairs and cry"
                >
                  Our YouTube (We Break Things) 💥
                </a>
              </li>
            </ul>
          </div>
          <div class="col-span-2 md:col-span-2">
            <h3 class="font-semibold mb-4">Quick Repair Tracker</h3>
            <p class="text-sm text-gray-600 mb-4">
              Enter your repair ticket or serial number to check live status.
            </p>
            <form action="/repairs/track" method="GET" class="flex gap-2">
              <input
                type="text"
                name="ticket"
                placeholder="Ticket ID or Serial Number"
                class="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                class="bg-black text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Track
              </button>
            </form>
          </div>
        </div>
        <div class="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-4">
          <div class="flex gap-4">
            <a href="/legal/terms" f-client-nav class="hover:text-gray-900">
              Terms
            </a>
            <a href="/legal/privacy" f-client-nav class="hover:text-gray-900">
              Privacy
            </a>
            <a href="/legal/cookies" f-client-nav class="hover:text-gray-900">
              Cookies
            </a>
          </div>
          <p>
            &copy; {new Date().getFullYear()} {STORE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
