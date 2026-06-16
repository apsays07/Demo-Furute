import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import { verifyAuth } from "@/lib/auth/verifyAuth";
import { logActivity } from "@/lib/auth/logActivity";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// DELETE /api/admin/gallery/[id] - Remove image from gallery
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const auth = await verifyAuth(["superadmin", "admin"]);
    if (!auth.success) return auth.response!;

    await connectToDatabase();
    const { id } = await params;

    const deletedImage = await Gallery.findByIdAndDelete(id);

    if (!deletedImage) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 }
      );
    }

    await logActivity("deleted", "gallery image", deletedImage.category);

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Gallery DELETE API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
