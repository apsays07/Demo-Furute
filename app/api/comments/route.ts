import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Comment from "@/models/Comment";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { postSlug, name, email, website, comment } = body;

    if (!postSlug || !name || !email || !comment) {
      return NextResponse.json(
        { success: false, error: "Name, email, and comment are required." },
        { status: 400 }
      );
    }

    const newComment = await Comment.create({
      postSlug,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      website: website ? website.trim() : undefined,
      comment: comment.trim(),
    });

    return NextResponse.json(
      { success: true, message: "Comment posted successfully!", data: newComment },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating comment:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to post comment.";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const postSlug = searchParams.get("postSlug");

    if (!postSlug) {
      return NextResponse.json(
        { success: false, error: "postSlug is required." },
        { status: 400 }
      );
    }

    const comments = await Comment.find({ postSlug }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: comments }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching comments:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch comments.";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}