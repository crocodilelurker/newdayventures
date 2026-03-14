# NewDayVentures

An advanced e-commerce platform for selling online course materials, PDFs, notes, sheets, and other digital educational resources. Built with Next.js (App Router), React, Tailwind CSS, Framer Motion, and MongoDB.

## Features

- **Store & Search** — Browse, search, and filter courses by category and type. Includes debounced, server-side filtered search with URL routing.
- **Product Detail** — View comprehensive course details, highlights, syllabus, instructor information, and dynamic pricing.
- **Interactive Ratings** — Students can submit 1-5 star ratings for courses. Includes optimistic UI updates and persistent average calculations on the backend.
- **Cart System** — Slide-out cart sidebar with persistent `localStorage` synchronization across sessions to avoid duplicate orders.
- **Promotion Codes** — Advanced Admin coupon system for marketing logic.
  - Admins can create flat percentage discounts (e.g., LAUNCH50 for 50% off).
  - Promo codes can apply platform-wide or explicitly strictly to specific courses.
  - Server-side validation during the checkout flow automatically calculates dynamic cart discounts.
- **Checkout Flow** — Beautiful Stripe-style payment form with card validation, auto-formatting, and interactive order summaries reflecting promo codes.
- **Authentication** — NextAuth.js integration for robust access control (User/Admin roles) utilizing session caching.
- **Admin Dashboard** — Secure routing for administrators to manage inventory and discount code configurations.
- **Responsive Animations** — Framer Motion enables fluid route transitions, micro-interactions, and beautiful structural layouts on mobile and desktop.

## Tech Stack

- **Framework**: Next.js (App Router, Turbopack)
- **Database**: MongoDB / Mongoose OS
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Font**: Poppins (Google Fonts)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Hooks + LocalStorage Validation

## Getting Started

First, ensure you have your `.env` configured properly with the following keys:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=http://localhost:3000
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Seeding the Database

If you wish to populate the MongoDB database with initial sample course materials:
```bash
npm run seed
```

## Internal Architecture & Project Structure

```text
/app
├── admin/                  # Protected Admin dashboard routes
├── api/                    # Next.js Serverless API routes (materials, orders, auth, coupons)
├── checkout/               # Checkout / Payment flow
├── login/                  # User Sign in
├── signup/                 # User Registration
├── store/                  # Store grid / Course search index
│   └── [id]/page.tsx       # Dynamic course product pages (Ratings, Info)
├── globals.css             # Global Tailwind directives
├── layout.tsx              # Root HTML wrapper with Session & Toast Providers
├── page.tsx                # Dynamic Landing Page (Hero, Value Props, Testimonials)

/components
├── CartContext.tsx         # Cart UI and logic state management
├── Navbar.tsx              # Main Navigation header with global search
├── CourseCard.tsx          # Reusable Material cards
├── ToastProvider.tsx       # Global toast notification wrapper

/lib
├── db.ts                   # Mongoose / MongoDB connection utility
├── models/                 # Mongoose DB Schemas (User, Material, Order, Coupon)

/scripts
├── seed.ts                 # Database seeding script for dummy data
```

## Currency Setup
The platform is currently optimized and rendered in Indian Rupees (₹).
