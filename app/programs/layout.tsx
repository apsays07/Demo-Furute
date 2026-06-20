import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programs",
  description: "Explore our leadership training, goal setting, breakthrough mentoring, and organizational capability building programs.",
};

export default function ProgramsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
