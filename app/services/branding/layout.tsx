import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Branding & Brand Identity Services",
  description: "Audit and scale your brand identity, product positioning, and market presence in Pune with expert branding guidance from Ashay Shah at Furute.",
  keywords: ["branding", "brand identity", "business scaling", "Ashay Shah", "Furute", "Pune coaching"],
};

export default function BrandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
