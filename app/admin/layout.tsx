"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, BookOpen, Settings } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const linkClass = (href: string) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
        pathname === href ? 'bg-pink-50 text-pink-600' : 'text-gray-600 hover:bg-gray-50'
    }`;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {}
            <aside className="w-full md:w-64 bg-white border-r border-gray-100 shrink-0">
                <div className="p-6">
                    <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Admin<span className="text-pink-600">Panel</span></h2>
                    <p className="text-xs text-gray-500 mt-1 font-medium">Management Dashboard</p>
                </div>
                
                <nav className="px-4 py-2 flex flex-col gap-1">
                    <Link href="/admin" className={linkClass("/admin")}>
                        <LayoutDashboard className="w-5 h-5" /> Dashboard
                    </Link>
                    <Link href="/admin/materials" className={linkClass("/admin/materials")}>
                        <BookOpen className="w-5 h-5" /> Course Mgt.
                    </Link>
                    <Link href="/admin/users" className={linkClass("/admin/users")}>
                        <Users className="w-5 h-5" /> User Mgt.
                    </Link>
                </nav>
            </aside>

            {}
            <main className="flex-1 p-6 md:p-10 overflow-auto">
                {children}
            </main>
        </div>
    );
}
