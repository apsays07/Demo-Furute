import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The MudRush - Corporate Outbound Mud Challenge | Furute",
  description: "Join the ultimate outbound corporate event featuring military-style obstacle races, team cooperation challenges, camping, and live music.",
  keywords: ["MudRush", "corporate outbound", "team cooperation", "obstacle race", "camping", "team building"],
};

export default function MudrushLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
