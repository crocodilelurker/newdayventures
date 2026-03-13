"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, User, Clock, FileText, ArrowRight, Settings, Lock, Save, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<"orders" | "settings">("orders");
    const [name, setName] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPasswords, setShowPasswords] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [accessingId, setAccessingId] = useState<string | null>(null);
    const { showToast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated" && session?.user?.name) {
            setName(session.user.name);
        }
    }, [status, router, session]);

    useEffect(() => {
        let isMounted = true;
        
        async function fetchOrders() {
            if (status === "authenticated") {
                try {
                    const res = await fetch("/api/orders");
                    if (res.ok) {
                        const data = await res.json();
                        if (isMounted) setOrders(data);
                    }
                } catch (error) {
                    console.error("Failed to fetch orders:", error);
                } finally {
                    if (isMounted) setLoading(false);
                }
            } else if (status === "unauthenticated") {
                if (isMounted) setLoading(false);
            }
        }
        
        fetchOrders();
        
        return () => {
            isMounted = false;
        };
    }, [status]);


    if (status === "loading" || loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium animate-pulse">Loading your profile...</p>
            </div>
        );
    }

    if (!session?.user) {
        return null; 
    }

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    currentPassword: currentPassword || undefined,
                    newPassword: newPassword || undefined,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to update profile");
            }

            showToast("Profile updated successfully!", "success");
            setCurrentPassword("");
            setNewPassword("");
            
            
            router.refresh();
        } catch (error: any) {
            showToast(error.message, "error");
        } finally {
            setUpdating(false);
        }
    };

    const handleAccessMaterial = async (materialId: string, title: string) => {
        setAccessingId(materialId);
        try {
            const res = await fetch(`/api/user/access/${materialId}`);
            const data = await res.json();
            
            if (res.ok && data.accessLink) {
                
                window.open(data.accessLink, '_blank');
            } else {
                throw new Error(data.message || "Could not access material");
            }
        } catch (error: any) {
            showToast(error.message, "error");
        } finally {
            setAccessingId(null);
        }
    };

    return (
        <div className="container mx-auto px-6 max-w-5xl py-12">
            
            {}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                    <User className="w-10 h-10" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-900">{session.user.name}</h1>
                    <p className="text-gray-500 mt-1">{session.user.email}</p>
                </div>
                <div className="flex gap-2 bg-gray-50 p-1 rounded-xl">
                    <button 
                        onClick={() => setActiveSection("orders")}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            activeSection === "orders" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                        }`}
                    >
                        Orders
                    </button>
                    <button 
                        onClick={() => setActiveSection("settings")}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            activeSection === "settings" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                        }`}
                    >
                        Settings
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeSection === "orders" ? (
                    <motion.div
                        key="orders"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Package className="w-6 h-6 text-pink-500" />
                            Purchase History
                        </h2>

            {orders.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No purchases yet</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">You haven't purchased any course materials yet. Browse our store to find what you need.</p>
                    <Link href="/store" className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors">
                        Explore Store
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order, index) => (
                        <motion.div 
                            key={order._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                        >
                            {}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between">
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Order Placed</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {format(new Date(order.createdAt), "MMMM d, yyyy")}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Total</p>
                                        <p className="text-sm font-medium text-gray-900">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Order #</p>
                                        <p className="text-sm font-medium text-gray-900">{order._id.slice(-8).toUpperCase()}</p>
                                    </div>
                                </div>
                                <div>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                        order.paymentStatus === 'completed' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-amber-100 text-amber-700'
                                    }`}>
                                        {order.paymentStatus.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            
                            {}
                            <div className="divide-y divide-gray-100">
                                {order.items.map((item: any) => (
                                    <div key={item._id} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                        <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center shrink-0">
                                            <FileText className="w-6 h-6 text-pink-500" />
                                        </div>
                                        <div className="flex-1">
                                            <Link href={`/store/${item.material}`} className="text-lg font-bold text-gray-900 hover:text-pink-600 transition-colors line-clamp-1">
                                                {item.title}
                                            </Link>
                                            <div className="flex gap-3 text-sm text-gray-500 mt-1">
                                                <span className="font-medium bg-gray-100 px-2 py-0.5 rounded">{item.type}</span>
                                            </div>
                                        </div>
                                        <div className="shrink-0 flex items-center gap-2">
                                            <button 
                                                onClick={() => handleAccessMaterial(item.material, item.title)}
                                                disabled={accessingId === item.material}
                                                className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-900 hover:bg-gray-800 rounded-lg text-sm font-bold text-white transition-colors shadow-sm disabled:opacity-50"
                                            >
                                                {accessingId === item.material ? (
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                                                ) : (
                                                    <Lock className="w-4 h-4 shrink-0" />
                                                )}
                                                {accessingId === item.material ? "Verifying..." : "Access Material"}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
        ) : (
            <motion.div
                key="settings"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="max-w-2xl mx-auto"
            >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Settings className="w-6 h-6 text-pink-500" />
                    Account Settings
                </h2>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                        {}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-50 pb-2">Personal Information</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-white border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                                        placeholder="Your full name"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    value={session.user.email || ""}
                                    disabled
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-sm text-gray-500 cursor-not-allowed"
                                />
                                <p className="text-[11px] text-gray-400 mt-1.5">Email address cannot be changed</p>
                            </div>
                        </div>

                        {}
                        <div className="space-y-4 pt-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-50 pb-2 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-gray-400" />
                                Change Password
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords ? "text" : "password"}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords(!showPasswords)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <p className="text-[11px] text-gray-400">Leave password fields empty if you don't want to change it</p>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={updating}
                            className="flex items-center gap-2 px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {updating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        )}
    </AnimatePresence>
</div>
);
}
