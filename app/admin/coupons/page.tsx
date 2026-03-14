"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Tag, Loader2, Power, ReceiptCent } from "lucide-react";

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [materials, setMaterials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [code, setCode] = useState("");
    const [discountPercent, setDiscountPercent] = useState<number>(50);
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
    const [applyToAll, setApplyToAll] = useState(true);

    useEffect(() => {
        fetchCoupons();
        fetchMaterials();
    }, []);

    const fetchCoupons = async () => {
        try {
            const res = await fetch("/api/admin/coupons");
            if (res.ok) {
                const data = await res.json();
                setCoupons(data);
            }
        } catch (error) {
            console.error("Failed to fetch coupons:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMaterials = async () => {
        try {
            const res = await fetch("/api/materials");
            if (res.ok) {
                const data = await res.json();
                setMaterials(data);
            }
        } catch (error) {
            console.error("Failed to fetch materials:", error);
        }
    };

    const handleCreateCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/coupons", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    code, 
                    discountPercent, 
                    applicableMaterials: applyToAll ? [] : selectedMaterials 
                })
            });

            if (res.ok) {
                setCode("");
                setDiscountPercent(50);
                setSelectedMaterials([]);
                setApplyToAll(true);
                setIsCreating(false);
                fetchCoupons();
            } else {
                const data = await res.json();
                alert(data.message || "Failed to create coupon.");
            }
        } catch (error) {
            console.error("Create coupon error:", error);
            alert("Something went wrong.");
        }
    };

    const toggleMaterialSelection = (id: string) => {
        setSelectedMaterials(prev => 
            prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
        );
    };

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/admin/coupons/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !currentStatus })
            });

            if (res.ok) {
                fetchCoupons();
            }
        } catch (error) {
            console.error("Toggle coupon error:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this coupon?")) return;
        
        try {
            const res = await fetch(`/api/admin/coupons/${id}`, {
                method: "DELETE"
            });

            if (res.ok) {
                fetchCoupons();
            }
        } catch (error) {
            console.error("Delete coupon error:", error);
        }
    };


    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <Loader2 className="w-10 h-10 text-pink-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium animate-pulse">Loading coupons...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-2">Discount Coupons</h1>
                    <p className="text-gray-500 font-medium">Create and manage marketing promo codes.</p>
                </div>
                {!isCreating && (
                    <button 
                        onClick={() => setIsCreating(true)}
                        className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide shadow-md shadow-gray-200 hover:bg-pink-600 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Create Coupon
                    </button>
                )}
            </div>

            {isCreating && (
                <div className="bg-white border border-gray-100 shadow-sm shadow-gray-100 rounded-3xl p-8 mb-8 animate-in fade-in slide-in-from-top-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Tag className="w-5 h-5 text-pink-500" /> New Promo Code
                    </h2>
                    <form onSubmit={handleCreateCoupon} className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Coupon Code</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    placeholder="e.g. LAUNCH50"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all text-gray-900 font-bold uppercase"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Discount Percentage (%)</label>
                                <input 
                                    type="number" 
                                    required 
                                    min="1" 
                                    max="100"
                                    value={discountPercent}
                                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all text-gray-900 font-bold"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <label className="flex items-center gap-3 mb-4 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={applyToAll}
                                    onChange={(e) => {
                                        setApplyToAll(e.target.checked);
                                        if (e.target.checked) setSelectedMaterials([]);
                                    }}
                                    className="w-5 h-5 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                                />
                                <span className="font-bold text-gray-900">Apply to entire platform</span>
                            </label>

                            {!applyToAll && (
                                <div className="mt-4 p-5 bg-gray-50 rounded-xl border border-gray-200 max-h-64 overflow-y-auto">
                                    <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Select Applicable Courses</h3>
                                    <div className="space-y-2">
                                        {materials.map(material => (
                                            <label key={material._id} className="flex items-start gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedMaterials.includes(material._id)}
                                                    onChange={() => toggleMaterialSelection(material._id)}
                                                    className="w-4 h-4 mt-0.5 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-900">{material.title}</p>
                                                    <p className="text-xs text-gray-500">{material.type}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    {selectedMaterials.length === 0 && (
                                        <p className="text-sm text-red-500 mt-2 font-medium">Please select at least one course.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button 
                                type="button" 
                                onClick={() => setIsCreating(false)}
                                className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={!applyToAll && selectedMaterials.length === 0}
                                className="bg-pink-500 text-white px-8 py-3 rounded-xl font-bold shadow-md shadow-pink-200 hover:bg-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Save Coupon
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Coupons List */}
            <div className="bg-white border border-gray-100 shadow-sm shadow-gray-100 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider text-xs font-bold border-b border-gray-100">
                                <th className="p-5 font-bold">Code</th>
                                <th className="p-5 font-bold">Discount</th>
                                <th className="p-5 font-bold">Scope</th>
                                <th className="p-5 font-bold">Status</th>
                                <th className="p-5 font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm">
                            {coupons.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-400 font-medium">
                                        <div className="flex flex-col items-center justify-center py-6">
                                            <ReceiptCent className="w-12 h-12 text-gray-200 mb-3" />
                                            <p>No coupons found. Create your first promo code!</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                coupons.map((coupon) => (
                                    <tr key={coupon._id} className="hover:bg-pink-50/30 transition-colors">
                                        <td className="p-5 font-black text-gray-900 tracking-wide text-lg">
                                            {coupon.code}
                                        </td>
                                        <td className="p-5 text-gray-700 font-bold">
                                            {coupon.discountPercent}% OFF
                                        </td>
                                        <td className="p-5 text-gray-500 font-medium">
                                            {coupon.applicableMaterials?.length > 0 ? "Specific Courses" : "All Platform"}
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase ${
                                                coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                                {coupon.isActive ? "Active" : "Disabled"}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleToggleActive(coupon._id, coupon.isActive)}
                                                    className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-200"
                                                    title={coupon.isActive ? "Disable Coupon" : "Enable Coupon"}
                                                >
                                                    <Power className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(coupon._id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 bg-red-50/0 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete Coupon"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
