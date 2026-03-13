import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const isAdminPath = req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/api/admin');
        const isApiPath = req.nextUrl.pathname.startsWith('/api');
        const role = req.nextauth.token?.role;

        // Redirect Admin away from public routes
        if (role === "admin" && !isAdminPath && !isApiPath) {
            return NextResponse.redirect(new URL('/admin', req.url));
        }

        // Protect admin paths from non-admins
        if (isAdminPath && role !== "admin") {
            return NextResponse.redirect(new URL('/', req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;
                
                // Routes that REQUIRE authentication
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
                
                // All other routes are public (including non-existent routes that should show 404)
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
