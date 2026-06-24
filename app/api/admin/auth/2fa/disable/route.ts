import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import speakeasy from "speakeasy";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { comparePassword } from "@/lib/auth/bcrypt";
import { logSecurityEvent } from "@/lib/auth/auditLog";

export async function POST(request: Request) {
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

    const { otp } = await request.json();

    if (!otp || typeof otp !== "string" || otp.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Authenticator code or recovery code is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Admin user not found" },
        { status: 404 }
      );
    }

    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      return NextResponse.json(
        { success: false, error: "2FA is not enabled for this account" },
        { status: 400 }
      );
    }

    const cleanOtp = otp.trim();

    // 1. Verify standard OTP
    let verified = false;
    if (cleanOtp.length === 6) {
      verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token: cleanOtp,
        window: 1,
      });
    }

    // 2. Verify backup code
    let isBackupMatch = false;
    if (!verified) {
      for (const hashedCode of user.backupCodes) {
        const isMatch = await comparePassword(cleanOtp, hashedCode);
        if (isMatch) {
          isBackupMatch = true;
          verified = true;
          // Remove the used backup code
          user.backupCodes = user.backupCodes.filter((c) => c !== hashedCode);
          break;
        }
      }
    }

    if (!verified) {
      return NextResponse.json(
        { success: false, error: "Invalid authenticator code or recovery code" },
        { status: 400 }
      );
    }

    // Disable 2FA
    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;
    user.backupCodes = [];
    await user.save();

    // Log the security audit event
    await logSecurityEvent(user.email, request, "2FA Disabled");

    return NextResponse.json({
      success: true,
      message: "Two-factor authentication disabled successfully",
    });
  } catch (error: unknown) {
    console.error("2FA Disable API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to disable 2FA" },
      { status: 500 }
    );
  }
}
