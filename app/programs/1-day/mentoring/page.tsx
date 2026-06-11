import ProgramPageLayout from "@/components/ProgramPageLayout";

export default function MentoringPage() {
  return (
    <ProgramPageLayout
      category="1 Day Training Programs"
      title="Mentoring"
      description="One-on-one support to strengthen thinking, leadership habits, and long-term growth."
      introText="Mentoring is a high-speed, direct 1-on-1 feedback session. This program is designed for executives, business heirs, or active managers who need immediate, objective guidance on specific bottlenecks, career pivots, or leadership challenges. We skip theoretical lessons and dive straight into your current situations, providing actionable advice based on 20 years of hands-on business experience."
      theme="violet"
      duration="1-Day Focused Session (4 to 6 Hours)"
      targetAudience={["Executives", "Management Trainees", "Next-Gen Heirs"]}
      contactSubject="Life Coaching"
      benefits={[
        "Receive direct, no-nonsense 1-on-1 feedback on your specific situation",
        "Resolve high-priority conflicts, career choices, or strategy blocks immediately",
        "Learn to structure your daily schedules and thinking for long-term growth",
        "Identify hidden biases, habits, or mindset gaps holding back your progress"
      ]}
      syllabus={[
        {
          title: "Challenge Diagnostics",
          description: "Bring your single most complex current issue (conflict, pivot, negotiation) for direct audit."
        },
        {
          title: "Framework Resolution",
          description: "Deconstruct the challenge using practical models and select the optimal execution pathway."
        },
        {
          title: "Accountability Action Plan",
          description: "Create a detailed checklist of immediate next steps, complete with tracking and boundary guidelines."
        }
      ]}
    />
  );
}
