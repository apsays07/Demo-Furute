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
        username: "ashayshah",
        email: "ashayshah@gmail.com",
        password: hashedPassword,
        role: "superadmin",
      });
      // Auto-migrate old admin account to ashayshah if it exists
      const oldAdmin = await User.findOne({ username: "ankitgod" });
      if (oldAdmin) {
        const existingAshay = await User.findOne({
          $or: [{ username: "ashayshah" }, { email: "ashayshah@gmail.com" }],
        });
        if (existingAshay) {
          // Delete oldAdmin to prevent duplicates
          await User.deleteOne({ _id: oldAdmin._id });
          console.log("Deleted duplicate legacy admin ankitgod because ashayshah already exists");
          // Ensure existing ashayshah has superadmin role and reset password to admin123
          const hashedPassword = await hashPassword("admin123");
          existingAshay.role = "superadmin";
          existingAshay.password = hashedPassword;
          await existingAshay.save();
          console.log("Reset existing ashayshah password to admin123 and set role to superadmin");
        } else {
          oldAdmin.username = "ashayshah";
          oldAdmin.email = "ashayshah@gmail.com";
          oldAdmin.role = "superadmin";
          const hashedPassword = await hashPassword("admin123");
          oldAdmin.password = hashedPassword;
          await oldAdmin.save();
          console.log("Auto-migrated old admin ankitgod to ashayshah and reset password to admin123");
        }
      } else {
        // Ensure ashayshah has superadmin role and reset password to admin123 if it exists
        const admin = await User.findOne({
          $or: [{ username: "ashayshah" }, { email: "ashayshah@gmail.com" }],
        });
        if (admin) {
          const hashedPassword = await hashPassword("admin123");
          admin.role = "superadmin";
          admin.password = hashedPassword;
          await admin.save();
          console.log("Enforced superadmin role and reset password to admin123 for ashayshah");
        }
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
