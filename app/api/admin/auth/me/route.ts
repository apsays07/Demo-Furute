import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const user = await User.findById(payload.id).lean();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const u = user as {
      username?: string;
      email?: string;
      role?: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
      bio?: string;
      jobTitle?: string;
      photoUrl?: string;
    };

    return NextResponse.json(
      {
        success: true,
        user: {
          id: payload.id,
          username: u.username ?? payload.username,
          email: u.email ?? payload.email,
          role: u.role ?? payload.role,
          firstName: u.firstName ?? "",
          lastName: u.lastName ?? "",
          phone: u.phone ?? "",
          bio: u.bio ?? "",
          jobTitle: u.jobTitle ?? "",
          photoUrl: u.photoUrl ?? "",
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Session verification API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
