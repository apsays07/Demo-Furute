import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Program from "@/models/Program";

// GET /api/programs - Public endpoint: fetch visible programs
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "";
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const query: { visible: boolean; category?: string } = { visible: true };
    if (category) query.category = category;

    const programs = await Program.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, data: programs });
  } catch (error: unknown) {
    console.error("Public Programs GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch programs" },
      { status: 500 }
    );
  }
}
