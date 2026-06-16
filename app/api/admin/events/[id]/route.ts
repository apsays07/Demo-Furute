import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Event from "@/models/Event";
import { verifyAuth } from "@/lib/auth/verifyAuth";
import { logActivity } from "@/lib/auth/logActivity";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// GET /api/admin/events/[id] - Fetch single event
export async function GET(request: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: event });
  } catch (error: unknown) {
    console.error("Event GET ID API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/events/[id] - Update event
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    await logActivity("updated", "event", updatedEvent.title);

    return NextResponse.json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error: unknown) {
    console.error("Event PUT API Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/events/[id] - Delete event
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const auth = await verifyAuth(["superadmin", "admin"]);
    if (!auth.success) return auth.response!;

    await connectToDatabase();
    const { id } = await params;

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    await logActivity("deleted", "event", deletedEvent.title);

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Event DELETE API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
