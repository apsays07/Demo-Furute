import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export type AuthResult =
  | {
      success: true;
      user: {
        id: string;
        username: string;
        email: string;
        role: string;
        requires2FA: boolean;
        is2FAVerified: boolean;
      };
    }
  | {
      success: false;
      response: NextResponse;
    };

export async function verifyAuth(allowedRoles: string[]): Promise<AuthResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return {
        success: false,
        response: NextResponse.json(
          { success: false, error: "Not authenticated" },
          { status: 401 }
        ),
      };
    }

    const user = session.user;

    // Check if 2FA is active but not yet verified
    if (user.requires2FA && !user.is2FAVerified) {
      return {
        success: false,
        response: NextResponse.json(
          { success: false, error: "2FA verification required" },
          { status: 403 }
        ),
      };
    }

    if (!allowedRoles.includes(user.role)) {
      return {
        success: false,
        response: NextResponse.json(
          { success: false, error: "Access Denied" },
          { status: 403 }
        ),
      };
    }

    return {
      success: true,
      user: {
        id: user.id,
        username: user.name || "",
        email: user.email || "",
        role: user.role,
        requires2FA: user.requires2FA,
        is2FAVerified: user.is2FAVerified,
      },
    };
  } catch (error) {
    console.error("Auth Verification Error:", error);
    return {
      success: false,
      response: NextResponse.json(
        { success: false, error: "Internal Auth Error" },
        { status: 500 }
      ),
    };
  }
}
