import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

export async function verifyAuth(allowedRoles: string[]) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return {
        success: false,
        response: NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 }),
      };
    }

    const payload = verifyToken(token);
    if (!payload) {
      return {
        success: false,
        response: NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 }),
      };
    }

    if (!allowedRoles.includes(payload.role)) {
      return {
        success: false,
        response: NextResponse.json({ success: false, error: "Access Denied" }, { status: 403 }),
      };
    }

    return { success: true, user: payload };
  } catch (error) {
    console.error("Auth Verification Error:", error);
    return {
      success: false,
      response: NextResponse.json({ success: false, error: "Internal Auth Error" }, { status: 500 }),
    };
  }
}
