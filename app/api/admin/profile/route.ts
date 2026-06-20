import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

// GET — full profile
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

    await connectToDatabase();
    const user = await User.findById(payload.id).lean() as Record<string, unknown> | null;
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    return NextResponse.json({
      success: true,
      profile: {
        id: payload.id,
        username: user.username as string,
        email: user.email as string,
        role: user.role as string,
        firstName: (user.firstName as string) ?? "",
        lastName: (user.lastName as string) ?? "",
        phone: (user.phone as string) ?? "",
        bio: (user.bio as string) ?? "",
        jobTitle: (user.jobTitle as string) ?? "",
        photoUrl: (user.photoUrl as string) ?? "",
      },
    });
  } catch (err) {
    console.error("Profile GET error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// PUT — update profile fields
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

    await connectToDatabase();
    const user = await User.findById(payload.id);
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    const body = await request.json();
    const { firstName, lastName, phone, bio, jobTitle, photoUrl } = body;

    if (firstName !== undefined) user.firstName = firstName.trim();
    if (lastName !== undefined) user.lastName = lastName.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (jobTitle !== undefined) user.jobTitle = jobTitle.trim();
    if (photoUrl !== undefined) user.photoUrl = photoUrl.trim();

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      profile: {
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        phone: user.phone ?? "",
        bio: user.bio ?? "",
        jobTitle: user.jobTitle ?? "",
        photoUrl: user.photoUrl ?? "",
      },
    });
  } catch (err) {
    console.error("Profile PUT error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
