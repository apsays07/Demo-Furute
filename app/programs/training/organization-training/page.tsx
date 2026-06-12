import ProgramPageLayout from "@/components/shared/ProgramPageLayout";

export default function OrganizationTrainingPage() {
  return (
    <ProgramPageLayout
      category="Training Programs"
      title="Organization Training"
      description="Structured learning sessions for teams to improve communication, ownership, and execution."
      introText="Healthy organizations do not happen by accident; they are engineered. The Organization Training program focuses on aligning your entire workforce, starting with middle management up to executive leadership. We address friction in team dynamics, establish high accountability, and deploy SOPs that allow the founder to step back from day-to-day firefighting."
      theme="gold"
      duration="3 to 6 Months (Customized)"
      targetAudience={["Corporate Teams", "Managers", "Department Heads"]}
      contactSubject="Organization Training"
      benefits={[
        "Eradicate operational micromangement and build independent teams",
        "Establish clear, friction-free internal communication flows",
        "Train middle managers to take complete ownership of key metrics",
        "Design and implement Standard Operating Procedures (SOPs) that stick"
      ]}
      syllabus={[
        {
          title: "Team Alignment & DNA",
          description: "Audit existing communication gaps, define roles precisely, and align everyone to the core company goal."
        },
        {
          title: "High-Performance Execution",
          description: "Implement execution dashboards, weekly progress sprint routines, and accountability trackers."
        },
        {
          title: "Systems & Scaling",
          description: "Document workflows, build SOP packages, and delegate operational leadership to managers."
        }
      ]}
    />
  );
}
