import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth/bcrypt";
import { verifyAuth } from "@/lib/auth/verifyAuth";
import { logActivity } from "@/lib/auth/logActivity";
import { validatePassword } from "@/lib/auth/passwordPolicy";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// PUT /api/admin/users/[id] - Update user role or password (Super Admin only)
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const auth = await verifyAuth(["superadmin"]);
    if (!auth.success) return auth.response!;

    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const { role, password } = body;
    const updateData: Record<string, unknown> = {};

    if (role) {
      updateData.role = role;
    }

    if (password) {
      const policyCheck = validatePassword(password);
      if (!policyCheck.isValid) {
        return NextResponse.json(
          { success: false, error: policyCheck.error },
          { status: 400 }
        );
      }
      updateData.password = await hashPassword(password);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: "Nothing to update" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    await logActivity("updated", "user", updatedUser.username);

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      data: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error: unknown) {
    console.error("User PUT API Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete a user (Super Admin only)
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const auth = await verifyAuth(["superadmin"]);
    if (!auth.success) return auth.response!;

    await connectToDatabase();
    const { id } = await params;

    // Prevent Super Admin from deleting themselves
    if (id === auth.user?.id) {
      return NextResponse.json(
        { success: false, error: "Cannot delete yourself" },
        { status: 400 }
      );
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    await logActivity("deleted", "user", deletedUser.username);

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: unknown) {
    console.error("User DELETE API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
