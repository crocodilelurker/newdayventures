import Link from "next/link";
import { Twitter, Github, Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 py-12 md:py-20 mt-auto">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 group mb-4">
                            <img src="/icon.svg" alt="NewDayVentures" className="w-6 h-6" />
                            <span className="text-xl font-bold tracking-tight text-gray-900">NewDay<span className="text-pink-500 font-medium">Ventures</span></span>
                        </Link>
                        <p className="text-gray-500 max-w-sm mb-6 leading-relaxed">
                            Premium course materials, study sheets, and guides designed specifically to help you master your subjects with pristine clarity.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 rounded-full bg-gray-50 text-gray-400 hover:bg-pink-50 hover:text-pink-500 transition-all border border-gray-100">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-gray-50 text-gray-400 hover:bg-pink-50 hover:text-pink-500 transition-all border border-gray-100">
                                <Github className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-gray-50 text-gray-400 hover:bg-pink-50 hover:text-pink-500 transition-all border border-gray-100">
                                <Instagram className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-gray-900 font-semibold mb-4">Resources</h3>
                        <ul className="flex flex-col gap-3">
                            <li><Link href="/store" className="text-gray-500 hover:text-pink-500 transition-colors text-sm">All Courses</Link></li>
                            <li><Link href="/store?category=pdf" className="text-gray-500 hover:text-pink-500 transition-colors text-sm">PDF Guides</Link></li>
                            <li><Link href="/store?category=notes" className="text-gray-500 hover:text-pink-500 transition-colors text-sm">Study Notes</Link></li>
                            <li><Link href="/free" className="text-gray-500 hover:text-pink-500 transition-colors text-sm">Free Materials</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-gray-900 font-semibold mb-4">Company</h3>
                        <ul className="flex flex-col gap-3">
                            <li><Link href="/about" className="text-gray-500 hover:text-pink-500 transition-colors text-sm">About Us</Link></li>
                            <li><Link href="/contact" className="text-gray-500 hover:text-pink-500 transition-colors text-sm">Contact</Link></li>
                            <li><Link href="/policy/privacy" className="text-gray-500 hover:text-pink-500 transition-colors text-sm">Privacy Policy</Link></li>
                            <li><Link href="/policy/terms" className="text-gray-500 hover:text-pink-500 transition-colors text-sm">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">© 2026 NewDayVentures. All rights reserved.</p>
                    <div className="flex gap-4 text-sm text-gray-500">
                        <span>Built with Next.js & Framer Motion</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
