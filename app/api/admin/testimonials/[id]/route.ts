import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import { verifyAuth } from "@/lib/auth/verifyAuth";
import { logActivity } from "@/lib/auth/logActivity";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// GET /api/admin/testimonials/[id] - Fetch single testimonial
export async function GET(request: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: testimonial });
  } catch (error: unknown) {
    console.error("Testimonial GET ID API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch testimonial" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/testimonials/[id] - Update testimonial
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedTestimonial) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
      );
    }

    await logActivity("updated", "testimonial", updatedTestimonial.name);

    return NextResponse.json({
      success: true,
      message: "Testimonial updated successfully",
      data: updatedTestimonial,
    });
  } catch (error: unknown) {
    console.error("Testimonial PUT API Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/testimonials/[id] - Delete testimonial
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const auth = await verifyAuth(["superadmin", "admin"]);
    if (!auth.success) return auth.response!;

    await connectToDatabase();
    const { id } = await params;

    const deletedTestimonial = await Testimonial.findByIdAndDelete(id);

    if (!deletedTestimonial) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
      );
    }

    await logActivity("deleted", "testimonial", deletedTestimonial.name);

    return NextResponse.json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Testimonial DELETE API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
