import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth/bcrypt";
import { verifyAuth } from "@/lib/auth/verifyAuth";
import { logActivity } from "@/lib/auth/logActivity";
import { validatePassword } from "@/lib/auth/passwordPolicy";

// GET /api/admin/users - List all admin/editor users (Super Admin only)
export async function GET() {
  try {
    const auth = await verifyAuth(["superadmin"]);
    if (!auth.success) return auth.response!;

    await connectToDatabase();
    const users = await User.find({}, "-password").sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: users });
  } catch (error: unknown) {
    console.error("Users GET API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create a new user (Super Admin only)
export async function POST(request: Request) {
  try {
    const auth = await verifyAuth(["superadmin"]);
    if (!auth.success) return auth.response!;

    await connectToDatabase();
    const body = await request.json();
    const { username, email, password, role } = body;

    if (!username || !email || !password || !role) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const policyCheck = validatePassword(password);
    if (!policyCheck.isValid) {
      return NextResponse.json(
        { success: false, error: policyCheck.error },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { username: username.toLowerCase().trim() },
        { email: email.toLowerCase().trim() }
      ]
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Username or Email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
    });

    const userResponse = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };

    await logActivity("created", "user", newUser.username);

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      data: userResponse,
    }, { status: 201 });
  } catch (error: unknown) {
    console.error("User POST API Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create user" },
      { status: 500 }
    );
  }
}
