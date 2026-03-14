"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Search, User, LogOut, LayoutDashboard } from "lucide-react";
import { useCart } from "@/components/CartContext";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const { data: session } = useSession();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { items, setIsCartOpen } = useCart();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isAdmin = (session?.user as any)?.role === "admin";

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/store?search=${encodeURIComponent(searchQuery.trim())}`);
            setMobileMenuOpen(false);
        }
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-white/95 backdrop-blur-md border-b border-gray-100 py-3 shadow-md"
                : "bg-white border-b border-gray-100 py-4 shadow-sm"
                }`}
        >
            <div className="container mx-auto px-6 md:px-12 flex items-center justify-between gap-6">
                <Link href="/" className="flex items-center gap-2 group shrink-0">
                    <img src="/icon.svg" alt="NewDayVentures" className="w-8 h-8" />
                    <span className="text-2xl font-bold tracking-tight text-gray-900">NewDay<span className="text-pink-500 font-medium">Ventures</span></span>
                </Link>
                <div className="hidden md:flex flex-1 max-w-2xl px-8">
                    <form onSubmit={handleSearchSubmit} className="relative w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search for anything..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-gray-800 placeholder:text-gray-400 font-medium"
                        />
                    </form>
                </div>
                <nav className="hidden md:flex items-center gap-6 shrink-0">
                    {!isAdmin && (
                        <>
                            <Link href="/store" className="text-sm font-medium text-gray-600 hover:text-pink-600 transition-colors">Store</Link>
                        </>
                    )}
                    
                    {isAdmin && (
                        <Link href="/admin" className="text-sm font-medium text-pink-600 hover:text-pink-700 transition-colors flex items-center gap-1">
                            <LayoutDashboard className="w-4 h-4" />
                            Admin
                        </Link>
                    )}

                    <div className="h-6 w-px bg-gray-200 mx-2"></div>

                    {session ? (
                        <div className="flex items-center gap-4">
                            <Link href="/profile" className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-pink-600 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                                    <User className="w-4 h-4" />
                                </div>
                                <span className="max-w-[100px] truncate">{session.user?.name || "Profile"}</span>
                            </Link>
                            <button 
                                onClick={() => signOut()}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                title="Sign Out"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link href="/login" className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors">
                                Log in
                            </Link>
                            <Link href="/signup" className="px-5 py-2 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
                                Sign up
                            </Link>
                        </div>
                    )}

                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-2 text-gray-500 hover:text-pink-600 transition-colors group ml-2"
                    >
                        <ShoppingCart className="w-6 h-6" />
                        <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center group-hover:bg-pink-600 transition-colors shadow-sm">
                            {items.length}
                        </span>
                    </button>
                </nav>

                {/* Mobile menu button */}
                <button
                    className="md:hidden p-2 text-gray-600 hover:text-pink-600"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-gray-100 overflow-hidden shadow-xl"
                    >
                        <div className="px-6 py-4 flex flex-col gap-4">
                            <form onSubmit={handleSearchSubmit} className="relative w-full mb-2">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search for anything..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-gray-800"
                                />
                            </form>
                            {!isAdmin && (
                                <Link href="/store" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-700 hover:text-pink-600">Store</Link>
                            )}
                            
                            {isAdmin && (
                                <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-pink-600 hover:text-pink-700">Admin Dashboard</Link>
                            )}

                            {session ? (
                                <>
                                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-700 hover:text-pink-600 border-t border-gray-100 pt-4">My Profile</Link>
                                    <button 
                                        onClick={() => { setMobileMenuOpen(false); signOut(); }}
                                        className="text-lg font-medium text-red-500 text-left"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-center rounded-lg border border-gray-300 text-gray-700 font-semibold">Log in</Link>
                                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-center rounded-lg bg-gray-900 text-white font-semibold">Sign up</Link>
                                </div>
                            )}

                            <button
                                onClick={() => { setMobileMenuOpen(false); setIsCartOpen(true); }}
                                className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-pink-600 mt-2 pt-4 border-t border-gray-100 w-full text-left"
                            >
                                <ShoppingCart className="w-5 h-5 text-gray-500" />
                                Bag ({items.length})
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
