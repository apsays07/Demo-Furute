import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "M.A.D. Digital Marketing Services in Pune | Furute",
  description: "Achieve real business outcomes with high-converting SEO, SMM, PPC paid ads, email marketing, and ORM reputation management services from Furute.",
  keywords: ["digital marketing", "SEO services", "PPC Google ads", "social media marketing", "reputation management", "Pune digital marketing"],
};

export default function DigitalMarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
