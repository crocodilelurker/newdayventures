"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, Star, Zap, Shield, FileText } from "lucide-react";
import CourseCard from "@/components/CourseCard";

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
  };

  const featuredMaterials = [
    {
      id: "1",
      title: "Advanced Data Structures & Algorithms Mastery",
      instructor: "Dr. Angela Yu, Coding Master",
      type: "Bestseller",
      price: 529,
      rating: 4.8,
      students: 12504,
      image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
    },
    {
      id: "2",
      title: "Complete System Design Architecture Guide",
      instructor: "Hussein Nasser",
      type: "Highest Rated",
      price: 499,
      rating: 4.9,
      students: 34201,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    },
    {
      id: "3",
      title: "Machine Learning Math Essentials Bootcamp",
      instructor: "Krish Naik",
      type: "Hot & New",
      price: 399,
      rating: 4.7,
      students: 8904,
      image: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=800&q=80",
    },
    {
      id: "4",
      title: "React & Next.js Full Stack Web Development",
      instructor: "Maximilian Schwarzmüller",
      type: "Bestseller",
      price: 549,
      rating: 4.6,
      students: 45200,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-36 md:pb-32 px-6 bg-gray-50 overflow-hidden">
        {/* Subtle patterned background or clean grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>

        <div className="container mx-auto max-w-6xl relative z-10 flex flex-col md:flex-row items-center gap-12">
          {/* Text Content */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex-1 flex flex-col"
          >
            <motion.h1 variants={item} className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.15] text-gray-900">
              Transform your life <br className="hidden md:block" />
              through <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-rose-400">education.</span>
            </motion.h1>

            <motion.p variants={item} className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-xl">
              Learners around the world are launching new careers, advancing in their fields, and enriching their lives with our premium courses.
            </motion.p>

            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/store" className="px-8 py-4 rounded-sm bg-gray-900 text-white font-bold text-md hover:bg-gray-800 transition-all text-center">
                Explore Courses
              </Link>
              <Link href="#features" className="px-8 py-4 rounded-sm bg-white text-gray-900 font-bold text-md border border-gray-300 hover:bg-gray-50 transition-all text-center">
                Learn More
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 50, duration: 1 }}
            className="flex-1 hidden md:block"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80" alt="Students learning" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 px-6 bg-white border-b border-gray-100 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2 text-gray-900">Trending Courses</h2>
            <p className="text-gray-600 text-base">Check out what others are learning this week.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredMaterials.map((material, index) => (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <CourseCard {...material} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features / Why Choose Us */}
      <section id="features" className="py-20 px-6 bg-gray-50 relative border-b border-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-extrabold mb-4 text-gray-900">Why learn with NewDayVentures?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">We focus on quality and clarity, removing the fluff so you can focus on mastering the concepts that matter.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Fast Learning", desc: "Our materials are optimized for quick comprehension and maximum retention in minimal time." },
              { icon: FileText, title: "Comprehensive", desc: "From high-level system architecture to lowest-level code implementations, we cover it all." },
              { icon: Shield, title: "Verified Quality", desc: "All resources are rigorously fact-checked and verified by Fortune 500 industry professionals." },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-gray-100 rounded-xl p-8 hover:shadow-lg transition-shadow text-center"
              >
                <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <feature.icon className="w-7 h-7 text-pink-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gray-900 border-t border-gray-800 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 relative"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Ready to start learning?</h2>
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">Join millions of learners, from beginners to experts, completely mastering a whole new set of skills.</p>

            <Link href="/store" className="px-10 py-5 font-bold text-lg bg-pink-500 hover:bg-pink-600 transition-colors rounded-sm inline-block">
              Explore the Store
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
