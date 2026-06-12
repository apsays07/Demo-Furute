import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Furute",
  description: "Leadership and Business Coaching",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
