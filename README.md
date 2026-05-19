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

## Connecting to MedusaJS Backend

To connect the storefront to your MedusaJS V2 backend, you need to configure your environment variables with your backend's URL and Publishable API Key.

1. Create a `.env` file in the root of the project.
2. Set the following environment variables:
   ```env
   MEDUSA_BACKEND_URL=http://localhost:9000 # Your Medusa backend URL (e.g., deployed domain or localhost)
   MEDUSA_PUBLISHABLE_KEY=pk_your_publishable_key # Your Medusa publishable API key
   ```
   *Note: You can generate a publishable key in your Medusa Admin dashboard under **Settings > API Keys**.*

3. If you are using backend extensions like email verification or the repair module, ensure your backend has the relevant plugins and API routes installed (refer to `MEDUSA_BACKEND_EMAIL_VERIFICATION.md` for guidance on email flows).

## How to Install and Deploy (Deno Deploy)

[Deno Deploy](https://console.deno.com/) is the optimal hosting platform for Deno Fresh applications, offering fast edge rendering.

1. Push your storefront code to a GitHub repository.
2. Go to [Deno Deploy](https://console.deno.com/) and sign in with your GitHub account.
3. Click on **New Project**.
4. Select your GitHub repository containing this codebase.
5. In the framework preset, it should automatically detect **Fresh**.
6. Set the entry point to `main.ts` (this is the default for Fresh apps).
7. Under **Environment Variables**, add the `MEDUSA_BACKEND_URL` and `MEDUSA_PUBLISHABLE_KEY` from your backend.
8. Click **Deploy Project**. Within seconds, your storefront will be globally deployed at the edge.

## Local Development

1. Clone repo, supply `.env` variables `MEDUSA_BACKEND_URL` and `MEDUSA_PUBLISHABLE_KEY`.
2. Run `deno task start`. Open `http://localhost:8000`.

## Recent Updates

- **Account Authentication & Pricing:** Implemented user registration with MedusaJS email verification flows, cart-to-customer price list bindings (applies reduced pricing for specific Customer Groups like RESELLERs), and a unified account dashboard.
- **Repair Module Integration:** Added a complete repair tracking pipeline bridging with the backend module. Authenticated users can view their repair history mapped to ticket numbers, while guests can track repairs openly with their ticket numbers. Added DIY repair guides using the iFixit API.
- **Checkout Payment Options:** Implemented dynamic payment provider parsing on the checkout page. The storefront automatically fetches enabled payment providers (like Manual/Pay on Delivery, Paystack, Stripe) from MedusaJS and auto-populates the UI options based on plugins installed. Added clear extension hooks in the checkout logic for initializing frontend UI pop-ups. Administrators can configure specific active payment providers by setting the `PAYMENT_PROVIDERS` environment variable (e.g., `PAYMENT_PROVIDERS="pp_system_default:Pay on Delivery,pp_paystack_paystack:Paystack"`).
- **SEO & Performance:** Created a dynamic API route (`/sitemap.xml`) to dynamically parse Medusa products, added a `robots.txt` configuration, and cleaned up unused components to keep the boilerplate minimal.

## License

MIT
