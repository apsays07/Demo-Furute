import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Decodes the base64url-encoded JWT payload without verifying its signature.
 * Edge-compatible function.
 */
interface DecodedPayload {
  exp?: number;
  id?: string;
  username?: string;
  email?: string;
  role?: string;
}

function decodeJWTPayload(token: string): DecodedPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64Url = parts[1] || "";
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    
    // Polyfill or native browser base64 decode (atob is globally available in Next Edge middleware)
    const rawData = atob(base64);
    const utf8Data = rawData
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("");
      
    return JSON.parse(decodeURIComponent(utf8Data));
  } catch (error) {
    console.error("Error decoding JWT payload in middleware:", error);
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let public routes, api/admin/auth/login, static files pass through
  if (
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/api/admin/auth/login") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Access the token from cookies
  const token = request.cookies.get("admin_token")?.value;

  if (!token) {
    // If requesting admin route without token, redirect to login
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  } else {
    // Parse token payload
    const payload = decodeJWTPayload(token);

    if (!payload) {
      // Invalid format, clear token and redirect
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("admin_token");
      return response;
    }

    // Check expiration (exp is in seconds, Date.now() in milliseconds)
    const isExpired = payload.exp && payload.exp * 1000 < Date.now();
    if (isExpired) {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("admin_token");
      return response;
    }

    // User is authenticated. If they try to hit /admin/login directly, redirect to dashboard
    if (pathname === "/admin" || pathname === "/admin/") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// Map the paths that this middleware intercepts
export const config = {
  matcher: ["/admin/:path*"],
};
