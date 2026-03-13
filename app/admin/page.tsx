"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, DollarSign, BookOpen, ShoppingBag, Eye } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/admin/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to load stats:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[400px]">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-20 text-red-500 font-medium">
                Failed to load admin statistics.
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Platform Overview</h1>
                <p className="text-gray-500">High-level insights into your platform's performance.</p>
            </div>

            {}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={`₹${stats.overview.totalRevenue.toLocaleString()}`} icon={DollarSign} color="text-green-600" bg="bg-green-50" />
                <StatCard title="Total Users" value={stats.overview.totalUsers} icon={Users} color="text-blue-600" bg="bg-blue-50" />
                <StatCard title="Total Courses" value={stats.overview.totalMaterials} icon={BookOpen} color="text-purple-600" bg="bg-purple-50" />
                <StatCard title="Total Orders" value={stats.overview.totalOrders} icon={ShoppingBag} color="text-pink-600" bg="bg-pink-50" />
            </div>

            {}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Course Purchase Stats</h2>
                </div>
                
                {stats.courseStats.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">No courses have been purchased yet.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-900 uppercase text-xs font-bold">
                                <tr>
                                    <th className="px-6 py-4">Course Title</th>
                                    <th className="px-6 py-4">Total Purchases</th>
                                    <th className="px-6 py-4">Buyers Directory</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.courseStats.map((course: any, idx: number) => (
                                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900 w-1/3">{course.title}</td>
                                        <td className="px-6 py-4 text-center sm:text-left">
                                            <span className="inline-flex items-center justify-center px-2.5 py-1 bg-green-50 text-green-700 font-bold rounded-lg text-xs">
                                                {course.purchases} sales
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs space-y-2">
                                            {course.buyers.map((b:any, i:number) => (
                                                <div key={i} className="flex flex-col bg-white border border-gray-100 p-2 rounded-md shadow-sm">
                                                    <span className="font-bold text-gray-900">{b.name}</span>
                                                    <span className="text-gray-500">{b.email}</span>
                                                </div>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-5">
            <div className={`w-14 h-14 ${bg} ${color} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon className="w-7 h-7" />
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
                <h3 className="text-2xl font-extrabold text-gray-900 leading-none">{value}</h3>
            </div>
        </div>
    );
}
