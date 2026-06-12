import ProgramPageLayout from "@/components/shared/ProgramPageLayout";

export default function GoalSettingPage() {
  return (
    <ProgramPageLayout
      category="1 Day Training Programs"
      title="Goal Setting"
      description="Focused frameworks to turn ambition into measurable milestones and daily action."
      introText="An idea without a deadline and a concrete execution plan is just a wish. The Goal Setting program is a high-intensity, one-day workshop where you will strip away general ambitions and compile a rigid 90-day execution framework. We focus on priority architecting: identifying the single critical metric that will move your business forward and establishing the exact daily habits required to hit it."
      theme="teal"
      duration="1-Day Intensive (8 Hours)"
      targetAudience={["Entrepreneurs", "Solo-founders", "Corporate Leaders"]}
      contactSubject="Business Mentoring"
      benefits={[
        "Identify and anchor your single most critical business goal",
        "Acquire the 90-day milestone architecting framework",
        "Dismantle daily operational distractions using the 90/10 focus rule",
        "Establish clear accountability check-in routines for your team"
      ]}
      syllabus={[
        {
          title: "Priority Auditing",
          description: "Filter out minor objectives to isolate the one lever that generates maximum progress."
        },
        {
          title: "Milestone Structuring",
          description: "Deconstruct your main goal into weekly sprints and individual responsibilities."
        },
        {
          title: "Habit Anchoring",
          description: "Design a daily trigger checklist to ensure execution is consistent and trackable."
        }
      ]}
    />
  );
}
