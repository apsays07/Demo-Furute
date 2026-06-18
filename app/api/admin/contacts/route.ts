import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Contact from "@/models/Contact";

// GET /api/admin/contacts - Fetch all contact submissions
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
      status?: "pending" | "replied";
    } = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }
    if (status) {
      query.status = status as "pending" | "replied";
    }

    const [contacts, total] = await Promise.all([
      Contact.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contact.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: contacts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error("Contacts GET API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}
