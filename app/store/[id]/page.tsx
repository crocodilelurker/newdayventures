"use client";

import { use, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    ArrowLeft, Star, ShoppingCart, CheckCircle2, Check,
    FileText, Clock, Download, Shield
} from "lucide-react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [material, setMaterial] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [ratingLoading, setRatingLoading] = useState(false);
    const [userRating, setUserRating] = useState<number | null>(null);
    const { addToCart, isInCart } = useCart();
    const { showToast } = useToast();
    const router = useRouter();

    useEffect(() => {
        async function fetchMaterial() {
            try {
                const res = await fetch(`/api/materials/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setMaterial(data);
                }
            } catch (error) {
                console.error("Failed to fetch material:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchMaterial();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-pink-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium animate-pulse">Loading course details...</p>
            </div>
        );
    }

    if (!material) return <div className="p-20 text-center text-gray-600">Product not found</div>;

    const alreadyInCart = isInCart(material._id || material.id);

    const handleAddToCart = () => {
        const success = addToCart({
            id: material._id || material.id,
            title: material.title,
            price: material.price,
            image: material.image,
            type: material.type
        });
        if (success) {
            showToast(`"${material.title}" added to cart`, 'success');
        } else {
            showToast(`"${material.title}" is already in your cart`, 'info');
        }
    };

    const handleBuyNow = () => {
        addToCart({
            id: material._id || material.id,
            title: material.title,
            price: material.price,
            image: material.image,
            type: material.type
        });
        router.push("/checkout");
    };
    const handleRating = async (score: number) => {
        setRatingLoading(true);
        try {
            const res = await fetch(`/api/materials/${id}/rate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ score })
            });

            if (res.ok) {
                const data = await res.json();
                setMaterial({ ...material, rating: data.rating, reviews: data.reviews });
                setUserRating(score);
                showToast("Rating submitted successfully!", "success");
            } else if (res.status === 401) {
                showToast("Please log in to rate this course.", "error");
            } else {
                const data = await res.json();
                showToast(data.message || "Failed to submit rating", "error");
            }
        } catch (error) {
            console.error("Rating error:", error);
            showToast("An error occurred while rating.", "error");
        } finally {
            setRatingLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-6 md:px-12 py-10 bg-white min-h-screen">
            <Link href="/store" className="inline-flex items-center gap-2 text-pink-600 font-medium hover:text-pink-700 transition-colors mb-8 group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Store
            </Link>

            <div className="flex flex-col lg:flex-row gap-12 mb-20">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:w-1/2 flex flex-col gap-6"
                >
                    <div className="relative rounded-xl overflow-hidden aspect-4/3 border border-gray-200 shadow-md">
                        <img src={material.image} alt={material.title} className="object-cover w-full h-full" />
                        <div className="absolute top-4 left-4 z-20">
                            <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-gray-900 shadow-sm text-xs font-bold rounded-sm uppercase tracking-wide">
                                {material.type}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 bg-white border border-gray-200 shadow-sm rounded-xl p-4 flex flex-col items-center justify-center text-center">
                            <Clock className="w-6 h-6 text-pink-500 mb-2" />
                            <span className="text-xl font-bold text-gray-900">24h+</span>
                            <span className="text-xs text-gray-500 font-medium tracking-wide">VIDEO</span>
                        </div>
                        <div className="flex-1 bg-white border border-gray-200 shadow-sm rounded-xl p-4 flex flex-col items-center justify-center text-center">
                            <Download className="w-6 h-6 text-pink-500 mb-2" />
                            <span className="text-xl font-bold text-gray-900">PDF</span>
                            <span className="text-xs text-gray-500 font-medium tracking-wide">INCLUDED</span>
                        </div>
                        <div className="flex-1 bg-white border border-gray-200 shadow-sm rounded-xl p-4 flex flex-col items-center justify-center text-center">
                            <Shield className="w-6 h-6 text-pink-500 mb-2" />
                            <span className="text-xl font-bold text-gray-900">Life</span>
                            <span className="text-xs text-gray-500 font-medium tracking-wide">ACCESS</span>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:w-1/2 flex flex-col"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => {
                                const roundedRating = material.rating ? Math.round(material.rating) : 0;
                                return (
                                    <Star 
                                        key={star} 
                                        className={`w-5 h-5 ${star <= roundedRating ? 'fill-amber-400 text-amber-500' : 'text-gray-200 fill-gray-200'}`} 
                                    />
                                );
                            })}
                        </div>
                        <span className="font-bold text-lg text-amber-700">{material.rating ? material.rating.toFixed(1) : "0.0"}</span>
                        <span className="text-sm text-gray-500 font-medium">({material.reviews || 0} reviews) • {(material.students || 0).toLocaleString()} students</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-extrabold mb-2 leading-tight text-gray-900">{material.title}</h1>
                    <p className="text-lg text-gray-600 mb-6">Created by <span className="font-semibold text-pink-600 cursor-pointer underline decoration-pink-200 underline-offset-4">{material.instructor}</span></p>

                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-4xl font-black text-gray-900">
                            ₹{(material.price || 0).toLocaleString('en-IN')}
                        </span>
                    </div>

                    <p className="text-gray-700 text-base leading-relaxed mb-8">
                        {material.description}
                    </p>

                    <div className="space-y-4 mb-10">
                        {(material.highlights || []).map((highlight: any, index: number) => (
                            <div key={index} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-gray-800 shrink-0 mt-0.5" />
                                <span className="text-gray-700">{highlight}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                        <button
                            onClick={handleAddToCart}
                            className={`flex-1 py-4 font-bold rounded-sm flex items-center justify-center gap-2 transition-all shadow-md ${alreadyInCart
                                ? 'bg-green-50 text-green-600 border-2 border-green-200 hover:bg-green-100 shadow-none'
                                : 'bg-pink-500 hover:bg-pink-600 text-white hover:shadow-lg'
                                }`}
                        >
                            {alreadyInCart ? (
                                <>
                                    <Check className="w-5 h-5" />
                                    Added to Cart
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="w-5 h-5" />
                                    Add to Cart
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleBuyNow}
                            className="flex-1 py-4 bg-white border-2 border-gray-900 hover:bg-gray-50 text-gray-900 font-bold rounded-sm flex items-center justify-center transition-colors shadow-sm"
                        >
                            Buy Now
                        </button>
                    </div>
                </motion.div>
            </div>
            <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-8 my-16 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                    <h2 className="text-xl font-extrabold text-gray-900 mb-1">Rate this Course</h2>
                    <p className="text-gray-500 text-sm">Your feedback helps other students choose the right learning path.</p>
                </div>
                <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            disabled={ratingLoading}
                            onClick={() => handleRating(star)}
                            className="focus:outline-none disabled:opacity-50 transition-transform hover:scale-110 active:scale-95 group"
                            title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        >
                            <Star className={`w-10 h-10 transition-colors ${userRating && star <= userRating ? 'fill-amber-400 text-amber-500' : 'text-gray-200 fill-gray-200'} group-hover:fill-amber-300 group-hover:text-amber-400`} />
                        </button>
                    ))}
                </div>
            </div>
            <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-8 md:p-12 mb-20 max-w-4xl mx-auto">
                <h2 className="text-2xl font-extrabold mb-8 text-gray-900">Course Curriculum</h2>
                <div className="space-y-3">
                    {(material.syllabus || []).map((item: any, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="group flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer last:border-0"
                        >
                            <div className="w-10 h-10 rounded-sm bg-pink-50 text-pink-600 flex items-center justify-center font-bold shrink-0">
                                {index + 1}
                            </div>
                            <div className="flex-1 font-semibold text-lg text-gray-800 transition-colors">
                                {item}
                            </div>
                            <FileText className="w-5 h-5 text-gray-400 group-hover:text-pink-500 transition-colors" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

