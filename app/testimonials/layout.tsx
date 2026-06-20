import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Read success stories, client reviews, and testimonials from professionals who transformed their lives and businesses with Furute.",
};

export default function TestimonialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
