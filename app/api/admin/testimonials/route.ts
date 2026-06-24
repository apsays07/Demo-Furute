import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import { logActivity } from "@/lib/auth/logActivity";
import { verifyAuth } from "@/lib/auth/verifyAuth";

// GET /api/admin/testimonials - Fetch all testimonials with search & pagination
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const query: {
      $or?: Array<Record<string, { $regex: string; $options: string }>>;
    } = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { review: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { designation: { $regex: search, $options: "i" } },
      ];
    }

    const [testimonials, total] = await Promise.all([
      Testimonial.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Testimonial.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: testimonials,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error("Testimonials GET API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// POST /api/admin/testimonials - Create a new testimonial
export async function POST(request: Request) {
  try {
    const auth = await verifyAuth(["superadmin", "admin", "editor"]);
    if (!auth.success) return auth.response!;

    await connectToDatabase();
    const body = await request.json();

    const { name, designation, company, review, image, rating, featured, visible } = body;

    if (!name || !designation || !company || !review) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newTestimonial = await Testimonial.create({
      name,
      designation,
      company,
      review,
      image,
      rating: Number(rating) || 5,
      featured: Boolean(featured),
      visible: visible !== undefined ? Boolean(visible) : true,
    });

    await logActivity("created", "testimonial", newTestimonial.name);

    return NextResponse.json({
      success: true,
      message: "Testimonial created successfully",
      data: newTestimonial,
    }, { status: 201 });
  } catch (error: unknown) {
    console.error("Testimonial POST API Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
