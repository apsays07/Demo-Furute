import ProgramPageLayout from "@/components/shared/ProgramPageLayout";

export default function BeyondTheClassroomPage() {
  return (
    <ProgramPageLayout
      category="Training Programs"
      title="Beyond the Classroom"
      description="Experiential learning that connects concepts with real business and life situations."
      introText="Concepts memorized in a lecture hall are easily forgotten. True leadership patterns are built through action and experience. Beyond the Classroom is an outdoor, activity-based learning program that takes teams and individuals out of their comfort zones. By solving immersive physical and tactical challenges, participants build visceral trust, operational synchronization, and decision-making clarity."
      theme="mint"
      duration="2-Day Weekend Bootcamp"
      targetAudience={["Corporate Teams", "Cross-Functional Departments", "Management Trainees"]}
      contactSubject="Organization Training"
      benefits={[
        "Translate theoretical management models into immediate group execution",
        "Identify hidden team leaders and assess individual stress-handling capacity",
        "Forge unbreakable bonds and mutual trust across departments",
        "Practice strategic agility and resource optimization under real-time constraints"
      ]}
      syllabus={[
        {
          title: "Physical & Mental Deconditioning",
          description: "Step away from typical screens and boardrooms into structured, team-based outdoor scenarios."
        },
        {
          title: "Immersive Problem Solving",
          description: "Participate in simulated resource crisis, survival, and communication bottleneck tasks."
        },
        {
          title: "Reflective Synthesis & Action",
          description: "Debrief after each challenge to translate outdoor behaviors directly back into workplace habits."
        }
      ]}
    />
  );
}
