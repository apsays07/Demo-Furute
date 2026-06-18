import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/jwt";
import ActivityLog from "@/models/ActivityLog";
import { connectToDatabase } from "@/lib/mongodb";

export async function logActivity(action: string, module: string, targetTitle: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return;

    const payload = verifyToken(token);
    if (!payload) return;

    await connectToDatabase();
    await ActivityLog.create({
      adminName: payload.username,
      adminRole: payload.role,
      action,
      module,
      targetTitle,
    });
  } catch (err) {
    console.error("Failed to write activity log:", err);
  }
}
