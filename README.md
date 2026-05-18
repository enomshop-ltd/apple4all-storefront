# Deno Fresh + Medusa v2 Storefront

A blazing-fast, modern e-commerce storefront built with [Deno Fresh](https://fresh.deno.dev/) and [Medusa v2](https://medusajs.com/).

## Features

- ⚡ **Ultra-fast Performance:** Server-side rendered with Deno Fresh and Preact islands.
- 🛍️ **Full E-commerce Flow:** Product listing, cart management, and checkout.
- 👤 **Unified Dashboard:** Customer profile, delivery addresses, and order history combined into a single view with inline editing.
- 💳 **Checkout:** Integrated with Medusa's payment sessions (Manual/Pay on Delivery default).
- 🛠️ **Repair Module:** Embedded "Track Repair Status" portal natively tracking status natively via MedusaJS.
- 📖 **DIY Guides:** Free Apple product repair guides powered dynamically by the public iFixit API.
- 🌟 **Dynamic Navigation:** Storefront seamlessly queries Medusa for the top product categories to build out menus dynamically.
- 🎨 **Styling:** Fully styled with Tailwind CSS, Lucide icons, native markdown parsing for products, and polished glassy UI.
- 🚀 **UX Polish:** GitHub-style Top Loading Progress Bar and seamless client-side page transitions.

## Changelog

- **Smooth Page Transitions:** Implemented the browser-native View Transitions API natively via Fresh 2.3's `f-view-transition` attribute for partials, and the `<meta name="view-transition" content="same-origin" />` tag for full cross-document navigations.
- **Footer Update:** Made the copyright year in the footer dynamically update to the current year.
- **Product Details Fix:** Reverted the "Read More" and "Show Less" pills back to normal text per design request.
- **Add to Cart Button:** Changed the background color of the 'Add to Cart' buttons to a sleek dark grey/black shade for a more modern look.
- **Product Details Polish:** Redesigned the "Read More" / "Show Less" button for product descriptions. It is now centered, styled as a pill button for higher visibility, and uses a solid top-border line separator instead of a fade-out gradient.
- **Track Repair Box:** Updated the `CustomBox` component on the Store page to be an interactive repair tracking form, allowing users to enter their serial number directly on the store page to jump into tracking their device.
- **Store Sort UI Update:** Reduced the width of the product list sort drop-down and shortened the copy (removed "arrivals" and "name:") for a cleaner look.
- **UX Polish (Progress Bar):** Fixed the GitHub-style Top Loading Progress Bar so that it reliably triggers and completes during Fresh client-side (partial) navigation by hooking natively into `fetch`, `click` (capture phase), and `pushState` events.
- **Header & API Fixes:** Resolved an issue causing the header to disappear by moving Medusa category fetching out of the asynchronous component and into a route middleware (`_middleware.ts`). Fixed duplicate header/footer issues on error pages.
- **iFixit Guides Refactoring:** Refactored the `iFixit` API fetching to be static pre-defined collections since the original category API output formats changed, making the guides page load fast and reliably with real thumbnails.
- **Store Filter UI Fix:** Reverted the product filtering UI sizes and styling back to their original dimensions, added subtle rounded corners, and removed the blue outline from the filter dropdown when selected.
- **DIY Repair Guides:** Added a new `/services/guides` directory that fetches dynamically from the public `iFixit` API, offering free repair guides to users with legal disclaimers about CC BY-NC-SA usage. Integrated into the main repairs page.
- **Terms of Service Update:** Updated `/legal/terms` to clarify warranty (90 days limit), refund policies (store credit only), screen return policies (no returns, 48hr defect report), job cards requirement, and payment channels compliance.
- **Repair Tracking module introduced:** Integrated the MedusaJS Repair module tracking UI allowing query via serial numbers.
- **Account Dashboard Overhaul:** Merged profile, address, and orders into an inline-editable combined `/account` dashboard.

## Local Development

1. Clone repo, supply `.env` variables `MEDUSA_BACKEND_URL` and `MEDUSA_PUBLISHABLE_KEY`.
2. Run `deno task start`. Open `http://localhost:8000`.

## License

MIT
