import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // 1. Handle API routes under /api/admin
    if (pathname.startsWith("/api/admin")) {
      // Allow verify-login-otp to pass through if they have a credentials session (but not yet 2FA verified)
      if (pathname.startsWith("/api/admin/auth/2fa/verify-login-otp")) {
        if (!token) {
          return NextResponse.json(
            { success: false, error: "Not authenticated" },
            { status: 401 }
          );
        }
        return NextResponse.next();
      }

      // For all other /api/admin routes, require session + 2FA verified
      if (!token) {
        return NextResponse.json(
          { success: false, error: "Not authenticated" },
          { status: 401 }
        );
      }

      if (token.requires2FA && !token.is2FAVerified) {
        return NextResponse.json(
          { success: false, error: "2FA verification required" },
          { status: 403 }
        );
      }

      return NextResponse.next();
    }

    // 2. Handle page routes under /admin
    // If user is trying to access the login page
    if (pathname.startsWith("/admin/login")) {
      // If already authenticated and 2FA is verified (or not required), redirect to dashboard
      if (token && (!token.requires2FA || token.is2FAVerified)) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      return NextResponse.next();
    }

    // If 2FA is active but not yet verified, redirect to OTP verify page
    if (token?.requires2FA && !token?.is2FAVerified && !pathname.startsWith("/admin/verify-otp")) {
      return NextResponse.redirect(new URL("/admin/verify-otp", req.url));
    }

    // If 2FA is verified (or not required), and trying to access verify-otp, redirect to dashboard
    if (token && (!token.requires2FA || token.is2FAVerified) && pathname.startsWith("/admin/verify-otp")) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;
        
        // For API routes, let the middleware function itself handle returning JSON responses.
        if (pathname.startsWith("/api/admin")) {
          return true;
        }

        // Always allow access to the login page itself
        if (pathname.startsWith("/admin/login")) {
          return true;
        }
        
        // Protect all other admin page routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
