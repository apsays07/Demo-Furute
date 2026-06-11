import ProgramPageLayout from "@/components/ProgramPageLayout";

export default function LeadershipAndNegotiationPage() {
  return (
    <ProgramPageLayout
      category="1 Day Training Programs"
      title="Leadership and Negotiation"
      description="High-impact training to strengthen decision-making, negotiation psychology, and management confidence."
      introText="Leadership is not a title; it is a set of active behaviors. The Leadership and Negotiation 1-day program is designed for executives and managers who need to steer teams, negotiate high-value contracts, and handle difficult client or vendor situations. We teach negotiation psychology, active listening commands, and framework-based decision making."
      theme="coral"
      duration="1-Day Intensive (8 Hours)"
      targetAudience={["CEOs", "Directors", "Sales Leaders", "Senior Managers"]}
      contactSubject="Business Mentoring"
      benefits={[
        "Develop a commanding leadership presence and communication confidence",
        "Master win-win negotiation psychology to secure better client/vendor contracts",
        "Learn decision-making frameworks to resolve high-stress issues quickly",
        "Establish active delegation and authority boundaries"
      ]}
      syllabus={[
        {
          title: "Leadership Psychology",
          description: "Audit your management style and learn behavior traits that build immediate trust with teams."
        },
        {
          title: "Negotiation Tactics",
          description: "Learn active listening commands, value anchoring, and concession management in high-stakes deals."
        },
        {
          title: "Decision-Making & Delegation",
          description: "Deploy decision matrices to evaluate risks objectively and delegate tasks with confidence."
        }
      ]}
    />
  );
}
