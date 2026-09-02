# Multi-Vendor E-Commerce Platform

A comprehensive, full-stack multi-vendor marketplace platform featuring dedicated portals for Buyers, Sellers, and Administrators. The system allows multiple independent vendors to set up storefronts, manage products, and fulfill orders while platform administrators oversee approvals, disputes, and commission rates.

## Platform Features

### Buyer Portal
* Product Discovery: Browse and search for products across multiple vendors.
* Shopping Cart & Checkout: Seamless purchasing experience.
* Order Tracking: Monitor order status from placement to delivery.

### Seller Dashboard
* Store Onboarding: Simple 3-step store setup process.
* Product Management: Add, edit, and track inventory with a visual grid/list toggle.
* Bulk Upload: Drag-and-drop CSV upload for large product catalogs.
* Order Management: Track orders with a detailed visual timeline (Placed, Packed, Shipped, Delivered).
* Sales Analytics: Real-time revenue charts and traffic source breakdowns using Recharts.
* Payout Ledger: Track earnings, platform fees, and withdrawal history.

### Admin Console
* Platform Analytics: Macro-level view of GMV, active users, and platform health metrics.
* Vendor Approval: Review and process new seller KYC applications.
* Catalog Moderation: Monitor and take down flagged or suspicious products.
* Dispute Center: Resolve escalated order issues between buyers and sellers.
* Commission Configuration: Set dynamic platform fee percentages based on product categories.
* Audit Log: Detailed, timestamped activity feed of system events.

## Tech Stack

### Frontend
* React 18
* Vite
* Tailwind CSS v4
* React Router v6
* Recharts (Data visualization)
* Lucide React (Icons)
* Framer Motion (Animations)

### Backend
* Java 17
* Spring Boot 3
* Spring Security (JWT Authentication)
* PostgreSQL
* Flyway (Database Migrations)
* Gradle

## Getting Started

### Prerequisites
* Node.js (v18 or higher)
* Java 17+
* PostgreSQL

### Frontend Setup
1. Navigate to the frontend directory:
   cd frontend
2. Install dependencies:
   npm install
3. Start the development server:
   npm run dev

### Backend Setup
1. Navigate to the backend directory:
   cd backend
2. Configure your database credentials in src/main/resources/application.yml
3. Run the application:
   ./gradlew bootRun

## Architecture
The project is structured into two main directories:
* /frontend: Contains the React application with separated layouts and features for Admin, Seller, and Buyer views.
* /backend: Contains the Spring Boot REST API for authentication, user management, and business logic.
