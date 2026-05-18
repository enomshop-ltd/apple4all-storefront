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