import ProgramPageLayout from "@/components/shared/ProgramPageLayout";

export default function YoungAdultsPage() {
  return (
    <ProgramPageLayout
      category="Training Programs"
      title="YOUNG ADULTS"
      description="Purpose alignment, career focus, and emotional intelligence for the next generation."
      introText="The transition into adulthood, professional careers, or taking over family businesses is filled with pressure and friction. The Young Adults program (ideal for ages 16-25) is specifically designed to equip the next generation with essential leadership principles, self-discipline, emotional intelligence, and values alignment. We build active decision-making confidence so they step into their futures with clear direction."
      theme="violet"
      duration="6 Weeks (Weekend Workshops)"
      targetAudience={["Students (Ages 16-25)", "Young Professionals", "Next-Gen Family Heirs"]}
      contactSubject="Life Coaching"
      benefits={[
        "Identify core strengths and map career choices to your personal values",
        "Acquire self-discipline, time ownership, and goal execution frameworks",
        "Develop high emotional intelligence (EQ) to handle pressure and transitions",
        "Prepare to take over family business responsibilities with authority and confidence"
      ]}
      syllabus={[
        {
          title: "Self-Discovery & Values Alignment",
          description: "Uncover natural talents, clarify core life interests, and align them with structured future paths."
        },
        {
          title: "Execution & Ownership",
          description: "Establish daily scheduling habits, study techniques, financial literacy, and personal accountability."
        },
        {
          title: "Relational Dynamics & Leadership",
          description: "Learn communication boundaries, negotiation, mentorship, and building trust with senior peers."
        }
      ]}
    />
  );
}
