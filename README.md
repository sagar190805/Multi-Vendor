# Multi-Vendor Marketplace Platform

A full-stack, three-portal marketplace application built with Spring Boot, React, and PostgreSQL. The platform facilitates end-to-end commerce with distinct interfaces and workflows for Buyers, Sellers, and Administrators.

## Architecture & Tech Stack
- **Backend**: Java 17, Spring Boot 3.3.2, Spring Security (JWT), Spring Data JPA, Hibernate.
- **Frontend**: React 18, Vite, Zustand (State Management), Tailwind CSS (Styling), React Router v6.
- **Database**: PostgreSQL 16, Flyway (Schema Migration).
- **Integrations**: Razorpay (Payment Gateway webhook & client SDK).

### Core Portals

1. **Buyer Portal (`/`, `/category/*`, `/checkout`, `/profile`)**
   - Catalog browsing and full-text search.
   - Shopping cart with session persistence and secure checkout.
   - Real-time Razorpay payment integration with HMAC-verified webhooks protecting order state transitions.

2. **Seller Center (`/seller/*`)**
   - KYC/Onboarding pipeline (Pending → Approved/Rejected loop).
   - Storefront and inventory management (CRUD with stock tracking).
   - Order fulfillment state machine (`PLACED` → `VENDOR_ACCEPTED` → `PACKED` → `SHIPPED` → `DELIVERED`).

3. **Admin Console (`/admin/*`)**
   - Strict Route & Role Guarding (`hasRole('ADMIN')`).
   - Vendor Application Moderation (Approve/Reject with feedback).
   - Catalog Moderation (Global visibility and Ban/Unban capabilities).
   - Platform Analytics & Order Oversight (Read-only cross-platform monitoring).

## Key Engineering Highlights

### 1. Robust State Machines
Order lifecycles follow a strict state machine enforced at the controller level. Edge cases are handled defensively:
- **Abandoned/Failed Payments**: Razorpay webhooks detect `payment.failed` events, immediately flipping the order to `CANCELLED` and releasing the soft-reserved inventory back into the active stock pool.
- **Cancellations**: Vendors can cancel orders pre-shipment, triggering automatic stock restoration.

### 2. Concurrency & Integrity
- **Optimistic Locking**: Product entities utilize `@Version` to prevent race conditions during high-concurrency checkouts, ensuring stock levels cannot drop below zero.
- **Price Snapshots**: Order items capture the `priceAtTime` of checkout. Post-purchase price modifications by a vendor will never retroactively alter historical order records or financial analytics.

### 3. Security First
- **IDOR Protection**: Seller endpoints strictly validate that the authenticated JWT corresponds to the `vendorId` of the requested resource. Sellers cannot mutate (or even view) orders or products belonging to competitors.
- **Webhook Source of Truth**: The frontend payment callback (`/verify`) acts only as a fast UI transition. The actual database state and financial confirmation rely exclusively on the `X-Razorpay-Signature` HMAC-validated webhook from Razorpay's backend.

## Running Locally

1. **Database**
   - Ensure PostgreSQL is running on `localhost:5432`.
   - Create a database named `marketplace` (`CREATE DATABASE marketplace;`).
   - Default credentials used: `postgres` / `password`.

2. **Backend**
   - Add your Razorpay test keys to `application.properties`:
     - `razorpay.key.id`
     - `razorpay.key.secret`
     - `razorpay.webhook.secret`
   - Run `.\gradlew.bat bootRun` (Windows) or `./gradlew bootRun` (Mac/Linux).
   - Flyway will automatically run all migrations up to `V9`.

3. **Frontend**
   - Navigate to `frontend/`.
   - Run `npm install` followed by `npm run dev`.
   - The application will be available at `http://localhost:5173`.
