import ProgramPageLayout from "@/components/shared/ProgramPageLayout";

export default function BusinessCommunicationPage() {
  return (
    <ProgramPageLayout
      category="1 Day Training Programs"
      title="Business Communication"
      description="Effective communication skills training to align teams, clarify goals, and run operations smoothly."
      introText="Friction, delays, and errors in business are almost always communication failures. The Business Communication training program is an intensive 1-day session that equips your team with practical verbal, written, and collaborative frameworks. We focus on active listening, conflict reduction, precise task delegation, and reporting routines that make team alignment seamless."
      theme="gold"
      duration="1-Day Intensive (8 Hours)"
      targetAudience={["Corporate Teams", "Executives", "Department Managers"]}
      contactSubject="Business Mentoring"
      benefits={[
        "Reduce workplace friction and misunderstandings between departments",
        "Acquire standard email, Slack, and reporting templates for daily operations",
        "Master precise delegation methods that guarantee high task accuracy",
        "Practice conflict-resolution and constructive feedback techniques"
      ]}
      syllabus={[
        {
          title: "Communication Auditing",
          description: "Isolate bottlenecks in your current communication pathways and list key friction points."
        },
        {
          title: "Precise Delegation Frameworks",
          description: "Train team leaders on how to assign tasks, check comprehension, and track milestones."
        },
        {
          title: "Reporting & Feedback Loops",
          description: "Establish daily/weekly report templates and constructive feedback routines to ensure accountability."
        }
      ]}
    />
  );
}
