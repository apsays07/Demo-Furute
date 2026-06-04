import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import SpeakerInvite from "@/models/SpeakerInvite";

/**
 * POST /api/speaker
 * Handler for saving speaker invitation forms containing both organizers' details
 * and specific event characteristics.
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
      organization,
      phone,
      eventName,
      eventDate,
      eventLocation,
      audienceSize,
      eventFormat,
      message,
      brief,
    } = body;

    // Interchange name/fullName and message/brief to match whatever form shape is sent
    const inviteName = name || fullName;
    const inviteMessage = message || brief;

    // 4. Validate mandatory organizer fields
    if (!inviteName || inviteName.trim() === "") {
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
    if (!organization || organization.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Organization is required." },
        { status: 400 }
      );
    }

    // 5. Save the invitation into MongoDB Atlas
    const newInvite = await SpeakerInvite.create({
      name: inviteName.trim(),
      email: email.trim().toLowerCase(),
      organization: organization.trim(),
      phone: phone ? phone.trim() : undefined,
      eventName: eventName ? eventName.trim() : undefined,
      eventDate: eventDate ? eventDate.trim() : undefined,
      eventLocation: eventLocation ? eventLocation.trim() : undefined,
      audienceSize: audienceSize ? Number(audienceSize) : undefined,
      eventFormat: eventFormat || "In-person",
      message: inviteMessage ? inviteMessage.trim() : undefined,
    });

    // 6. Return successful response
    return NextResponse.json(
      {
        success: true,
        message: "Speaker invitation submitted successfully!",
        data: newInvite,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating speaker invitation:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to process invitation. Please try again.";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}