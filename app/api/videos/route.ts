import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Video from "@/models/Video";

// GET /api/videos - Public endpoint: fetch visible videos
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const featuredOnly = searchParams.get("featured") === "true";

    const query: { visible: boolean; featured?: boolean } = { visible: true };
    if (featuredOnly) query.featured = true;

    const videos = await Video.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, data: videos });
  } catch (error: unknown) {
    console.error("Public Videos GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
