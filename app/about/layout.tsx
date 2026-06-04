import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Ashay Shah & Furute | Business Trainer & Life Coach",
  description:
    "Learn about Ashay Shah, founder of Furute. Discover his 20-year entrepreneurial journey, leadership DNA, core values, and how he has trained over 8,000 leaders.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
