import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ContactInquiry from "@/models/ContactInquiry";

/**
 * POST /api/contact
 * Handler for saving contact inquiry submissions.
 */
export async function POST(request: Request) {
  try {
    // 1. Establish connection to MongoDB
    await connectToDatabase();

    // 2. Parse request body JSON
    const body = await request.json();

    // 3. Extract all fields from the body
    const {
      name,
      fullName,
      email,
      phone,
      organization,
      subject,
      message,
    } = body;

    // Support interchange between name and fullName
    const inquiryName = name || fullName;

    // 4. Validate mandatory organizer fields
    if (!inquiryName || inquiryName.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Name is required." },
        { status: 400 }
      );
    }
    if (!email || email.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Email is required." },
        { status: 400 }
      );
    }
    if (!phone || phone.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Phone number is required." },
        { status: 400 }
      );
    }
    if (!subject || subject.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Subject is required." },
        { status: 400 }
      );
    }
    if (!message || message.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Message is required." },
        { status: 400 }
      );
    }

    // 5. Save the inquiry into MongoDB Atlas
    const newInquiry = await ContactInquiry.create({
      name: inquiryName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      organization: organization ? organization.trim() : undefined,
      subject: subject.trim(),
      message: message.trim(),
    });

    // 6. Return successful response
    return NextResponse.json(
      {
        success: true,
        message: "Your message has been submitted successfully!",
        data: newInquiry,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating contact inquiry:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to process inquiry. Please try again.";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
