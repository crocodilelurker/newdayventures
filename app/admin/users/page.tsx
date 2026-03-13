"use client";

import { useState, useEffect } from "react";
import { Trash2, Search, User, ShieldAlert, Eye, X, Package, Clock, FileText } from "lucide-react";
import { useToast } from "@/components/ToastProvider";
import { format } from "date-fns";
import Link from "next/link";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const { showToast } = useToast();

    
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [userOrders, setUserOrders] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            showToast("Failed to load users", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId: string, userName: string) => {
        if (!confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                showToast(`User ${userName} deleted successfully.`, "success");
                setUsers(users.filter(u => u._id !== userId));
            } else {
                showToast("Failed to delete user", "error");
            }
        } catch (error) {
            showToast("Error deleting user", "error");
        }
    };

    const filteredUsers = users.filter((u) => 
        u.name.toLowerCase().includes(search.toLowerCase()) || 
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleViewDetails = async (userId: string) => {
        setIsModalOpen(true);
        setLoadingDetails(true);
        try {
            const res = await fetch(`/api/admin/users/${userId}/orders`);
            if (res.ok) {
                const data = await res.json();
                setSelectedUser(data.user);
                setUserOrders(data.orders);
            } else {
                showToast("Failed to fetch user details", "error");
                setIsModalOpen(false);
            }
        } catch (error) {
            showToast("An error occurred", "error");
            setIsModalOpen(false);
        } finally {
            setLoadingDetails(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">User Management</h1>
                    <p className="text-gray-500">View and manage all registered users on the platform.</p>
                </div>
                
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all font-medium text-gray-900"
                    />
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-8 h-8 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin"></div>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 flex flex-col items-center">
                        <User className="w-12 h-12 mb-3 text-gray-300" />
                        <p className="font-medium text-gray-900">No users found.</p>
                        <p className="text-sm">Try adjusting your search criteria.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-900 uppercase text-xs font-bold border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">User Details</th>
                                    <th className="px-6 py-4 hidden md:table-cell">Joined Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-linear-to-tr from-pink-500 to-rose-400 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{user.name}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell font-medium">
                                            {mounted ? format(new Date(user.createdAt), 'MMM dd, yyyy') : '...'}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button 
                                                onClick={() => handleViewDetails(user._id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors border border-blue-100"
                                            >
                                                <Eye className="w-3.5 h-3.5" /> Details
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(user._id, user.name)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors border border-red-100"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <User className="w-5 h-5 text-pink-500" />
                                User Dossier
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            {loadingDetails ? (
                                <div className="flex justify-center items-center py-20">
                                    <div className="w-8 h-8 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin"></div>
                                </div>
                            ) : selectedUser ? (
                                <div className="space-y-8">
                                    {}
                                    <div className="flex items-center gap-6 bg-pink-50 p-6 rounded-xl border border-pink-100">
                                        <div className="w-16 h-16 bg-linear-to-tr from-pink-500 to-rose-400 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-md">
                                            {selectedUser.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-extrabold text-gray-900">{selectedUser.name}</h3>
                                            <p className="text-gray-600 font-medium">{selectedUser.email}</p>
                                            <p className="text-xs text-gray-500 mt-2 font-medium">Joined: {mounted ? format(new Date(selectedUser.createdAt), 'MMMM dd, yyyy') : '...'}</p>
                                        </div>
                                    </div>

                                    {}
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                                            <Package className="w-5 h-5 text-gray-400" />
                                            Order History ({userOrders.length})
                                        </h4>
                                        
                                        {userOrders.length === 0 ? (
                                            <div className="bg-gray-50 border border-gray-100 rounded-xl p-8 text-center">
                                                <Clock className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                                                <p className="text-gray-500 font-medium text-sm">This user hasn't made any purchases yet.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {userOrders.map((order) => (
                                                    <div key={order._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                                        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between">
                                                            <div>
                                                                <p className="text-xs text-gray-500 uppercase font-semibold mb-0.5">Order Placed</p>
                                                                <p className="text-sm font-bold text-gray-900">
                                                                    {mounted ? format(new Date(order.createdAt), "MMM d, yyyy @ h:mm a") : '...'}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500 uppercase font-semibold mb-0.5">Total</p>
                                                                <p className="text-sm font-bold text-gray-900">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                                                            </div>
                                                            <div>
                                                                <span className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-full ${
                                                                    order.paymentStatus === 'completed' || order.paymentStatus === 'Completed'
                                                                    ? 'bg-green-100 text-green-700' 
                                                                    : 'bg-amber-100 text-amber-700'
                                                                }`}>
                                                                    {order.paymentStatus}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="divide-y divide-gray-100 bg-white">
                                                            {order.items.map((item: any) => (
                                                                <div key={item._id} className="p-4 flex gap-4 items-center">
                                                                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 border border-gray-100">
                                                                        <FileText className="w-5 h-5 text-gray-400" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-bold text-gray-900 leading-tight">
                                                                            {item.title}
                                                                        </p>
                                                                        <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded uppercase tracking-wider mt-1 inline-block">
                                                                            {item.type}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
