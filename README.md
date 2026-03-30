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
