import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import SpeakerRequest from "@/models/SpeakerRequest";
import Testimonial from "@/models/Testimonial";
import { verifyAuth } from "@/lib/auth/verifyAuth";

export async function GET() {
  try {
    // Only superadmin can trigger full database backups
    const auth = await verifyAuth(["superadmin"]);
    if (!auth.success) return auth.response!;

    await connectToDatabase();

    const [contacts, speakerRequests, testimonials] = await Promise.all([
      Contact.find().lean(),
      SpeakerRequest.find().lean(),
      Testimonial.find().lean(),
    ]);

    const backupData = {
      backupDate: new Date().toISOString(),
      contacts,
      speakerRequests,
      testimonials,
    };

    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `furute_db_backup_${dateStr}.json`;

    return new Response(JSON.stringify(backupData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error: unknown) {
    console.error("Backup API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate database backup" },
      { status: 500 }
    );
  }
}
