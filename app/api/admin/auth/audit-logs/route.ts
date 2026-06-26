import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const action = searchParams.get("action") || "";
    const filterEmail = searchParams.get("email") || "";
    const filterIp = searchParams.get("ip") || "";

    const userEmail = session.user.email?.toLowerCase().trim() || "";
    const isAdmin = session.user.role === "superadmin" || session.user.role === "admin";

    const query: any = {};

    if (!isAdmin) {
      query.email = userEmail;
    } else if (filterEmail) {
      query.email = filterEmail.toLowerCase().trim();
    }

    if (filterIp) {
      query.ip = filterIp.trim();
    }

    if (action) {
      query.action = action;
    }

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { ip: { $regex: search, $options: "i" } },
        { action: { $regex: search, $options: "i" } },
      ];
    }

    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .limit(50)
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

