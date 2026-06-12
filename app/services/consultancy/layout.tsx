import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Management Consultancy & Strategy in Pune | Furute",
  description: "Correct the flow of your business, improve operations, finance, human resources, and scale your brand with professional business coaching at Furute.",
  keywords: ["business consultancy", "management consultancy", "business strategies", "operations management", "finance consulting", "Pune consultants"],
};

export default function ConsultancyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
