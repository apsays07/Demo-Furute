import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { comparePassword } from "@/lib/auth/bcrypt";
import { otpLimiter } from "@/lib/auth/rateLimiter";
import { logSecurityEvent, getClientIp } from "@/lib/auth/auditLog";
import speakeasy from "speakeasy";
import { sendLoginAlertEmail } from "@/lib/auth/email";

export async function POST(request: Request) {
  const ip = getClientIp(request);

  // 1. Rate Limit Check
  try {
    await otpLimiter.consume(ip);
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Too many attempts. Please try again in 5 minutes." },
      { status: 429 }
    );
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { otp } = await request.json();
    if (!otp) {
      return NextResponse.json(
        { success: false, error: "Verification code is required" },
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

    const cleanOtp = otp.trim();

    // 2. Validate standard TOTP
    let verified = false;
    if (cleanOtp.length === 6 && user.twoFactorSecret) {
      verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token: cleanOtp,
        window: 1, // Allow 30s clock skew
      });
    }

    // 3. Validate Recovery / Backup Code
    let isBackupMatch = false;
    if (!verified) {
      for (const hashedCode of user.backupCodes) {
        const isMatch = await comparePassword(cleanOtp, hashedCode);
        if (isMatch) {
          isBackupMatch = true;
          verified = true;
          // Single-use: remove the recovery code from the array
          user.backupCodes = user.backupCodes.filter((code) => code !== hashedCode);
          await user.save();
          break;
        }
      }
    }

    if (!verified) {
      await logSecurityEvent(user.email, request, "Login Failed");
      return NextResponse.json(
        { success: false, error: "Invalid authenticator code or recovery code" },
        { status: 400 }
      );
    }

    // Success
    await logSecurityEvent(user.email, request, "Login Success");
    try {
      await sendLoginAlertEmail(user.email, ip);
    } catch (emailErr) {
      console.error("Failed to send login alert email:", emailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Two-factor authentication verified successfully",
    });
  } catch (error: unknown) {
    console.error("Verify Login OTP API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
