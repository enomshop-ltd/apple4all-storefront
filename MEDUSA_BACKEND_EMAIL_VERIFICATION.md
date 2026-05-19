# Medusa Backend Setup for Email Verification

This guide outlines exactly what you need to create in your Medusa 2.15.* backend to handle the custom email verification workflow.

You need to establish 3 things in your Medusa backend codebase:
1. A subscriber that listens to `customer.created` to generate a token and send an email
2. A custom API route (`POST /store/customers/verify-email`) to accept the token and verify the account
3. A notification provider installed and configured (like `@medusajs/notification-sendgrid`)

## 1. Event Subscriber (`src/subscribers/customer-created.ts`)

This subscriber listens for when a customer is created, generates a secure random token, stores it in the database/cache (or directly on customer metadata for simplicity), and triggers the notification module.

```typescript
import { type SubscriberConfig, type SubscriberArgs } from "@medusajs/framework";
import { INotificationModuleService, ICustomerModuleService } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import crypto from "crypto";

export default async function customerCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const customerModuleService: ICustomerModuleService = container.resolve(Modules.CUSTOMER);
  const notificationModuleService: INotificationModuleService = container.resolve(Modules.NOTIFICATION);

  // Retrieve the newly created customer
  const customer = await customerModuleService.retrieveCustomer(data.id);

  // Generate a random 6-character hex token or code
  const verificationToken = crypto.randomBytes(3).toString("hex").toUpperCase();

  // Save the token - simplest way is in customer metadata temporarily
  // You could also create a custom module/table for verification codes
  await customerModuleService.updateCustomers(customer.id, {
    metadata: {
      ...customer.metadata,
      verification_token: verificationToken,
      is_verified: false
    }
  });

  // Construct the verification URL to point to your storefront (adjust domain)
  // For local frontend, it's typically http://localhost:8000
  const verificationUrl = `http://localhost:8000/verify-email?token=${verificationToken}&email=${customer.email}`;

  // Send the email via Notification Module
  await notificationModuleService.createNotifications({
    to: customer.email,
    channel: "email",
    template: "customer-verification", // The template ID in SendGrid or Resend
    data: {
      first_name: customer.first_name,
      verification_token: verificationToken,
      verification_url: verificationUrl
    },
  });
  
  console.log(`[Notification] Verification email sent to ${customer.email} with token ${verificationToken}`);
}

export const config: SubscriberConfig = {
  event: "customer.created",
};
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
