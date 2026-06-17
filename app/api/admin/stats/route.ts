import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import Video from "@/models/Video";
import Event from "@/models/Event";
import Program from "@/models/Program";
import Contact, { IContact } from "@/models/Contact";
import SpeakerRequest, { ISpeakerRequest } from "@/models/SpeakerRequest";
import ActivityLog from "@/models/ActivityLog";
import { verifyAuth } from "@/lib/auth/verifyAuth";

export async function GET() {
  try {
    await connectToDatabase();

    // Query counts in parallel
    const [
      testimonialsCount,
      videosCount,
      eventsCount,
      programsCount,
      contactsCount,
      speakerRequestsCount,
    ] = await Promise.all([
      Testimonial.countDocuments(),
      Video.countDocuments(),
      Event.countDocuments(),
      Program.countDocuments(),
      Contact.countDocuments(),
      SpeakerRequest.countDocuments(),
    ]);

    // Fetch recent submissions in parallel
    const [recentContacts, recentSpeakerRequests] = await Promise.all([
      Contact.find().sort({ createdAt: -1 }).limit(5).lean(),
      SpeakerRequest.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    // Format recent activity log
    const activityLogs: Array<{
      id: string;
      type: "contact" | "speaker";
      title: string;
      subtitle: string;
      status: string;
      time: Date;
    }> = [];

    (recentContacts as unknown as IContact[]).forEach((contact) => {
      activityLogs.push({
        id: String(contact._id),
        type: "contact",
        title: `Contact Inquiry: ${contact.name}`,
        subtitle: contact.subject,
        status: contact.status || "pending",
        time: contact.createdAt,
      });
    });

    (recentSpeakerRequests as unknown as ISpeakerRequest[]).forEach((req) => {
      activityLogs.push({
        id: String(req._id),
        type: "speaker",
        title: `Speaker Invite: ${req.name}`,
        subtitle: req.eventName || "Speaking Event",
        status: req.status || "pending",
        time: req.createdAt,
      });
    });

    // Sort combined activities by time descending
    activityLogs.sort((a, b) => b.time.getTime() - a.time.getTime());

    // Fetch recent admin activity logs
    const recentAdminActivities = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({
      success: true,
      counts: {
        testimonials: testimonialsCount,
        videos: videosCount,
        events: eventsCount,
        programs: programsCount,
        contacts: contactsCount,
        speakerRequests: speakerRequestsCount,
      },
      recentActivity: activityLogs.slice(0, 8),
      adminActivities: recentAdminActivities,
    });
  } catch (error: unknown) {
    console.error("Stats API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to gather statistics" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const auth = await verifyAuth(["superadmin"]);
    if (!auth.success) return auth.response!;

    await connectToDatabase();
    await ActivityLog.deleteMany({});

    return NextResponse.json({
      success: true,
      message: "Admin audit logs history cleared successfully.",
    });
  } catch (error: unknown) {
    console.error("Clear logs error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear logs history" },
      { status: 500 }
    );
  }
}
