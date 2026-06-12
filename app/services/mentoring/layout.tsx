import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Mentoring & Personal Coaching in Pune | Furute",
  description: "Strengthen your leadership skills, confidence, emotional intelligence, and business growth through one-on-one personal mentoring with Ashay Shah.",
  keywords: ["mentoring", "personal coaching", "leadership growth", "business mentor", "Ashay Shah", "Pune mentoring"],
};

export default function MentoringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
