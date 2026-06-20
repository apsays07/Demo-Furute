import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workshops, Outbound Programs & Events",
  description: "Participate in upcoming experiential leadership events, outbound corporate workshops, and team-building camps with Furute.",
  keywords: ["events", "outbound corporate programs", "leadership workshops", "team building camp", "experiential training"],
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
