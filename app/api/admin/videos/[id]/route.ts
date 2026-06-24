import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Video from "@/models/Video";
import { verifyAuth } from "@/lib/auth/verifyAuth";
import { logActivity } from "@/lib/auth/logActivity";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// GET /api/admin/videos/[id] - Fetch single video
export async function GET(request: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const video = await Video.findById(id);
    if (!video) {
      return NextResponse.json(
        { success: false, error: "Video not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: video });
  } catch (error: unknown) {
    console.error("Video GET ID API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch video" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/videos/[id] - Update video
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const auth = await verifyAuth(["superadmin", "admin", "editor"]);
    if (!auth.success) return auth.response!;

    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const updatedVideo = await Video.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedVideo) {
      return NextResponse.json(
        { success: false, error: "Video not found" },
        { status: 404 }
      );
    }

    if (updatedVideo.featured && updatedVideo.visible) {
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

    await logActivity("updated", "video", updatedVideo.title);

    return NextResponse.json({
      success: true,
      message: "Video updated successfully",
      data: updatedVideo,
    });
  } catch (error: unknown) {
    console.error("Video PUT API Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update video" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/videos/[id] - Delete video
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const auth = await verifyAuth(["superadmin", "admin"]);
    if (!auth.success) return auth.response!;

    await connectToDatabase();
    const { id } = await params;

    const deletedVideo = await Video.findByIdAndDelete(id);

    if (!deletedVideo) {
      return NextResponse.json(
        { success: false, error: "Video not found" },
        { status: 404 }
      );
    }

    await logActivity("deleted", "video", deletedVideo.title);

    return NextResponse.json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Video DELETE API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete video" },
      { status: 500 }
    );
  }
}
