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
- **Enhancement**: Removed all hardcoded `http://localhost:9000` defaults; frontend now strictly uses `Deno.env.get("MEDUSA_BACKEND_URL")` explicitly.
- **Enhancement**: Re-organized `/repairs/dashboard` into `/repairs/` and integrated the "Repairs" menu directly into the Account sidebar for logged-in users.
- **Fix**: Created proxy API routes (`/api/account/repairs` & `/api/repairs/book`) for secure backend access and added missing session cookies resolving `401 Unauthorized`.
- **Privacy Check**: `TrackRepairIsland` will now gracefully limit sensitive tracking data (like Chat Messages, Issue descriptions, Notes, Quotes, & Receipts) showing only progress/timelines for anonymous users.
- **UI Tweaks**: Made the `/repairs/track` page more compact, modern, and interactive with adjusted spacing and visual enhancements.
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
