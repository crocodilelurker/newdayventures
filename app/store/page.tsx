"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronDown, Loader2 } from "lucide-react";
import CourseCard from "@/components/CourseCard";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const categories = [
    { id: "all", name: "All Categories" },
    { id: "engineering", name: "Software Engineering" },
    { id: "data-science", name: "Data Science" },
    { id: "business", name: "Business" },
    { id: "design", name: "Design" },
];

const resourceTypes = ["All", "Course", "PDF Guide", "Study Notes"];

function StoreContent() {
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get("search") || "";

    const [materials, setMaterials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [activeCategory, setActiveCategory] = useState("all");
    const [activeType, setActiveType] = useState("All");

    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(initialSearch);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500); 

        return () => clearTimeout(handler);
    }, [searchQuery]);
    useEffect(() => {
        const urlSearch = searchParams.get("search") || "";
        if (urlSearch !== debouncedSearchQuery) {
            setSearchQuery(urlSearch);
        }
    }, [searchParams]);

    useEffect(() => {
        async function fetchMaterials() {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (activeCategory !== "all") params.append("category", activeCategory);
                if (activeType !== "All") params.append("type", activeType);
                if (debouncedSearchQuery) params.append("search", debouncedSearchQuery);

                const res = await fetch(`/api/materials?${params.toString()}`);
                if (res.ok) {
                    const data = await res.json();
                    setMaterials(data);
                }
            } catch (error) {
                console.error("Failed to fetch materials:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchMaterials();
    }, [activeCategory, activeType, debouncedSearchQuery]);

    return (
        <div className="container mx-auto px-6 md:px-12 py-12 bg-white min-h-screen">
            <div className="flex flex-col md:flex-row gap-10">

                <aside className="w-full md:w-64 flex flex-col gap-8 shrink-0">
                    <div>
                        <h2 className="text-lg font-bold mb-3 text-gray-900">Search</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Find resources..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all text-gray-900 placeholder:text-gray-400 font-medium shadow-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold mb-3 text-gray-900">Categories</h2>
                        <div className="flex flex-col gap-1">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`text-left px-3 py-2 rounded-md text-sm font-semibold transition-all ${activeCategory === category.id
                                        ? "bg-pink-50 text-pink-600"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold mb-3 text-gray-900">Resource Type</h2>
                        <div className="flex flex-col gap-1">
                            {resourceTypes.map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setActiveType(type)}
                                    className={`text-left px-3 py-2 rounded-md text-sm font-semibold transition-all ${activeType === type
                                        ? "bg-pink-50 text-pink-600"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <h1 className="text-3xl font-extrabold text-gray-900">Discover Materials</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                            <span className="hidden sm:inline">Sort by:</span>
                            <button className="flex items-center gap-1 bg-white border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50 text-gray-700 transition-colors shadow-sm">
                                Popular <ChevronDown className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </div>

                    {/* Materials Grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24">
                            <Loader2 className="w-12 h-12 text-pink-500 animate-spin mb-4" />
                            <p className="text-gray-500 font-medium animate-pulse">Fetching courses...</p>
                        </div>
                    ) : materials.length > 0 ? (
                        <motion.div
                            variants={{
                                show: {
                                    transition: {
                                        staggerChildren: 0.1
                                    }
                                }
                            }}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {materials.map((material: any) => (
                                <CourseCard 
                                    key={material._id} 
                                    id={material._id}
                                    title={material.title}
                                    type={material.type}
                                    price={material.price}
                                    rating={material.rating}
                                    students={material.students}
                                    image={material.image}
                                    instructor={material.instructor}
                                />
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">Try adjusting your search or filters to find what you're looking for.</p>
                            <button
                                onClick={() => { setSearchQuery(""); setActiveCategory("all"); setActiveType("All"); }}
                                className="mt-6 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold shadow-sm rounded-full hover:bg-gray-50 hover:text-pink-600 transition-colors"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default function StorePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <Loader2 className="w-12 h-12 text-pink-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium animate-pulse">Loading Store...</p>
            </div>
        }>
            <StoreContent />
        </Suspense>
    );
}
