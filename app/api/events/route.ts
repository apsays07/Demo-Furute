import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Event from "@/models/Event";

// GET /api/events - Fetch events from MongoDB for the public website
export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const status = searchParams.get("status") || "";
    const featuredOnly = searchParams.get("featured") === "true";

    const query: {
      status?: "upcoming" | "past" | "active";
      featured?: boolean;
    } = {};

    if (status) {
      query.status = status as "upcoming" | "past" | "active";
    }
    if (featuredOnly) {
      query.featured = true;
    }

    const events = await Event.find(query)
      .sort({ featured: -1, date: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: events,
    });
  } catch (error: unknown) {
    console.error("Public Events GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
