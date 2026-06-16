import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Program from "@/models/Program";
import { verifyAuth } from "@/lib/auth/verifyAuth";
import { logActivity } from "@/lib/auth/logActivity";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// GET /api/admin/programs/[id] - Fetch single program
export async function GET(request: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const program = await Program.findById(id);
    if (!program) {
      return NextResponse.json(
        { success: false, error: "Program not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: program });
  } catch (error: unknown) {
    console.error("Program GET ID API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch program" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/programs/[id] - Update program
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const updatedProgram = await Program.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedProgram) {
      return NextResponse.json(
        { success: false, error: "Program not found" },
        { status: 404 }
      );
    }

    await logActivity("updated", "program", updatedProgram.title);

    return NextResponse.json({
      success: true,
      message: "Program updated successfully",
      data: updatedProgram,
    });
  } catch (error: unknown) {
    console.error("Program PUT API Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update program" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/programs/[id] - Delete program
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const auth = await verifyAuth(["superadmin", "admin"]);
    if (!auth.success) return auth.response!;

    await connectToDatabase();
    const { id } = await params;

    const deletedProgram = await Program.findByIdAndDelete(id);

    if (!deletedProgram) {
      return NextResponse.json(
        { success: false, error: "Program not found" },
        { status: 404 }
      );
    }

    await logActivity("deleted", "program", deletedProgram.title);

    return NextResponse.json({
      success: true,
      message: "Program deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Program DELETE API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete program" },
      { status: 500 }
    );
  }
}
