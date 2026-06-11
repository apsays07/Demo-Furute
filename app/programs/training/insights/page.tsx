import ProgramPageLayout from "@/components/ProgramPageLayout";

export default function InsightsPage() {
  return (
    <ProgramPageLayout
      category="Training Programs"
      title="Insights"
      description="Practical market and self-awareness inputs that help you see the next decision with clarity."
      introText="Our Insights program is designed for business leaders, founders, and executives who need to filter out the noise and focus on what truly drives market results. Through structured analysis, market trend reviews, and direct self-awareness exercises, you will develop a sharp, objective perspective on your company's immediate opportunities and challenges."
      theme="teal"
      duration="4 Sessions (1 Month)"
      targetAudience={["Business Owners", "Founders", "CEOs"]}
      contactSubject="Business Mentoring"
      benefits={[
        "Identify current market shifts before they affect your bottom line",
        "Develop objective self-awareness of your leadership strengths and bottlenecks",
        "Acquire framework-based decision making to filter complex choices",
        "Formulate a clear 90-day action plan for immediate growth"
      ]}
      syllabus={[
        {
          title: "Market Clarity",
          description: "Learn to diagnose active market shifts, consumer behaviour changes, and industry distribution trends."
        },
        {
          title: "Subconscious Auditing",
          description: "Identify hidden operational fears, risk-aversion, or scaling limits holding you back."
        },
        {
          title: "Clarity Execution",
          description: "Synthesize findings into actionable milestones, aligning your team to execute without micro-management."
        }
      ]}
    />
  );
}
