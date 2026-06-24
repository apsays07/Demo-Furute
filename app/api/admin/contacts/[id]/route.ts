import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { logActivity } from "@/lib/auth/logActivity";
import { verifyAuth } from "@/lib/auth/verifyAuth";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// PUT /api/admin/contacts/[id] - Update contact status (replied / pending)
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const auth = await verifyAuth(["superadmin", "admin", "editor"]);
    if (!auth.success) return auth.response!;

    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !["pending", "replied"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value" },
        { status: 400 }
      );
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );

    if (!updatedContact) {
      return NextResponse.json(
        { success: false, error: "Contact inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Status updated successfully",
      data: updatedContact,
    });
  } catch (error: unknown) {
    console.error("Contact PUT API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update contact" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/contacts/[id] - Delete contact submission
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const auth = await verifyAuth(["superadmin", "admin"]);
    if (!auth.success) return auth.response!;

    await connectToDatabase();
    const { id } = await params;

    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return NextResponse.json(
        { success: false, error: "Contact inquiry not found" },
        { status: 404 }
      );
    }

    await logActivity("deleted", "contact inquiry", deletedContact.name);

    return NextResponse.json({
      success: true,
      message: "Contact inquiry deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Contact DELETE API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete contact inquiry" },
      { status: 500 }
    );
  }
}
