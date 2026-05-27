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
- **UI Enhancement**: Redesigned the `PromoBanner` entirely, replacing placeholder text with an interactive repair booking CTA, complete with the slogan "Our prices are lower than your expectations" and a vibrant repair illustration background. Added height adjustments inline. Update promo banner image to realistic repair image and tweaked "Learn More" into plain text link.
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


# Project Priorities & TODOs

## Medusa.js Backend Updates

### 🔒 Secure Sensitive Repair Data in `medusajs-repair-module`
**Repository:** [https://github.com/enomshop-ltd/medusajs-repair-module](https://github.com/enomshop-ltd/medusajs-repair-module)

**Issue/Feature Description:**
Currently, querying the repair status by Serial Number via the Store API exposes some sensitive fields (like customer details, internal technician notes, or associated order IDs) to anyone with the serial number. 

**Required Changes:**
1. **Restrict Public Payload:** Modify the public `GET /store/repairs?serial={serial}` endpoint to return *only* non-sensitive tracking information (e.g., status, device model, public status updates).
2. **Context-Aware Payload (Authentication Check):** 
   - Check if the request contains an authenticated customer session (`req.user.customer_id` or equivalent Medusa auth context).
   - If the authenticated customer matches the customer attached to the repair order, return the **full payload** (including associated order links, internal details approved for customer viewing, etc.).
   - If unauthenticated (or wrong customer), omit the sensitive fields.
3. (Optional) Create a strictly authenticated endpoint `GET /store/customers/me/repairs` to list full details for all repairs associated with the logged-in customer.

This will ensure the storefront can safely display public tracking steps for guest users, while securely unlocking granular details (like costs, linked orders, and personal info) when the user logs in.


# Medusa Backend Setup for Email Verification

This guide outlines exactly what you need to create in your Medusa 2.15.* backend to handle the custom email verification workflow.

You need to establish 3 things in your Medusa backend codebase:
1. A subscriber that listens to `customer.created` to generate a token and send an email
2. A custom API route (`POST /store/customers/verify-email`) to accept the token and verify the account
3. A notification provider installed and configured (like `@medusajs/notification-sendgrid`)

## 1. Event Subscriber (`src/subscribers/customer-created.ts`)

This subscriber listens for when a customer is created, generates a secure random token, stores it in the database/cache (or directly on customer metadata for simplicity), and triggers the notification module.

```typescript
import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { ICustomerModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
// Ensure this path matches the location of your email templates helper in your backend
import { getAuthTemplate } from "../../utils/email-templates" 
import crypto from "crypto"
import nodemailer from "nodemailer"

export default async function customerNotificationHandler({
  event,
  container,
}: SubscriberArgs<any>) {
  const logger = container.resolve("logger")
  const eventName = event.name
  const data = event.data

  logger.info(`[Nodemailer-Debug] 🟢 Triggered '${eventName}' subscriber.`)

  try {
    let email = ""
    let templateName = ""
    let emailSubject = ""
    let htmlContent = ""
    let templateData = {}

    if (eventName === "customer.created") {
      const customerService: ICustomerModuleService = container.resolve(Modules.CUSTOMER)
      logger.debug(`[Nodemailer-Debug] Retrieving customer data for ID: ${data.id}...`)
      
      const customer = await customerService.retrieveCustomer(data.id)
      email = customer.email
      
      // 1. Generate a random 6-character hex verification token
      const verificationToken = crypto.randomBytes(3).toString("hex").toUpperCase()

      // 2. Save the token and mark is_verified: false in customer metadata
      await customerService.updateCustomers(customer.id, {
        metadata: {
          ...customer.metadata,
          verification_token: verificationToken,
          is_verified: false
        }
      })

      // 3. Construct the verification URL 
      // Replace STOREFRONT_URL directly in your code or add it to your .env
      const storefrontUrl = process.env.STOREFRONT_URL || "https://ais-dev-62ono6avaltafphj2pis2z-526705599121.europe-west2.run.app"
      const verificationUrl = `${storefrontUrl}/verify-email?token=${verificationToken}&email=${customer.email}`

      // 4. Setup template payload for Nodemailer
      templateName = "customer-verification"
      emailSubject = "Verify Your Account - Apple4All"
      htmlContent = getAuthTemplate(templateName, { 
        name: customer.first_name,
        verification_token: verificationToken,
        verification_url: verificationUrl
      })

    } else if (eventName === "auth.password_reset") {
      logger.debug(`[Nodemailer-Debug] Processing password reset payload...`)
      
      email = data.email
      templateName = "password-reset"
      emailSubject = "Password Reset Request"
      // data.token is provided by the raw Medusa auth module
      htmlContent = getAuthTemplate(templateName, { token: data.token, email: data.email }) 
    }

    if (!email || !htmlContent) {
      logger.warn(`[Nodemailer-Debug] ⚠️ No target email/content found for event ${eventName}. Aborting.`)
      return
    }

    logger.debug(`[Nodemailer-Debug] Dispatching '${templateName}' template via direct Nodemailer transport...`)

    // Generate direct Nodemailer transport to bypass Medusa V2 content stripping bugs
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "apple-4all.com",
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: emailSubject,
      html: htmlContent
    })

    logger.info(`[Nodemailer-Debug] ✅ Successfully dispatched '${eventName}' notification to ${email}`)
  } catch (error) {
    logger.error(`[Nodemailer-Debug] ❌ Failed to process '${eventName}'`, error)
    if (error instanceof Error && error.stack) {
      logger.error(`[Nodemailer-Debug] Stack trace: \n${error.stack}`)
    }
  }
}

export const config: SubscriberConfig = {
  event: [
    "customer.created",
    "auth.password_reset"
  ],
}
```

## 3. Email Template Utility (`src/utils/email-templates.ts`)

You will also need to create a utility function to generate the email HTML content. This ensures the verification URL and token are properly rendered in the email sent by your notification provider.

```typescript
export function getAuthTemplate(templateName: string, data: any): string {
  if (templateName === "customer-verification") {
    return `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify Your Account</h2>
        <p>Hello ${data.name || "Customer"},</p>
        <p>Thank you for registering at Apple4All.</p>
        <p>Please click the link below to verify your email address:</p>
        <div style="margin: 30px 0;">
          <a href="${data.verification_url}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Verify Email
          </a>
        </div>
        <p>Or manually enter this verification token on the verification page: <strong>${data.verification_token}</strong></p>
        <hr style="border: 1px solid #eaeaea; margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">If you did not request this, please ignore this email.</p>
      </div>
    `;
  }
  
  if (templateName === "password-reset") {
    // Implement your password reset template here if needed
    return `<div>Password reset token: ${data.token}</div>`;
  }

  return "<div>No template found</div>";
}
```

## 4. API Route to Verify Email (`src/api/store/customers/verify-email/route.ts`)

When the user clicks the link or submits the form on the frontend, this Medusa API route validates the token and marks the customer as verified.

```typescript
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ICustomerModuleService } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { email, token } = req.body as { email: string; token: string };

  if (!email || !token) {
    return res.status(400).json({ error: "Email and token are required" });
  }

  const customerModuleService: ICustomerModuleService = req.scope.resolve(Modules.CUSTOMER);

  // Find the customer by email
  const [customer] = await customerModuleService.listCustomers(
    { email },
    { take: 1 }
  );

  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  // Check if token matches
  const storedToken = customer.metadata?.verification_token;
  
  if (!storedToken || storedToken !== token) {
    return res.status(400).json({ error: "Invalid or expired verification token" });
  }

  // Token matches! Verify the customer
  await customerModuleService.updateCustomers(customer.id, {
    metadata: {
      ...customer.metadata,
      verification_token: null, // Clear the token 
      is_verified: true
    }
  });

  return res.status(200).json({ 
    success: true,
    message: "Email verified successfully" 
  });
};
```

## Frontend Requirements
Once these are in place in your backend:
1. When a user registers on the storefront, the customer object is created in Medusa.
2. Medusa's event bus triggers `customer.created`.
3. The subscriber fires, saves the `verification_token`, and sends an email.
4. The user clicks the link and comes to a page like `/verify-email`.
5. The frontend submits a POST to `${MEDUSA_BACKEND_URL}/store/customers/verify-email`.
6. Medusa verifies and updates `metadata.is_verified = true`.
