import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";
import CartSidebar from "@/components/CartSidebar";
import { ToastProvider } from "@/components/ToastProvider";
import AuthProvider from "@/components/AuthProvider";
import PageLoader from "@/components/PageLoader";

export const metadata: Metadata = {
  title: "NewDayVentures | Premium Course Materials",
  description: "Get the best online course materials, PDFs, notes, and sheets.",
};

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${poppins.className} antialiased bg-background text-foreground min-h-screen flex flex-col overflow-x-hidden selection:bg-pink-500/30 selection:text-pink-900`}
      >
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <PageLoader />
              <Navbar />
              <CartSidebar />
              <main className="grow pt-24 pb-10">
                {children}
              </main>
              <Footer />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
