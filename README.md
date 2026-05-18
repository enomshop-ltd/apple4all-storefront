## Changelog
- **DIY Repair Guides:** Added a new `/services/guides` directory that fetches dynamically from the public `iFixit` API, offering free repair guides to users with legal disclaimers about CC BY-NC-SA usage. Integrated into the main repairs page.
- **Terms of Service Update:** Updated `/legal/terms` to clarify warranty (90 days limit), refund policies (store credit only), screen return policies (no returns, 48hr defect report), job cards requirement, and payment channels compliance.
- **Header UI Polish:** Applied a glassy, translucent effect (backdrop-blur) to the top navigation bar for a more modern aesthetic.
- **Search UI Refinement:** Made the search bar and filter dropdown more minimalistic, reducing their size, applying a pill-shaped rounded design, and utilizing subtle hover/focus background effects instead of harsh borders.
- **Social links added:** Added a funny YouTube channel link in the footer to showcase some of our more *adventurous* repair attempts.
- **Repairs Page Redesign:** Overhauled the `/services/repairs` page to be more interactive by directly embedding the Repair Tracker. Split the layout thoughtfully between the repair form and available services to maintain a minimalist but lively aesthetic.
- **Dynamic Storefront Navigation:** Revamped the primary navigation menu to dynamically fetch and display product categories directly from the MedusaJS backend. Restricts the menu to 5 total items (Store + top 4 highest-ranking root categories) while retaining a clean UI.
- **Search UI Polish:** Removed the redundant "All Products" title to simplify the shop interface layout.
- **Product Details Polish:** Improved the rendering of product descriptions by parsing Markdown natively and adding a clean, expandable "Read More / Show Less" toggle for longer descriptions, ensuring no content is awkwardly cut off.
- **Global Loading Indicator:** Added a slim, GitHub-style loading progress bar at the top of the viewport (`TopProgressBarIsland.tsx`). This UI enhancement intercepts all client-side anchor clicks, form submissions, and partial updates to provide instant visual feedback during loading transitions.
- **Repair Tracking module introduced:** Integrated the MedusaJS Repair module tracking UI (TrackRepairIsland & respective route) to allow users to verify ticket statuses via serial numbers and interact natively with mechanics.
- **Custom Box Update:** Switched the "Trade in" box on the storefront to "Track Repair Status", and its button links properly to the tracking portal.
- **Payment Methods Update:** Removed Paystack as a payment option for checkout and installments per user request. "Manual (Pay on Delivery)" is now the default checkout payment mode.

## 2026 Update: Account Dashboard Overhaul

The customer account interface has been merged into a single, comprehensive dashboard located at `/account`.

### Features Added
- **Unified Overview:** Combines Profile information, saved Delivery Addresses, and Order History into a single Flowbite-style dashboard view.
- **Inline Editing:** To edit profile information (Name, Phone Number), hover over the fields. The inputs are seamless and outline only on focus. Edits securely push changes to Medusa natively when you hit "Enter" or click away (blur event).
- **Consolidated API usage:** Eliminates redundant data fetches by grouping customer, address, and orders logic in a single `Promise.all` loader inside `routes/account/index.tsx`.
- **Deprecated Routes:** The previously redundant sub-pages (`/profile`, `/orders`, `/addresses`) have been replaced with redirects back to the main `/account` dashboard. Debug logs are placed in the endpoints to trace API actions easily.

# Deno Fresh + Medusa v2 Storefront

A blazing-fast, modern e-commerce storefront built with
[Deno Fresh](https://fresh.deno.dev/) and [Medusa v2](https://medusajs.com/).

This project provides a complete shopping experience, including product
browsing, cart management, user authentication, and a customer dashboard, all
powered by a headless Medusa backend.

## Features

- ⚡ **Ultra-fast Performance:** Server-side rendered with Deno Fresh and Preact
  islands.
- 🛍️ **Full E-commerce Flow:** Product listing, cart management, and checkout.
- 👤 **Customer Accounts:** Registration, login, profile management, and order
  history.
- 💳 **Checkout:** Integrated with Medusa's payment sessions (supports "Pay on
  Delivery" out of the box).
- 🎨 **Styling:** Fully styled with Tailwind CSS and Lucide icons.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Deno](https://deno.land/#installation) (v1.40+ recommended)
- A running instance of a
  [Medusa v2 Backend](https://docs.medusajs.com/v2/basics/install)

## Environment Variables

Create a `.env` file in the root of the project and add the following variables:

```env
# The URL of your Medusa backend (default is usually http://localhost:9000)
MEDUSA_BACKEND_URL=http://localhost:9000

# Your Medusa Publishable API Key (Required for storefront API access)
MEDUSA_PUBLISHABLE_KEY=pk_your_publishable_key_here
```

## Connecting to your Medusa Backend

1. **Start your Medusa server:** Ensure your Medusa v2 backend is running
   locally or deployed.
2. **Generate a Publishable Key:**
   - Go to your Medusa Admin dashboard.
   - Navigate to **Settings > API Key Management**.
   - Create a new **Publishable API Key**.
   - Copy the key and paste it into your `.env` file as
     `MEDUSA_PUBLISHABLE_KEY`.
3. **Configure CORS:** Ensure your Medusa backend's `STORE_CORS` environment
   variable includes the URL where this storefront will be running (e.g.,
   `http://localhost:8000` for local dev).

## Local Development

To start the development server:

```bash
deno task start
```

This will run the project locally. Open
[http://localhost:8000](http://localhost:8000) in your browser to view the
storefront.

## Deploying to Deno Deploy

Deploying this storefront to [Deno Deploy](https://deno.com/deploy) is
incredibly simple and provides edge-rendering globally.

### Step 1: Push to GitHub

Push your storefront code to a GitHub repository.

### Step 2: Create a Deno Deploy Project

1. Go to the [Deno Deploy Dashboard](https://dash.deno.com/projects).
2. Click **New Project**.
3. Select **Deploy from GitHub**.
4. Choose your repository and the branch you want to deploy.
5. In the **Entrypoint** dropdown, select `main.ts`.

### Step 3: Configure Environment Variables

Before clicking deploy, click on **Add Environment Variables**:

- Add `MEDUSA_BACKEND_URL` (pointing to your production Medusa backend URL).
- Add `MEDUSA_PUBLISHABLE_KEY` (your production publishable key).

### Step 4: Deploy

Click **Deploy Project**. Deno Deploy will build and deploy your Fresh app to
the edge in seconds.

---

## Project Structure

- `routes/`: Contains the file-based routing for the application (API routes and
  pages).
- `islands/`: Interactive Preact components that are hydrated on the client.
- `components/`: Reusable, server-rendered UI components.
- `lib/`: SDK initialization and data fetching utilities.
- `static/`: Static assets like images and global CSS.

## License

MIT
