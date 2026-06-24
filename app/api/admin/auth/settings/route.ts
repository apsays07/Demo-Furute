import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword, comparePassword } from "@/lib/auth/bcrypt";
import { logSecurityEvent } from "@/lib/auth/auditLog";
import { validatePassword } from "@/lib/auth/passwordPolicy";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    if (session.user.requires2FA && !session.user.is2FAVerified) {
      return NextResponse.json(
        { success: false, error: "2FA verification required" },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const body = await request.json();
    const { username, email, currentPassword, newPassword } = body;

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Admin user not found" },
        { status: 404 }
      );
    }

    let passwordChanged = false;

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

      const policyCheck = validatePassword(newPassword);
      if (!policyCheck.isValid) {
        return NextResponse.json(
          { success: false, error: policyCheck.error },
          { status: 400 }
        );
      }

      user.password = await hashPassword(newPassword);
      passwordChanged = true;
    }

    // 2. Profile details update
    if (username) {
      user.username = username.trim().toLowerCase();
    }
    if (email) {
      user.email = email.trim().toLowerCase();
    }

    await user.save();

    if (passwordChanged) {
      await logSecurityEvent(user.email, request, "Password Changed");
    }

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
