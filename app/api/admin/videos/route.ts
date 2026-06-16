import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Video from "@/models/Video";
import { logActivity } from "@/lib/auth/logActivity";

// GET /api/admin/videos - Fetch all videos with search, category & pagination
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const query: {
      $or?: Array<Record<string, { $regex: string; $options: string }>>;
      category?: string;
    } = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (category) {
      query.category = category;
    }

    const [videos, total] = await Promise.all([
      Video.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Video.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: videos,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error("Videos GET API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

// POST /api/admin/videos - Create a new video
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const { title, description, youtubeUrl, thumbnail, category, featured, visible } = body;

    if (!title || !youtubeUrl) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newVideo = await Video.create({
      title,
      description,
      youtubeUrl,
      thumbnail,
      category: category || "General",
      featured: Boolean(featured),
      visible: visible !== undefined ? Boolean(visible) : true,
    });

    if (newVideo.featured && newVideo.visible) {
      const featuredVideosCount = await Video.countDocuments({ featured: true, visible: true });
      if (featuredVideosCount > 4) {
        const oldestVideos = await Video.find({ featured: true, visible: true })
          .sort({ createdAt: 1 })
          .limit(featuredVideosCount - 4);
        for (const oldVideo of oldestVideos) {
          await Video.findByIdAndDelete(oldVideo._id);
        }
      }
    }

    await logActivity("created", "video", newVideo.title);

    return NextResponse.json({
      success: true,
      message: "Video created successfully",
      data: newVideo,
    }, { status: 201 });
  } catch (error: unknown) {
    console.error("Video POST API Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create video" },
      { status: 500 }
    );
  }
}
