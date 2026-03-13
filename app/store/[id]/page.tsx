"use client";

import { use, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    ArrowLeft, Star, ShoppingCart, CheckCircle2, Check,
    FileText, Clock, Download, Shield
} from "lucide-react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { useRouter } from "next/navigation";


const getMaterialDetails = (id: string) => {
    return {
        id,
        title: "Advanced Data Structures & Algorithms Mastery",
        instructor: "Dr. Angela Yu, Coding Master",
        type: "Course Bundle",
        price: 529,
        rating: 4.8,
        reviews: 328,
        students: 12504,
        image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&q=80",
        description: "Master the most critical data structures and algorithms required to ace top-tier coding interviews. This comprehensive bundle goes beyond theory, giving you practical implementations, pattern recognition techniques, and deep-dive explanations for complex topics.",
        highlights: [
            "120+ High-quality video explanations",
            "50+ Interactive coding exercises",
            "Comprehensive PDF notes for offline study",
            "Lifetime access & free updates"
        ],
        syllabus: [
            "Arrays, Strings & 2D Matrices",
            "HashMaps & Sets Deep Dive",
            "Linked Lists & Fast/Slow Pointers",
            "Stacks, Queues & Monotonic Stacks",
            "Trees, Tries & Graph Algorithms",
            "Dynamic Programming Patterns",
        ]
    };
};

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const material = getMaterialDetails(id);
    const [activeTab, setActiveTab] = useState("overview");
    const { addToCart, isInCart } = useCart();
    const { showToast } = useToast();
    const router = useRouter();
    const alreadyInCart = isInCart(material.id);

    if (!material) return <div className="p-20 text-center text-gray-600">Product not found</div>;

    const handleAddToCart = () => {
        const success = addToCart({
            id: material.id,
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
            id: material.id,
            title: material.title,
            price: material.price,
            image: material.image,
            type: material.type
        });
        router.push("/checkout");
    };

    return (
        <div className="container mx-auto px-6 md:px-12 py-10 bg-white min-h-screen">
            <Link href="/store" className="inline-flex items-center gap-2 text-pink-600 font-medium hover:text-pink-700 transition-colors mb-8 group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Store
            </Link>

            <div className="flex flex-col lg:flex-row gap-12 mb-20">

                {/* Left Column - Image & Visuals */}
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

                {/* Right Column - Details & Action */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:w-1/2 flex flex-col"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < Math.floor(material.rating) ? 'fill-amber-400 text-amber-500' : 'text-gray-200 fill-gray-200'}`} />
                            ))}
                        </div>
                        <span className="font-bold text-amber-700">{material.rating}</span>
                        <span className="text-sm text-gray-500">({material.reviews} reviews) • {material.students.toLocaleString()} students</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-extrabold mb-2 leading-tight text-gray-900">{material.title}</h1>
                    <p className="text-lg text-gray-600 mb-6">Created by <span className="font-semibold text-pink-600 cursor-pointer underline decoration-pink-200 underline-offset-4">{material.instructor}</span></p>

                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-4xl font-black text-gray-900">
                            ₹{material.price.toLocaleString('en-IN')}
                        </span>
                    </div>

                    <p className="text-gray-700 text-base leading-relaxed mb-8">
                        {material.description}
                    </p>

                    <div className="space-y-4 mb-10">
                        {material.highlights.map((highlight, index) => (
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

            {/* Syllubus / Content Section */}
            <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-8 md:p-12 mb-20 max-w-4xl mx-auto">
                <h2 className="text-2xl font-extrabold mb-8 text-gray-900">Course Curriculum</h2>
                <div className="space-y-3">
                    {material.syllabus.map((item, index) => (
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
