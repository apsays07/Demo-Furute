import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ActivityLog from "@/models/ActivityLog";
import { verifyAuth } from "@/lib/auth/verifyAuth";

export async function GET() {
  try {
    const auth = await verifyAuth(["superadmin"]);
    if (!auth.success) return auth.response!;

    await connectToDatabase();

    // Fetch all logs where the action is 'deleted'
    const deletedHistory = await ActivityLog.find({ action: "deleted" })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: deletedHistory,
    });
  } catch (error: unknown) {
    console.error("Deleted History API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch deleted history" },
      { status: 500 }
    );
  }
}
