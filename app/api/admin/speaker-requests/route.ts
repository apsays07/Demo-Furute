import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import SpeakerRequest from "@/models/SpeakerRequest";

// GET /api/admin/speaker-requests - Fetch all speaker requests
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
      status?: "pending" | "accepted" | "replied" | "declined";
    } = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { organization: { $regex: search, $options: "i" } },
        { eventName: { $regex: search, $options: "i" } },
        { eventLocation: { $regex: search, $options: "i" } },
      ];
    }
    if (status) {
      query.status = status as "pending" | "accepted" | "replied" | "declined";
    }

    const [requests, total] = await Promise.all([
      SpeakerRequest.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      SpeakerRequest.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: requests,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error("Speaker Requests GET API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch speaker requests" },
      { status: 500 }
    );
  }
}
