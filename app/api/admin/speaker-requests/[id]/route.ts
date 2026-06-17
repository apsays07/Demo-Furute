import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import SpeakerRequest from "@/models/SpeakerRequest";
import { logActivity } from "@/lib/auth/logActivity";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// PUT /api/admin/speaker-requests/[id] - Update speaker request status (pending / accepted / replied / declined)
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ["pending", "accepted", "replied", "declined"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value" },
        { status: 400 }
      );
    }

    const updatedRequest = await SpeakerRequest.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );

    if (!updatedRequest) {
      return NextResponse.json(
        { success: false, error: "Speaker request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Status updated successfully",
      data: updatedRequest,
    });
  } catch (error: unknown) {
    console.error("Speaker request PUT API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update speaker request" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/speaker-requests/[id] - Delete speaker request submission
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const deletedRequest = await SpeakerRequest.findByIdAndDelete(id);

    if (!deletedRequest) {
      return NextResponse.json(
        { success: false, error: "Speaker request not found" },
        { status: 404 }
      );
    }

    await logActivity("deleted", "speaker request", deletedRequest.name);

    return NextResponse.json({
      success: true,
      message: "Speaker request deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Speaker request DELETE API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete speaker request" },
      { status: 500 }
    );
  }
}
