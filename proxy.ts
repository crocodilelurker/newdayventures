import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const isAdminPath = req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/api/admin');
        const isApiPath = req.nextUrl.pathname.startsWith('/api');
        const role = req.nextauth.token?.role;
        if (role === "admin" && !isAdminPath && !isApiPath) {
            return NextResponse.redirect(new URL('/admin', req.url));
        }
        if (isAdminPath && role !== "admin") {
            return NextResponse.redirect(new URL('/', req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;
                const isProtectedRoute = 
                    pathname.startsWith("/checkout") || 
                    pathname.startsWith("/profile") ||
                    pathname.startsWith("/admin") ||
                    pathname.startsWith("/api/orders") ||
                    pathname.startsWith("/api/admin") ||
                    pathname.startsWith("/api/user/access") ||
                    pathname.startsWith("/api/user/profile");

                if (isProtectedRoute) {
                    return !!token;
                }
                return true;
            },
        },
    }
);

export const config = {
    
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|icon.svg).*)",
    ],
};
