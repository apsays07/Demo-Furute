import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth/jwt";
import { hashPassword, comparePassword } from "@/lib/auth/bcrypt";

export async function PUT(request: Request) {
  try {
    await connectToDatabase();

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

    const body = await request.json();
    const { username, email, currentPassword, newPassword } = body;

    const user = await User.findById(payload.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Admin user not found" },
        { status: 404 }
      );
    }

    // 1. Password update flow
    if (currentPassword && newPassword) {
      if (!user.password) {
        return NextResponse.json(
          { success: false, error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      const isMatch = await comparePassword(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: "New password must be at least 6 characters long" },
          { status: 400 }
        );
      }

      user.password = await hashPassword(newPassword);
    }

    // 2. Profile details update
    if (username) {
      user.username = username.trim().toLowerCase();
    }
    if (email) {
      user.email = email.trim().toLowerCase();
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: unknown) {
    console.error("Settings PUT API Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update settings" },
      { status: 500 }
    );
  }
}
