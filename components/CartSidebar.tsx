"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, ArrowRight, Trash2 } from "lucide-react";
import { useCart } from "./CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartSidebar() {
    const { isCartOpen, setIsCartOpen, items, removeFromCart, cartTotal } = useCart();
    const router = useRouter();

    const handleCheckout = () => {
        setIsCartOpen(false);
        router.push("/checkout");
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-60"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white border-l border-gray-200 z-70 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <ShoppingCart className="w-5 h-5 text-pink-500" />
                                <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
                                <span className="bg-pink-50 text-pink-600 text-xs py-1 px-2.5 rounded-full font-bold">
                                    {items.length} items
                                </span>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                                    <ShoppingCart className="w-12 h-12 mb-4 opacity-30" />
                                    <p className="text-lg font-bold mb-2 text-gray-900">Your cart is empty</p>
                                    <p className="text-sm mb-6 max-w-[250px]">Looks like you haven't added any premium materials yet.</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="text-pink-600 hover:text-pink-700 transition-colors font-bold"
                                    >
                                        Continue Browsing
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        key={item.id}
                                        className="flex gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm group relative"
                                    >
                                        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex flex-col justify-between flex-1 py-1">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-sm line-clamp-2 pr-6 leading-tight mb-1">{item.title}</h3>
                                                <p className="text-xs text-gray-500 font-medium">{item.type}</p>
                                            </div>
                                            <div className="font-bold text-gray-900">
                                                ₹{item.price.toLocaleString('en-IN')}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-white">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-gray-500 font-medium tracking-wide text-sm bg-gray-50 px-3 py-1 rounded-full">Order Total</span>
                                    <span className="text-2xl font-black text-gray-900">₹{cartTotal.toLocaleString('en-IN')}</span>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                                >
                                    Secure Checkout
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
