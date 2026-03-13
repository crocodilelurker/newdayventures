"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronDown } from "lucide-react";
import CourseCard from "@/components/CourseCard";

const allMaterials = [
    { id: "1", title: "Advanced Data Structures & Algorithms Mastery", instructor: "Dr. Angela Yu, Coding Master", type: "Course", price: 529, rating: 4.8, students: 12504, image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80", category: "engineering" },
    { id: "2", title: "Complete System Design Architecture Guide", instructor: "Hussein Nasser", type: "PDF Guide", price: 499, rating: 4.9, students: 34201, image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80", category: "engineering" },
    { id: "3", title: "Machine Learning Math Essentials Bootcamp", instructor: "Krish Naik", type: "Study Notes", price: 399, rating: 4.7, students: 8904, image: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=800&q=80", category: "data-science" },
    { id: "4", title: "React & Next.js Full Stack Web Development", instructor: "Maximilian Schwarzmüller", type: "Course", price: 549, rating: 4.6, students: 45200, image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80", category: "engineering" },
    { id: "5", title: "Business Strategy Frameworks PDF", instructor: "HBR Group", type: "PDF Guide", price: 299, rating: 4.7, students: 2100, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", category: "business" },
    { id: "6", title: "UX/UI Design Principles Sheet", instructor: "Gary Simon", type: "Study Notes", price: 199, rating: 4.6, students: 1800, image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80", category: "design" },
];

const categories = [
    { id: "all", name: "All Categories" },
    { id: "engineering", name: "Software Engineering" },
    { id: "data-science", name: "Data Science" },
    { id: "business", name: "Business" },
    { id: "design", name: "Design" },
];

const resourceTypes = ["All", "Course", "PDF Guide", "Study Notes"];

export default function StorePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [activeType, setActiveType] = useState("All");

    const filteredMaterials = allMaterials.filter((item) => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === "all" || item.category === activeCategory;
        const matchesType = activeType === "All" || item.type === activeType;
        return matchesSearch && matchesCategory && matchesType;
    });

    return (
        <div className="container mx-auto px-6 md:px-12 py-12 bg-white min-h-screen">
            <div className="flex flex-col md:flex-row gap-10">

                {/* Sidebar Filters */}
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

                    {filteredMaterials.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredMaterials.map((material, index) => (
                                <motion.div
                                    key={material.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <CourseCard {...material} />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-2xl border border-gray-100">
                            <Filter className="w-12 h-12 text-gray-400 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No materials found</h3>
                            <p className="text-gray-500 max-w-sm">We couldn't find any materials matching your applied filters. Try adjusting your search criteria.</p>
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
