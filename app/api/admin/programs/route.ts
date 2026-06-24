import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Program from "@/models/Program";
import { logActivity } from "@/lib/auth/logActivity";
import { verifyAuth } from "@/lib/auth/verifyAuth";

// GET /api/admin/programs - Fetch all programs with search, category & pagination
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const query: {
      $or?: Array<Record<string, { $regex: string; $options: string }>>;
      category?: string;
    } = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (category) {
      query.category = category;
    }

    const [programs, total] = await Promise.all([
      Program.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Program.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: programs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error("Programs GET API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch programs" },
      { status: 500 }
    );
  }
}

// POST /api/admin/programs - Create a new program
export async function POST(request: Request) {
  try {
    const auth = await verifyAuth(["superadmin", "admin", "editor"]);
    if (!auth.success) return auth.response!;

    await connectToDatabase();
    const body = await request.json();

    const { title, description, duration, category, image, pdf, visible } = body;

    if (!title || !description || !duration || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newProgram = await Program.create({
      title,
      description,
      duration,
      category,
      image,
      pdf,
      visible: visible !== undefined ? Boolean(visible) : true,
    });

    await logActivity("created", "program", newProgram.title);

    return NextResponse.json({
      success: true,
      message: "Program created successfully",
      data: newProgram,
    }, { status: 201 });
  } catch (error: unknown) {
    console.error("Program POST API Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create program" },
      { status: 500 }
    );
  }
}
