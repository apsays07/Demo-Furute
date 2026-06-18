import ProgramCard from "@/components/shared/ProgramCard";
import styles from "./ProgramsSection.module.css";

const programs = [
  {
    title: "Insights",
    text: "Practical market and self-awareness inputs that help you see the next decision with clarity.",
    theme: "insights",
  },
  {
    title: "Organization Training",
    text: "Structured learning sessions for teams to improve communication, ownership, and execution.",
    theme: "training",
  },
  {
    title: "Goal Setting",
    text: "Focused frameworks to turn ambition into measurable milestones and daily action.",
    theme: "goals",
  },
  {
    title: "Branding",
    text: "Guidance to shape a sharper identity, stronger message, and more memorable market presence.",
    theme: "branding",
  },
  {
    title: "Consultancy",
    text: "Business mentoring that helps diagnose challenges and build practical growth plans.",
    theme: "consultancy",
  },
  {
    title: "Breakthrough",
    text: "Mindset and strategy work for moving past stuck points with renewed confidence.",
    theme: "breakthrough",
  },
  {
    title: "Sarathi",
    text: "Personal guidance and support for important transitions, decisions, and direction.",
    theme: "sarathi",
  },
  {
    title: "Beyond The Classroom",
    text: "Experiential learning that connects concepts with real business and life situations.",
    theme: "classroom",
  },
  {
    title: "Mentoring",
    text: "One-on-one support to strengthen thinking, leadership habits, and long-term growth.",
    theme: "mentoring",
  },
];

export default function ProgramsSection() {
  return (
    <section id="programs" className={styles["programs-overview"]} aria-label="Programs And Services">
      <div className={styles["programs-overview-inner"]}>
        <p className={styles["section-eyebrow"]}>Programs And Services</p>
        <h2>Our Programs And Services Overview</h2>

        <div className={styles["program-grid"]}>
          {programs.map((program) => (
            <ProgramCard
              key={program.title}
              title={program.title}
              text={program.text}
              theme={program.theme}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
