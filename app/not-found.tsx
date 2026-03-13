"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center mt-[-40px]">
      {/* 404 Illustration Container */}
      <div className="relative mb-8 md:mb-12">
        {/* The Big Smile Motif */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-white border-12 border-gray-900 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center relative overflow-visible"
        >
          {/* Eyes */}
          <div className="flex gap-10 md:gap-14 mb-4 md:mb-6">
            <motion.div
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ repeat: Infinity, duration: 4, times: [0, 0.1, 0.2], delay: 1 }}
              className="w-4 h-6 md:w-5 md:h-9 bg-gray-900 rounded-full"
            />
            <motion.div
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ repeat: Infinity, duration: 4, times: [0, 0.1, 0.2], delay: 1.2 }}
              className="w-4 h-6 md:w-5 md:h-9 bg-gray-900 rounded-full"
            />
          </div>

          {/* Smiling Mouth - High Contrast */}
          <div className="w-24 md:w-32 h-16 relative">
            <svg viewBox="0 0 100 50" fill="none" className="w-full h-full drop-shadow-sm">
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                d="M10 10C10 10 25 40 50 40C75 40 90 10 90 10"
                stroke="#111827"
                strokeWidth="10"
                strokeLinecap="round"
              />
            </svg>
          </div>

        </motion.div>

        {/* Decorative Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-[80px] -z-10" />
      </div>

      {/* Text Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-2xl px-4"
      >
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
          Lost in the <span className="text-pink-500 relative">
            sauce?
            <span className="absolute bottom-1 left-0 w-full h-3 bg-pink-500/10 -z-10 rounded-full" />
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed mb-10 max-w-lg mx-auto">
          The page you're looking for has vanished into thin air. Don't worry, even the best explorers get lost sometimes.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link
            href="/"
            className="group w-full sm:w-auto px-10 py-4.5 bg-gray-900 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-pink-600 transition-all hover:shadow-[0_20px_40px_-10px_rgba(236,72,153,0.3)] hover:-translate-y-1 active:scale-95 shadow-xl shadow-gray-200"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Return to Main Page
          </Link>
          <Link
            href="/store"
            className="w-full sm:w-auto px-10 py-4.5 bg-white border-4 border-gray-900 text-gray-900 font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all hover:shadow-lg hover:-translate-y-1 active:scale-95"
          >
            <ShoppingBag className="w-5 h-5" />
            Explore Store
          </Link>
        </div>
      </motion.div>

      {/* Error Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-16 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full"
      >
        <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
        <span className="text-gray-500 text-xs font-black tracking-widest uppercase">
          Status: <span className="text-gray-900">NOT_FOUND</span> | Code: <span className="text-gray-900">VOID_000</span>
        </span>
      </motion.div>
    </div>
  );
}
