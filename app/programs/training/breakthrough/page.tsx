import ProgramPageLayout from "@/components/ProgramPageLayout";

export default function BreakthroughPage() {
  return (
    <ProgramPageLayout
      category="Training Programs"
      title="Breakthrough"
      description="Mindset and strategy work for moving past stuck points with renewed confidence."
      introText="When growth stalls, the bottleneck is rarely a lack of resources; it is usually a bottleneck in strategy or mindset. Breakthrough is an intensive coaching program that combines Neuro-Linguistic Programming (NLP) and tactical business reframing. We dismantle subconscious limitations, scale operational risk tolerance, and re-engineer how you handle high-pressure decisions."
      theme="violet"
      duration="6 Intensive Sessions (3 Months)"
      targetAudience={["Stagnated Founders", "High-Stress Executives", "Leaders in Transition"]}
      contactSubject="Life Coaching"
      benefits={[
        "Dismantle imposter syndrome, stress triggers, and decision paralysis",
        "Unlock scaling blocks by reshaping your subconscious risk tolerance",
        "Master high-stakes negotiation psychology and boardroom presence",
        "Develop unshakeable emotional resilience during company crises"
      ]}
      syllabus={[
        {
          title: "Neuro-Linguistic Audit",
          description: "Decode subconscious language patterns, limiting beliefs, and stress-response pathways."
        },
        {
          title: "Strategic Reframing",
          description: "Re-engineer business bottlenecks into strategic pivot points using active NLP methodologies."
        },
        {
          title: "Certainty Integration",
          description: "Anchor absolute internal certainty, allowing you to execute bold hiring, scaling, or capital decisions."
        }
      ]}
    />
  );
}
