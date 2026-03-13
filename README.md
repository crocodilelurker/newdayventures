# NewDayVentures

An e-commerce platform for selling online course materials, PDFs, notes, sheets, and other educational resources. Built with Next.js 16, Tailwind CSS, and Framer Motion.

## Features

- **Store** — Browse, search, and filter courses by category and type
- **Product Detail** — View course details, highlights, and syllabus
- **Cart** — Slide-out cart sidebar with persistent localStorage storage
- **Checkout** — Stripe-style payment form with card validation and auto-formatting
- **Authentication** — Sign in / Sign up pages with Google & GitHub OAuth UI
- **Toast Notifications** — Animated success/error/info toasts for user feedback
- **Page Loader** — Animated progress bar on route transitions
- **Duplicate Prevention** — Can't add the same course twice, with notification feedback
- **Responsive** — Fully responsive design with mobile navigation menu

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS
- **Font**: Poppins (Google Fonts)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State**: React Context + localStorage persistence

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  page.tsx              # Homepage
  layout.tsx            # Root layout with providers
  globals.css           # Global styles
  store/
    page.tsx            # Store listing
    [id]/page.tsx       # Product detail
  checkout/page.tsx     # Checkout page
  login/page.tsx        # Sign in
  signup/page.tsx       # Sign up
components/
  Navbar.tsx            # Navigation bar
  Footer.tsx            # Footer
  CourseCard.tsx         # Course card component
  CartContext.tsx        # Cart state management
  CartSidebar.tsx        # Slide-out cart
  ToastProvider.tsx      # Toast notification system
  PageLoader.tsx         # Route transition loader
```

## Currency

All prices are displayed in Indian Rupees (₹).
