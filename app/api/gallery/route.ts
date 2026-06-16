import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";

// GET /api/gallery - Public endpoint: fetch gallery images
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "";
    const featuredOnly = searchParams.get("featured") === "true";
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const query: { category?: string; featured?: boolean } = {};
    if (category) query.category = category;
    if (featuredOnly) query.featured = true;

    const images = await Gallery.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, data: images });
  } catch (error: unknown) {
    console.error("Public Gallery GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch gallery" },
      { status: 500 }
    );
  }
}
