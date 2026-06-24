import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Event from "@/models/Event";
import { logActivity } from "@/lib/auth/logActivity";
import { verifyAuth } from "@/lib/auth/verifyAuth";

// GET /api/admin/events - Fetch all events with optional status filter & pagination
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const query: {
      $or?: Array<Record<string, { $regex: string; $options: string }>>;
      status?: "upcoming" | "past" | "active";
    } = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }
    if (status) {
      query.status = status as "upcoming" | "past" | "active";
    }

    const [events, total] = await Promise.all([
      Event.find(query).sort({ date: -1 }).skip(skip).limit(limit),
      Event.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: events,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error("Events GET API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST /api/admin/events - Create a new event
export async function POST(request: Request) {
  try {
    const auth = await verifyAuth(["superadmin", "admin", "editor"]);
    if (!auth.success) return auth.response!;

    await connectToDatabase();
    const body = await request.json();

    const { title, description, date, location, image, registrationLink, status, featured } = body;

    if (!title || !description || !date || !location) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newEvent = await Event.create({
      title,
      description,
      date,
      location,
      image,
      registrationLink,
      status: status || "upcoming",
      featured: Boolean(featured),
    });

    await logActivity("created", "event", newEvent.title);

    return NextResponse.json({
      success: true,
      message: "Event created successfully",
      data: newEvent,
    }, { status: 201 });
  } catch (error: unknown) {
    console.error("Event POST API Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create event" },
      { status: 500 }
    );
  }
}
