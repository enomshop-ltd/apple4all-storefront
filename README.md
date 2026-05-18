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

- **Backend Security Note Recorded:** Created a `TODO.md` outlining the required changes to the `enomshop-ltd/medusajs-repair-module` API to securely gate sensitive data conditionally behind Medusa Customer ID Authentication, allowing safe public tracking.
- **Dynamic Active Orders:** Adjusted the `AccountDashboard.tsx` view to only display the "Active orders" widget if the customer genuinely has an active order (status is not completed, canceled, or archived).
- **Account Dashboard Polish:** Removed the placeholder "Flowbite PRO" subscription section from the account dashboard, and replaced the read-only Delivery Address field with an inline-editable grid linked to a new internal API wrapper (`/api/account/address`) that calls MedusaJS V2's `createAddress`/`updateAddress` SDK.
- **Improved Registration UX:** Refactored the MedusaJS `/api/auth/register` route token extraction so newly created sessions correctly populate valid auth cookies, preventing unexpected logouts. Added a visual success banner ("Account created successfully! Redirecting you to your dashboard...") inside the `LoginForm` island with a 2-second delay to give clear feedback instead of instantly redirecting to the login portal.
- **Dynamic Repairs Menu:** Added an intelligent `Repairs` tab under the Customer Account Overview. It natively checks the customer's previous or active order items via Medusa API in the route middleware, and only reveals the nested tracking page (complete with native chat, workflow approvals, and cost breakdown capabilities mapped to `TrackRepairIsland`) if valid repair line-items exist.
- **SEO Dynamic Sitemap:** Switched from a static file to a dedicated Deno Fresh API route (`/routes/sitemap.xml.ts`) that dynamically generates the `sitemap.xml` response by querying Medusa.js for the latest products.
- **SEO Update:** Added a `robots.txt` file in the static directory to ensure valid search engine crawling and indexation.
- **Smooth Page Transitions:** Implemented the browser-native View Transitions API natively via Fresh 2.3's `f-view-transition` attribute for partials, and the `<meta name="view-transition" content="same-origin" />` tag for full cross-document navigations.
- **Footer Update:** Made the copyright year in the footer dynamically update to the current year.
- **Product Details Fix:** Reverted the "Read More" and "Show Less" pills back to normal text per design request.
- **Add to Cart Button:** Changed the background color of the 'Add to Cart' buttons to a sleek dark grey/black shade for a more modern look.
- **Product Details Polish:** Redesigned the "Read More" / "Show Less" button for product descriptions. It is now centered, styled as a pill button for higher visibility, and uses a solid top-border line separator instead of a fade-out gradient.
- **Track Repair Form Update:** Removed the "Track Repair Status" primary button and converted the YouTube link into a sleek, text-based "Track repair status" submit button underneath the input field.
- **Account Dashboard:** Removed statically-mocked "Favorite products" and "Reviews added" fields replacing them with dynamically calculated "Unpaid" ammounts, "Credits", and "Returns" fetched from real order data.
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
