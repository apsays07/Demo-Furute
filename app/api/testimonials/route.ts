import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";

// GET /api/testimonials - Fetch visible testimonials for the public website
export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const featuredOnly = searchParams.get("featured") === "true";

    const query: { visible: boolean; featured?: boolean } = { visible: true };
    if (featuredOnly) {
      query.featured = true;
    }

    const testimonials = await Testimonial.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: testimonials,
    });
  } catch (error: unknown) {
    console.error("Public Testimonials GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}
