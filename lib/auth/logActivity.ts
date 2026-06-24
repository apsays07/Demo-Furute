import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ActivityLog from "@/models/ActivityLog";
import { connectToDatabase } from "@/lib/mongodb";

export async function logActivity(action: string, module: string, targetTitle: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return;

    await connectToDatabase();
    await ActivityLog.create({
      adminName: session.user.name || session.user.email || "Unknown Admin",
      adminRole: session.user.role,
      action,
      module,
      targetTitle,
    });
  } catch (err) {
    console.error("Failed to write activity log:", err);
  }
}
