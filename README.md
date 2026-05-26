# Apple4All Storefront

A high-performance, SEO-optimized e-commerce storefront for Apple4All. Built with Deno, Fresh.js, and MedusaJS, it provides a seamless shopping experience for refurbished Macs along with integrated repair tracking and customer services.

## Key Features

- **Modern Architecture:** Built on Fresh.js utilizing islands architecture and view transitions for a smooth, SPA-like user experience with partial hydration.
- **E-commerce Ready:** Full integration with MedusaJS backend for browsing collections, managing carts, user authentication, and checkout flows.
- **Service Portals:** Dedicated portals for Trade-ins, Financing, and Mac Repairs. Customers can book repairs and track existing tickets in real-time.
- **Secure Authentication:** Robust user account system featuring secure login, signup, and email verification workflows directly integrated with the backend.
- **Customer Dashboard:** A centralized account area where customers can view their order history, saved addresses, and active repair tickets.
- **Performance & SEO:** Leverages Deno and Fresh's server-side rendering for optimal Core Web Vitals, enriched with standard SEO metadata and semantic HTML.
- **Responsive Design:** A polished, mobile-first design implemented tightly with Tailwind CSS, utilizing clean typographic pairings and custom SVG iconography.

## Development & Usage

- Run `deno task dev` to start the development server. 
- The storefront requires a running MedusaJS backend. Ensure `MEDUSA_BACKEND_URL` and `MEDUSA_PUBLISHABLE_KEY` environment variables are correctly configured.

## Changelog

### v1.2.0 (Current)
- **Feature**: Integrated Medusa Repair Module frontend booking and dashboard routes (`/repairs/book` and `/repairs/dashboard`).
- **Feature**: Secured `/repairs/dashboard` and `/repairs/book` with server-side middleware and graceful client-side unauthorized fallbacks.
- **Enhancement**: Added robust frontend logging (`console.debug`, `console.info`, `console.error`) for Repair booking and dashboard fetch requests.
- **Enhancement**: Relocated repair-related routes back to `/repairs/` explicitly moving them out of the `/account/` route space and making them self-encased.
- **Enhancement**: Removed the Repairs tab completely from the My Account dashboard layout as requested.
- **Bug Fix**: Fixed a missing route issue where `/repairs/track` threw a 404 due to plural directory mismatch.
- **Bug Fix**: Addressed an empty state bug where `/repairs/` would incorrectly state "You do not have any active or past repair orders" by parsing both `repairs` and `repair_tickets` keys interchangeably from the API response payload.
- **Bug Fix**: Fixed a Fresh 2 runtime error on the `/repairs/track` route, which was attempting to read context from legacy Fresh 1.0 parameters (`req, ctx`); updated to properly use `define.page` rendering and `props.url`.
- **Bug Fix**: Removed duplicate "Timeline" components rendering redundantly inside the `TrackRepairIsland` component during timeline display.
- **UI Enhancement**: Redesigned the `PromoBanner` entirely, replacing placeholder text with an interactive repair booking CTA, complete with the slogan "Our prices are lower than your expectations" and a vibrant repair illustration background.
- **Enhancement**: Added 'Repairs' navigation links directly into the `/account/` sidebar, utilizing Fresh `<Partial>` rendering (`f-partial`) to load repair interfaces smoothly inline without breaking the account dashboard layout.
- **Refactor**: Redirected internal link bindings away from `/repair/` pointing all anchors appropriately to `/repairs/`.
- **Enhancement**: Refactored `BookRepairIsland` and `CustomerRepairsIsland` to adhere to the storefront's uniform `slate` design system and Tailwind styling cues.
- **UI Upgrade**: Injected dynamic 'Book a Repair' hooks across informational service pages for better discoverability.
- **Engagement**: Added an eye-catching CTA within the PromoBanner integrating relevant promotional taglines to drive repairs.

### v1.1.0
- **Feature**: Integrated comprehensive email verification flow spanning `/login`, `/register`, and `/verify-email` routes.
- **Feature**: Integrated Medusa Repair Module frontend paths mapping over `/repairs/track` and `account/repairs`.
- **Enhancement**: Migrated TrackRepairIsland functionality to Apple4All's modern, minimal styling utilizing `slate` and `emerald` tailwind palettes.
- **Enhancement**: Implemented extensive frontend debugging utilizing `console.debug`, `console.info`, and `console.warn` for Medusa backend fetch requests.
- **Bug Fix**: Resolved silent JSON parsing errors leading to generic fallback error messages on the Verification Page.
- **UI Upgrade**: Applied View Transitions across all pages to ensure smooth client-side route navigation.

### v1.0.0 - Initial Release
- Core e-commerce routes (Shop, Cart, Checkout) implemented and mapped to Medusa workflows.
- Introduction of Fresh.js integration for storefront repair tracking via `TrackRepairIsland`.
- Baseline static pages (About Us, Careers, Contact, Legal Policies) launched.
