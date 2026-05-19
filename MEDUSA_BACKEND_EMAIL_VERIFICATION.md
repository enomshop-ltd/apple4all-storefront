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
import { INotificationModuleService, ICustomerModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
// Ensure this path matches the location of your email templates helper in your backend
import { getAuthTemplate } from "../../utils/email-templates" 
import crypto from "crypto"

export default async function customerNotificationHandler({
  event,
  container,
}: SubscriberArgs<any>) {
  const logger = container.resolve("logger")
  const eventName = event.name
  const data = event.data

  logger.info(`[Nodemailer-Debug] 🟢 Triggered '${eventName}' subscriber.`)

  try {
    const notificationModuleService: INotificationModuleService = container.resolve(Modules.NOTIFICATION)
    
    let email = ""
    let templateName = ""
    let emailSubject = ""
    let htmlContent = ""

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
      // (Uses STOREFRONT_URL from backend's .env if deployed)
      const storefrontUrl = process.env.STOREFRONT_URL || "http://localhost:8000"
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

    if (!email) {
      logger.warn(`[Nodemailer-Debug] ⚠️ No target email found for event ${eventName}. Aborting.`)
      return
    }

    logger.debug(`[Nodemailer-Debug] Dispatching '${templateName}' template via Nodemailer...`)

    await notificationModuleService.createNotifications({
      to: email,
      channel: "email",
      template: templateName,
      data: {
        subject: emailSubject,
        html: htmlContent,
      },
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

## 2. API Route to Verify Email (`src/api/store/customers/verify-email/route.ts`)

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
5. The frontend submits a POST to `http://localhost:9000/store/customers/verify-email`.
6. Medusa verifies and updates `metadata.is_verified = true`.
