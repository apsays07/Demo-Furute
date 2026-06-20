import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Newsletter from "@/models/Newsletter";

/**
 * POST /api/newsletter
 * Handler for newsletter email subscription submissions.
 */
export async function POST(request: Request) {
  try {
    // 1. Establish connection to MongoDB
    await connectToDatabase();

    // 2. Parse request body JSON
    const body = await request.json();
    const { email } = body;

    // 3. Validate email input
    if (!email || email.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Email is required." },
        { status: 400 }
      );
    }

    const emailStr = email.trim().toLowerCase();

    // 4. Check if already subscribed
    const existing = await Newsletter.findOne({ email: emailStr });
    if (existing) {
      return NextResponse.json(
        {
          success: true,
          message: "You are already subscribed to our newsletter!",
          data: existing,
        },
        { status: 200 }
      );
    }

    // 5. Save the subscription into MongoDB
    const newSubscription = await Newsletter.create({
      email: emailStr,
    });

    // 6. Return successful response
    return NextResponse.json(
      {
        success: true,
        message: "Successfully subscribed to the newsletter!",
        data: newSubscription,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error subscribing to newsletter:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to subscribe. Please try again.";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
