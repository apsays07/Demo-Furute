import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Comment from "@/models/Comment";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { postSlug, name, email, website, comment, parentId } = body;

    if (!postSlug || !name || !email || !comment) {
      return NextResponse.json(
        { success: false, error: "Name, email, and comment are required." },
        { status: 400 }
      );
    }

    // If parentId is provided, verify the parent comment exists
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment) {
        return NextResponse.json(
          { success: false, error: "Parent comment not found." },
          { status: 404 }
        );
      }
    }

    const newComment = await Comment.create({
      postSlug,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      website: website ? website.trim() : undefined,
      comment: comment.trim(),
      parentId: parentId || null,
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

    // Fetch all comments for this post
    const allComments = await Comment.find({ postSlug }).sort({ createdAt: -1 }).lean();

    type LeanComment = {
      _id: string;
      postSlug: string;
      name: string;
      email: string;
      website?: string;
      comment: string;
      parentId?: string | null;
      createdAt: string;
      replies: LeanComment[];
      [key: string]: unknown;
    };

    // Build nested structure: top-level comments with their replies
    const commentMap = new Map<string, LeanComment>();
    const topLevel: LeanComment[] = [];

    // First pass: index all comments
    for (const c of allComments) {
      const plain = JSON.parse(JSON.stringify(c)) as LeanComment;
      plain.replies = [];
      commentMap.set(plain._id.toString(), plain);
    }

    // Second pass: attach replies to parents
    for (const entry of commentMap.values()) {
      if (entry.parentId) {
        const parent = commentMap.get(entry.parentId.toString());
        if (parent) {
          parent.replies.push(entry);
        }
      } else {
        topLevel.push(entry);
      }
    }

    // Sort replies chronologically (oldest first)
    for (const c of topLevel) {
      c.replies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    return NextResponse.json({ success: true, data: topLevel }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching comments:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch comments.";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
