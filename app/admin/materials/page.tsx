"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Trash2, Edit, X, Save, Users, Calendar, Mail, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ToastProvider";

const initialForm = {
    title: "", instructor: "NewDayVentures", type: "Course", price: 0, 
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80", 
    category: "engineering", description: "", rating: 5, reviews: 0, students: 0,
    accessLink: ""
};

export default function AdminMaterialsPage() {
    const [materials, setMaterials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const { showToast } = useToast();
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>(initialForm);
    const [saving, setSaving] = useState(false);

    // Buyers Modal State
    const [isBuyersModalOpen, setIsBuyersModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [buyers, setBuyers] = useState<any[]>([]);
    const [loadingBuyers, setLoadingBuyers] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            const res = await fetch('/api/admin/materials');
            if (res.ok) {
                const data = await res.json();
                setMaterials(data);
            }
        } catch (error) {
            showToast("Failed to load materials", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;

        try {
            const res = await fetch(`/api/admin/materials/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast(`Deleted ${title}`, "success");
                setMaterials(materials.filter(m => m._id !== id));
            } else {
                showToast("Failed to delete", "error");
            }
        } catch (error) {
            showToast("Error deleting material", "error");
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const url = editId ? `/api/admin/materials/${editId}` : `/api/admin/materials`;
            const method = editId ? 'PUT' : 'POST';
            
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                showToast(`Course ${editId ? 'updated' : 'created'} successfully!`, "success");
                setIsModalOpen(false);
                fetchMaterials(); // refresh data
            } else {
                showToast("Failed to save course", "error");
            }
        } catch (error) {
            showToast("Error saving course", "error");
        } finally {
            setSaving(false);
        }
    };

    const openCreate = () => {
        setEditId(null);
        setFormData(initialForm);
        setIsModalOpen(true);
    };

    const openEdit = (material: any) => {
        setEditId(material._id);
        setFormData({ ...material });
        setIsModalOpen(true);
    };

    const openBuyers = async (material: any) => {
        setSelectedCourse(material);
        setIsBuyersModalOpen(true);
        setLoadingBuyers(true);
        try {
            const res = await fetch(`/api/admin/materials/${material._id}/buyers`);
            if (res.ok) {
                const data = await res.json();
                setBuyers(data.buyers);
            } else {
                showToast("Failed to fetch buyers", "error");
                setIsBuyersModalOpen(false);
            }
        } catch (error) {
            showToast("An error occurred", "error");
            setIsBuyersModalOpen(false);
        } finally {
            setLoadingBuyers(false);
        }
    };

    const filteredMaterials = materials.filter((m) => 
        m.title.toLowerCase().includes(search.toLowerCase()) || 
        m.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Course Management</h1>
                    <p className="text-gray-500">Add, edit, and oversee all platform materials.</p>
                </div>
                
                <div className="flex w-full sm:w-auto gap-3">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all font-medium text-gray-900"
                        />
                    </div>
                    <button 
                        onClick={openCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white font-bold rounded-lg hover:bg-pink-600 transition-colors shrink-0"
                    >
                        <Plus className="w-5 h-5" /> Add Course
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-8 h-8 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-900 uppercase text-xs font-bold border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Title & Type</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Pricing</th>
                                    <th className="px-6 py-4 text-center">Buyers</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMaterials.map((m) => (
                                    <tr key={m._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-10 rounded-md overflow-hidden shrink-0 border border-gray-100">
                                                    <img src={m.image} alt={m.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 leading-tight">{m.title}</p>
                                                    <p className="text-[10px] text-pink-600 font-bold mt-1 bg-pink-50 inline-block px-1.5 py-0.5 rounded-sm uppercase tracking-wider">{m.type}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-700 capitalize">{m.category}</td>
                                        <td className="px-6 py-4 font-extrabold text-gray-900">₹{m.price.toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => openBuyers(m)}
                                                className="group inline-flex flex-col items-center gap-1 hover:text-pink-600 transition-colors"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-pink-50 transition-colors border border-gray-100 group-hover:border-pink-100">
                                                    <Users className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="text-[10px] font-bold">List</span>
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button 
                                                onClick={() => openEdit(m)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors border border-blue-100"
                                            >
                                                <Edit className="w-3.5 h-3.5" /> Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(m._id, m.title)}
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10">
                            <h2 className="text-xl font-bold text-gray-900">{editId ? 'Edit Course' : 'Create New Course'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Course Title</label>
                                    <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Resource Type</label>
                                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white">
                                        <option>Course</option><option>Course Bundle</option><option>PDF Guide</option><option>Study Notes</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Category</label>
                                    <input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Price (₹)</label>
                                    <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-gray-700">Image URL</label>
                                    <input required value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-gray-700">Secret Access Link <span className="text-xs text-pink-600 font-normal ml-2">(Revealed only after purchase)</span></label>
                                    <input placeholder="e.g. https://drive.google.com/..." value={formData.accessLink || ""} onChange={e => setFormData({...formData, accessLink: e.target.value})} className="w-full px-4 py-2 border border-pink-200 bg-pink-50/30 rounded-lg text-sm text-gray-900 focus:ring-pink-500" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-gray-700">Description</label>
                                    <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"></textarea>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-pink-500 text-white hover:bg-pink-600 transition-colors disabled:opacity-50">
                                    {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                                    {saving ? 'Saving...' : 'Save Course'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Buyers Modal */}
            {isBuyersModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 leading-tight">Course Buyers</h2>
                                    <p className="text-xs text-gray-500 font-medium truncate max-w-[300px]">{selectedCourse?.title}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsBuyersModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 font-poppins">
                            {loadingBuyers ? (
                                <div className="flex justify-center items-center py-20">
                                    <div className="w-8 h-8 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin"></div>
                                </div>
                            ) : buyers.length === 0 ? (
                                <div className="text-center py-12 flex flex-col items-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                        <TrendingUp className="w-8 h-8 text-gray-200" />
                                    </div>
                                    <p className="font-bold text-gray-900">No sales recorded yet</p>
                                    <p className="text-sm text-gray-500">Sales for this material will appear here once users complete checkout.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-pink-50 p-4 rounded-xl border border-pink-100">
                                            <p className="text-xs text-pink-600 font-bold uppercase tracking-wider mb-1">Total Sales</p>
                                            <p className="text-2xl font-black text-pink-700">{buyers.length}</p>
                                        </div>
                                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Revenue</p>
                                            <p className="text-2xl font-black text-blue-700">₹{(buyers.reduce((acc, b) => acc + (b.price || 0), 0)).toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-widest border-b border-gray-100">
                                                <tr>
                                                    <th className="px-4 py-3">Customer</th>
                                                    <th className="px-4 py-3">Purchase Date</th>
                                                    <th className="px-4 py-3 text-right">Price</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {buyers.map((buyer, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="px-4 py-3">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-gray-900 text-sm">{buyer.user?.name || 'Unknown User'}</span>
                                                                <span className="text-[11px] text-gray-500 flex items-center gap-1">
                                                                    <Mail className="w-3 h-3" /> {buyer.user?.email || 'No email'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                                                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                                {mounted ? format(new Date(buyer.purchaseDate), 'MMM dd, yyyy') : '...'}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <span className="font-bold text-gray-900">₹{buyer.price?.toLocaleString('en-IN')}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
