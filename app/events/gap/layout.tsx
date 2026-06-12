import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GAP Workshop - Goal Alignment & Planning | Furute",
  description: "An intensive diagnostic workshop designed to identify business bottleneck areas and build structured execution roadmaps.",
  keywords: ["GAP workshop", "goal alignment", "business planning", "growth strategy", "execution roadmap"],
};

export default function GapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
