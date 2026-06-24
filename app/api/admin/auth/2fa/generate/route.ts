import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
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
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Admin user not found" },
        { status: 404 }
      );
    }

    // Generate speakeasy secret
    const secret = speakeasy.generateSecret({
      name: `Furute Admin (${user.email})`,
    });

    // Store in temp field until verified
    user.tempTwoFactorSecret = secret.base32;
    await user.save();

    // Generate QR code data URL
    if (!secret.otpauth_url) {
      throw new Error("Failed to generate OTP auth URL");
    }
    
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    return NextResponse.json({
      success: true,
      secret: secret.base32,
      qrCode,
    });
  } catch (error: unknown) {
    console.error("2FA Generate API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate 2FA secret" },
      { status: 500 }
    );
  }
}
