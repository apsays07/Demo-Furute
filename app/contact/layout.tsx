import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Furute - Business Training & Life Coaching",
  description:
    "Get in touch with the Furute team. Ask questions about our business mentoring, mindset coaching, or organizational training programs. Let's make a difference together.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
