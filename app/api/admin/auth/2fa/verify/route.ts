import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import crypto from "crypto";
import speakeasy from "speakeasy";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth/bcrypt";
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

    if (!otp || typeof otp !== "string" || otp.trim().length !== 6) {
      return NextResponse.json(
        { success: false, error: "OTP code must be a 6-digit number" },
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

    if (!user.tempTwoFactorSecret) {
      return NextResponse.json(
        { success: false, error: "2FA setup is not initialized" },
        { status: 400 }
      );
    }

    // Verify OTP using speakeasy
    const verified = speakeasy.totp.verify({
      secret: user.tempTwoFactorSecret,
      encoding: "base32",
      token: otp.trim(),
      window: 1, // Allow 30s clock skew
    });

    if (!verified) {
      return NextResponse.json(
        { success: false, error: "Invalid authenticator code. Please try again." },
        { status: 400 }
      );
    }

    // Generate 10 backup codes (Format: XXXX-XXXX)
    const rawBackupCodes: string[] = [];
    const hashedBackupCodes: string[] = [];

    for (let i = 0; i < 10; i++) {
      const randomHex = crypto.randomBytes(4).toString("hex").toUpperCase();
      const formattedCode = `${randomHex.slice(0, 4)}-${randomHex.slice(4)}`;
      rawBackupCodes.push(formattedCode);
      const hashed = await hashPassword(formattedCode);
      hashedBackupCodes.push(hashed);
    }

    // Save user state
    user.twoFactorEnabled = true;
    user.twoFactorSecret = user.tempTwoFactorSecret;
    user.tempTwoFactorSecret = null;
    user.backupCodes = hashedBackupCodes;
    await user.save();

    // Log the security audit event
    await logSecurityEvent(user.email, request, "2FA Enabled");

    return NextResponse.json({
      success: true,
      backupCodes: rawBackupCodes,
    });
  } catch (error: unknown) {
    console.error("2FA Verify API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify 2FA setup" },
      { status: 500 }
    );
  }
}
