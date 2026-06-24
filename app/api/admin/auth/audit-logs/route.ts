import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";

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

    // Fetch the 10 most recent security events for the current user's email
    const logs = await AuditLog.find({
      email: session.user.email?.toLowerCase().trim() || ""
    })
      .sort({ timestamp: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({
      success: true,
      logs,
    });
  } catch (error: unknown) {
    console.error("GET Audit Logs Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
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

    const userEmail = session.user.email?.toLowerCase().trim() || "";
    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: "User email not found in session" },
        { status: 400 }
      );
    }

    // Delete all audit logs matching the current user's email
    await AuditLog.deleteMany({ email: userEmail });

    return NextResponse.json({
      success: true,
      message: "Security activity history deleted successfully",
    });
  } catch (error: unknown) {
    console.error("DELETE Audit Logs Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

