"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingCart, Star, Check } from "lucide-react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";

interface CourseCardProps {
    id: string;
    title: string;
    type: string;
    price: number;
    rating: number;
    students: number;
    image: string;
    color?: string;
    instructor?: string;
}

export default function CourseCard({
    id,
    title,
    type,
    price,
    rating,
    students,
    image,
    instructor = "NewDayVentures Instructors",
}: CourseCardProps) {
    const { addToCart, isInCart } = useCart();
    const { showToast } = useToast();
    const alreadyAdded = isInCart(id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const success = addToCart({ id, title, price, image, type });
        if (success) {
            showToast(`"${title}" added to cart`, 'success');
        } else {
            showToast(`"${title}" is already in your cart`, 'info');
        }
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer"
        >
            {/* Image Area */}
            <div className="relative h-44 w-full overflow-hidden border-b border-gray-100">
                <img
                    src={image}
                    alt={title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 z-20">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm shadow-sm text-gray-900 text-[10px] uppercase font-bold tracking-wider rounded-sm">
                        {type}
                    </span>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-5 flex flex-col grow">
                <Link href={`/store/${id}`} className="block grow group">
                    <h3 className="text-lg font-bold mb-1 group-hover:text-pink-600 transition-colors line-clamp-2 text-gray-900 leading-tight">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2 truncate">{instructor}</p>
                </Link>

                <div className="flex items-center gap-1.5 mb-3 mt-1">
                    <span className="text-sm font-bold text-amber-700">{rating}</span>
                    <div className="flex -space-x-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                        ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">({students.toLocaleString()})</span>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-extrabold text-gray-900">₹{price.toLocaleString('en-IN')}</span>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all ${alreadyAdded
                                ? 'bg-green-50 text-green-600 border border-green-200 cursor-default'
                                : 'bg-gray-50 hover:bg-pink-50 hover:text-pink-600 text-gray-600 border border-gray-200 group-hover:bg-pink-600 group-hover:text-white group-hover:border-pink-600'
                            }`}
                    >
                        {alreadyAdded ? (
                            <>
                                <Check className="w-3.5 h-3.5" />
                                Added
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="w-3.5 h-3.5" />
                                Add
                            </>
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
