import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth/verifyAuth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const auth = await verifyAuth(["superadmin", "admin", "editor"]);
    if (!auth.success) return auth.response!;

    const formData = await request.formData();
    const file = formData.get("photo") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "File too large. Maximum size is 2MB." },
        { status: 400 }
      );
    }

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", "admins");
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename using userId + timestamp
    const ext = file.name.split(".").pop() ?? "jpg";
    const filename = `admin-${auth.user.id}-${Date.now()}.${ext}`;
    const filePath = path.join(uploadDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const photoUrl = `/uploads/admins/${filename}`;

    // Save photoUrl to DB
    await connectToDatabase();
    await User.findByIdAndUpdate(auth.user.id, { photoUrl });

    return NextResponse.json({ success: true, photoUrl });
  } catch (err) {
    console.error("Photo upload error:", err);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
