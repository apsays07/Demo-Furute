import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import { logActivity } from "@/lib/auth/logActivity";
import { verifyAuth } from "@/lib/auth/verifyAuth";

// GET /api/admin/gallery - Fetch all gallery images
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "";

    const query: { category?: string } = {};
    if (category) {
      query.category = category;
    }

    const images = await Gallery.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: images,
    });
  } catch (error: unknown) {
    console.error("Gallery GET API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch gallery images" },
      { status: 500 }
    );
  }
}

// POST /api/admin/gallery - Upload/Add an image to gallery
export async function POST(request: Request) {
  try {
    const auth = await verifyAuth(["superadmin", "admin", "editor"]);
    if (!auth.success) return auth.response!;

    await connectToDatabase();
    const body = await request.json();

    const { imageUrl, category, featured } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: "Image content or URL is required" },
        { status: 400 }
      );
    }

    const newImage = await Gallery.create({
      imageUrl,
      category: category || "General",
      featured: Boolean(featured),
    });

    await logActivity("added", "gallery image", newImage.category);

    return NextResponse.json({
      success: true,
      message: "Image uploaded/added successfully",
      data: newImage,
    }, { status: 201 });
  } catch (error: unknown) {
    console.error("Gallery POST API Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to add image" },
      { status: 500 }
    );
  }
}
