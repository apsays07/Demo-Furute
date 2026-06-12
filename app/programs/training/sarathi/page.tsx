import ProgramPageLayout from "@/components/shared/ProgramPageLayout";

export default function SarathiPage() {
  return (
    <ProgramPageLayout
      category="Training Programs"
      title="Sarathi Mentorship Path"
      description="Personal guidance and support for important transitions, decisions, and direction."
      introText="Sarathi is our most exclusive, high-proximity program. Actively guided by Ashay Shah, this 1-on-1 mentorship serves as your trusted advisory circle. We address family business alignment, high-stakes dispute resolution, critical operational pivots, and the intersection of aggressive scaling with deep personal peace. This program has extremely limited slots and is subject to qualification."
      theme="rose"
      duration="Ongoing / Year-Long Advisory"
      targetAudience={["Family Business Directors", "Established Entrepreneurs", "CEOs"]}
      contactSubject="Business Mentoring"
      benefits={[
        "1-on-1 strategic boardroom advisory and operational audits",
        "Conflict resolution and alignment for family-run businesses",
        "High-proximity crisis management and transition steering",
        "Achieve personal alignment, purpose, and profound peace alongside scaling"
      ]}
      syllabus={[
        {
          title: "Boardroom Audit",
          description: "A deep dive into your business model, governance, and private bottlenecks alongside Ashay Shah."
        },
        {
          title: "Crisis & Conflict Alignment",
          description: "Deploy custom mediation frameworks to align family partners, resolve disputes, and stabilize leadership."
        },
        {
          title: "Ongoing Advisory",
          description: "Regular 1-on-1 check-ins, strategic roadmap updates, and emergency priority calls."
        }
      ]}
    />
  );
}
