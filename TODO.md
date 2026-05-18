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
