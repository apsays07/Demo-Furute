import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invite Ashay Shah as a Speaker | Furute",
  description:
    "Book Ashay Shah for keynote speeches, organization training, and business mentoring sessions. Bring clarity, confidence, and direction to your next event.",
};

export default function InviteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
