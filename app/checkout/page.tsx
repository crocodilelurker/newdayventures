"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/CartContext";
import { ArrowLeft, CreditCard, Lock, CheckCircle, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [expiry, setExpiry] = useState("");
    const [expiryError, setExpiryError] = useState("");
    const router = useRouter();
    const cvcRef = useRef<HTMLInputElement>(null);

    const validateExpiry = (formatted: string): string => {
        const digits = formatted.replace(/[^0-9]/g, "");
        if (digits.length < 4) return "";
        const month = parseInt(digits.slice(0, 2), 10);
        const year = parseInt("20" + digits.slice(2, 4), 10);
        if (month < 1 || month > 12) return "Invalid month";
        const now = new Date();
        const cardDate = new Date(year, month);
        if (cardDate <= now) return "Card has expired";
        return "";
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/[^0-9]/g, "");
        if (val.length > 4) val = val.slice(0, 4);
        if (val.length >= 3) {
            val = val.slice(0, 2) + " / " + val.slice(2);
        }
        setExpiry(val);
        setExpiryError(validateExpiry(val));
        if (val.length === 7 && !validateExpiry(val) && cvcRef.current) {
            cvcRef.current.focus();
        }
    };

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        const err = validateExpiry(expiry);
        if (err) { setExpiryError(err); return; }
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            clearCart();
        }, 2200);
    };


    if (isSuccess) {
        return (
            <div className="container mx-auto px-6 py-24 flex flex-col items-center justify-center min-h-[60vh] text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring" as const, stiffness: 120 }}
                    className="w-20 h-20 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mb-8"
                >
                    <CheckCircle className="w-10 h-10 text-green-500" />
                </motion.div>
                <h1 className="text-3xl font-light text-gray-900 mb-3">Payment Successful</h1>
                <p className="text-lg text-gray-500 font-light max-w-md mb-10 leading-relaxed">
                    Your materials have been added to your account. A receipt has been sent to your email.
                </p>
                <Link href="/" className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors">
                    Back to Home
                </Link>
            </div>
        );
    }


    if (items.length === 0) {
        return (
            <div className="container mx-auto px-6 py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
                <ShoppingBag className="w-14 h-14 text-gray-300 mb-6" />
                <h1 className="text-2xl font-light text-gray-900 mb-3">Your cart is empty</h1>
                <p className="text-gray-400 font-light mb-8">Add items before checking out.</p>
                <Link href="/store" className="text-pink-600 hover:text-pink-700 font-medium transition-colors">
                    Browse the Store →
                </Link>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
                {/* ─── LEFT: Order Summary (dark) ─── */}
                <div className="bg-gray-50 border-r border-gray-200 px-8 md:px-16 py-12 lg:py-16 order-2 lg:order-1">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-10 group text-sm font-light"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>

                    <div className="max-w-md">
                        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">NewDayVentures</h2>
                        <h1 className="text-3xl font-light text-gray-900 mb-8">Order Summary</h1>

                        {/* Items */}
                        <div className="space-y-5 mb-8 max-h-64 overflow-y-auto pr-2">
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-md bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-normal text-gray-800 line-clamp-1">{item.title}</p>
                                        <p className="text-xs text-gray-400">{item.type}</p>
                                    </div>
                                    <p className="text-sm text-gray-900 font-medium shrink-0">₹{item.price.toLocaleString("en-IN")}</p>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="border-t border-gray-200 pt-5 space-y-3 text-sm">
                            <div className="flex justify-between text-gray-500 font-light">
                                <span>Subtotal</span>
                                <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex justify-between text-gray-500 font-light">
                                <span>Tax</span>
                                <span>₹0.00</span>
                            </div>
                            <div className="flex justify-between text-gray-900 text-xl font-medium pt-4 border-t border-gray-200 mt-3">
                                <span>Total due today</span>
                                <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── RIGHT: Payment Form ─── */}
                <div className="px-8 md:px-16 py-12 lg:py-16 order-1 lg:order-2">
                    <div className="max-w-md mx-auto lg:mx-0">
                        <h1 className="text-2xl font-light text-gray-900 mb-8">Enter payment details</h1>

                        <form onSubmit={handlePayment} className="space-y-6">
                            {/* Email */}
                            <div>
                                <label className="block text-sm text-gray-600 mb-2">Email</label>
                                <input
                                    required
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all bg-white"
                                />
                            </div>

                            {/* Payment method */}
                            <div>
                                <label className="block text-sm text-gray-600 mb-3">Payment method</label>
                                <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-t-md bg-gray-50">
                                    <div className="w-4 h-4 rounded-full border-2 border-gray-900 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-gray-900"></div>
                                    </div>
                                    <CreditCard className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-800 font-medium">Card</span>
                                </div>

                                {/* Card information */}
                                <div className="border border-t-0 border-gray-300 rounded-b-md overflow-hidden">
                                    <div className="border-b border-gray-200">
                                        <label className="block text-xs text-gray-500 px-4 pt-3 pb-1">Card information</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="1234 1234 1234 1234"
                                            className="w-full px-4 pb-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none bg-white font-mono"
                                        />
                                    </div>
                                    <div className="flex border-b border-gray-200">
                                        <input
                                            required
                                            type="text"
                                            placeholder="MM / YY"
                                            value={expiry}
                                            onChange={handleExpiryChange}
                                            maxLength={7}
                                            className={`w-1/2 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none bg-white border-r border-gray-200 font-mono ${expiryError ? 'text-red-500' : ''}`}
                                        />
                                        <input
                                            ref={cvcRef}
                                            required
                                            type="password"
                                            placeholder="CVC"
                                            maxLength={4}
                                            className="w-1/2 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none bg-white font-mono"
                                        />
                                    </div>
                                    {expiryError && (
                                        <p className="px-4 py-2 text-xs text-red-500 font-medium bg-red-50">{expiryError}</p>
                                    )}

                                    {/* Cardholder name */}
                                    <div className="border-b border-gray-200">
                                        <label className="block text-xs text-gray-500 px-4 pt-3 pb-1">Cardholder name</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Full name on card"
                                            className="w-full px-4 pb-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none bg-white"
                                        />
                                    </div>

                                    {/* Country */}
                                    <div>
                                        <label className="block text-xs text-gray-500 px-4 pt-3 pb-1">Country or region</label>
                                        <select className="w-full px-4 pb-3 text-sm text-gray-900 focus:outline-none bg-white appearance-none cursor-pointer border-b border-gray-200">
                                            <option>India</option>
                                            <option>United States</option>
                                            <option>United Kingdom</option>
                                            <option>Canada</option>
                                            <option>Australia</option>
                                        </select>
                                        <input
                                            type="text"
                                            placeholder="PIN"
                                            className="w-full px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none bg-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Save info checkbox */}
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                                <div>
                                    <span className="text-sm text-gray-800 font-medium">Save my information for faster checkout</span>
                                    <p className="text-xs text-gray-400 mt-0.5">Pay securely at NewDayVentures and everywhere Link is accepted.</p>
                                </div>
                            </label>

                            {/* Submit */}
                            <motion.button
                                type="submit"
                                disabled={isProcessing}
                                whileHover={!isProcessing ? { scale: 1.005 } : {}}
                                whileTap={!isProcessing ? { scale: 0.995 } : {}}
                                className={`w-full py-3.5 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2
                                    ${isProcessing
                                        ? "bg-gray-700 text-gray-400 cursor-wait"
                                        : "bg-gray-900 hover:bg-gray-800 text-white"
                                    }`}
                            >
                                <AnimatePresence mode="wait">
                                    {isProcessing ? (
                                        <motion.span key="p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-gray-500 border-t-white rounded-full animate-spin" />
                                            Processing...
                                        </motion.span>
                                    ) : (
                                        <motion.span key="b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            Pay ₹{cartTotal.toLocaleString("en-IN")}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>

                            <p className="text-center text-xs text-gray-400 font-light flex items-center justify-center gap-1.5">
                                <Lock className="w-3 h-3" />
                                Secured by NewDayVentures · Demo mode, no real charges
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
