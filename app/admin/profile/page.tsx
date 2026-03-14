"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Lock, Save, Eye, EyeOff, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

export default function AdminProfilePage() {
    const { data: session, status } = useSession();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPasswords, setShowPasswords] = useState(false);
    const [updating, setUpdating] = useState(false);
    const { showToast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated" && session?.user) {
            if (session.user.name) setName(session.user.name);
            if (session.user.email) setEmail(session.user.email);
        }
    }, [status, router, session]);

    if (status === "loading") {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium animate-pulse">Loading settings...</p>
            </div>
        );
    }

    if (!session?.user || (session.user as any).role !== "admin") {
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
                    email,
                    currentPassword: currentPassword || undefined,
                    newPassword: newPassword || undefined,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to update profile");
            }

            showToast("Admin profile updated successfully!", "success");
            setCurrentPassword("");
            setNewPassword("");
            
            router.refresh();
        } catch (error: any) {
            showToast(error.message, "error");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
        >
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-pink-600" />
                    Admin Profile Settings
                </h1>
                <p className="text-gray-500 mt-1">Manage your administrator account details and password.</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                    {/* Personal Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-50 pb-2 flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            Personal Information
                        </h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                                placeholder="Your full name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                                placeholder="admin@example.com"
                            />
                        </div>
                    </div>

                    {/* Password Section */}
                    <div className="space-y-4 pt-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-50 pb-2 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-gray-400" />
                            Change Password
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                                <input
                                    type={showPasswords ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                                    placeholder="••••••••"
                                />
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
                        className="flex items-center gap-2 px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
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
    );
}
