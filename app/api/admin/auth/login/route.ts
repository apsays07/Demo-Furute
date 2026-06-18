import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword, comparePassword } from "@/lib/auth/bcrypt";
import { signToken } from "@/lib/auth/jwt";

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username/Email and password are required" },
        { status: 400 }
      );
    }

    // Trim and format input
    const loginIdentifier = username.trim().toLowerCase();

    // 1. Auto-seeding: Check if there are any admin users in the database.
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("No administrators found. Seeding default super admin account.");
      const hashedPassword = await hashPassword("admin123");
      await User.create({
        username: "ankitgod",
        email: "anniphapal@gmail.com",
        password: hashedPassword,
        role: "superadmin",
      });
    } else {
      // Auto-migrate ankitgod to superadmin if it exists and has a different role
      const admin = await User.findOne({ username: "ankitgod" });
      if (admin && admin.role !== "superadmin") {
        admin.role = "superadmin";
        await admin.save();
        console.log("Auto-migrated ankitgod to superadmin role");
      }
    }

    const user = await User.findOne({
      $or: [{ username: loginIdentifier }, { email: loginIdentifier }],
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // 3. Compare password
    if (!user.password) {
      return NextResponse.json(
        { success: false, error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // 4. Generate JWT token
    const tokenPayload = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    };
    const token = signToken(tokenPayload);

    // 5. Build HTTP-only Cookie Response
    const response = NextResponse.json(
      {
        success: true,
        message: "Logged in successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    const isProduction = process.env.NODE_ENV === "production";
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
