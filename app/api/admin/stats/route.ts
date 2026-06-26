import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import Video from "@/models/Video";
import Event from "@/models/Event";
import Program from "@/models/Program";
import Contact, { IContact } from "@/models/Contact";
import SpeakerRequest, { ISpeakerRequest } from "@/models/SpeakerRequest";
import ActivityLog from "@/models/ActivityLog";
import Newsletter from "@/models/Newsletter";
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
      pendingTestimonialsCount,
      pendingContactsCount,
      pendingSpeakerRequestsCount,
      draftProgramsCount,
    ] = await Promise.all([
      Testimonial.countDocuments(),
      Video.countDocuments(),
      Event.countDocuments(),
      Program.countDocuments(),
      Contact.countDocuments(),
      SpeakerRequest.countDocuments(),
      Testimonial.countDocuments({ visible: false }),
      Contact.countDocuments({ status: "pending" }),
      SpeakerRequest.countDocuments({ status: "pending" }),
      Program.countDocuments({ visible: false }),
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

    // ─── CHARTS AGGREGATION (LAST 6 MONTHS) ───
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [allContacts, allSpeakerRequests, allNewsletters] = await Promise.all([
      Contact.find({ createdAt: { $gte: sixMonthsAgo } }, "createdAt").lean(),
      SpeakerRequest.find({ createdAt: { $gte: sixMonthsAgo } }, "createdAt").lean(),
      Newsletter.find({ createdAt: { $gte: sixMonthsAgo } }, "createdAt").lean(),
    ]);

    const chartData: Array<{
      key: string;
      label: string;
      contacts: number;
      speakerRequests: number;
      newsletters: number;
    }> = [];

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const monthIndex = d.getMonth();
      const key = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
      const label = `${monthNames[monthIndex]} ${year}`;
      chartData.push({ key, label, contacts: 0, speakerRequests: 0, newsletters: 0 });
    }

    const getMonthKey = (date: Date): string => {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    };

    allContacts.forEach((c: any) => {
      const key = getMonthKey(c.createdAt);
      const m = chartData.find((x) => x.key === key);
      if (m) m.contacts++;
    });

    allSpeakerRequests.forEach((sr: any) => {
      const key = getMonthKey(sr.createdAt);
      const m = chartData.find((x) => x.key === key);
      if (m) m.speakerRequests++;
    });

    allNewsletters.forEach((n: any) => {
      const key = getMonthKey(n.createdAt);
      const m = chartData.find((x) => x.key === key);
      if (m) m.newsletters++;
    });

    return NextResponse.json({
      success: true,
      counts: {
        testimonials: testimonialsCount,
        videos: videosCount,
        events: eventsCount,
        programs: programsCount,
        contacts: contactsCount,
        speakerRequests: speakerRequestsCount,
        pendingTestimonials: pendingTestimonialsCount,
        pendingContacts: pendingContactsCount,
        pendingSpeakerRequests: pendingSpeakerRequestsCount,
        draftPrograms: draftProgramsCount,
      },
      recentActivity: activityLogs.slice(0, 8),
      adminActivities: recentAdminActivities,
      chartData,
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
