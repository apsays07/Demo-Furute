import { connectToDatabase } from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";

/**
 * Gets the client IP address from request headers.
 */
export function getClientIp(request: Request): string {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const firstIp = xForwardedFor.split(",")[0];
    if (firstIp) {
      return firstIp.trim();
    }
  }
  return "127.0.0.1";
}

/**
 * Logs a security event into the AuditLog collection.
 */
export async function logSecurityEvent(email: string, request: Request, action: string) {
  try {
    await connectToDatabase();
    const ip = getClientIp(request);
    await AuditLog.create({
      email: email.trim().toLowerCase(),
      ip,
      action,
    });
  } catch (error) {
    console.error("Failed to log security event:", error);
  }
}

/**
 * Logs a security event directly using an IP string.
 */
export async function logSecurityEventWithIp(email: string, ip: string, action: string) {
  try {
    await connectToDatabase();
    await AuditLog.create({
      email: email.trim().toLowerCase(),
      ip,
      action,
    });
  } catch (error) {
    console.error("Failed to log security event with IP:", error);
  }
}
