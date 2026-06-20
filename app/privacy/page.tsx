import Navbar from "@/components/layout/Navbar";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Furute business coaching and leadership mentoring.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "120px 24px 80px",
          fontFamily: "var(--font-inter), sans-serif",
          lineHeight: "1.7",
          color: "#1e293b",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
            fontSize: "40px",
            color: "#0f172a",
            marginBottom: "24px",
            fontWeight: "800",
          }}
        >
          Privacy Policy
        </h1>
        <p style={{ marginBottom: "16px", fontSize: "14px", color: "#64748b" }}>
          Last updated: June 20, 2026
        </p>

        <p style={{ marginBottom: "20px" }}>
          At Furute, we are committed to protecting your privacy. This Privacy
          Policy explains how we collect, use, and share information about you
          when you visit our website or use our coaching, consulting, and
          mentoring services.
        </p>

        <h2
          style={{
            fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
            fontSize: "24px",
            color: "#0f172a",
            marginTop: "40px",
            marginBottom: "16px",
            fontWeight: "700",
          }}
        >
          Information We Collect
        </h2>
        <p style={{ marginBottom: "16px" }}>
          We collect information directly from you when you submit inquiries
          through our contact forms, speaker invitation requests, register for
          programs, subscribe to our newsletter, or contact us. This may include
          your name, email address, phone number, organization name, and specific
          message text.
        </p>

        <h2
          style={{
            fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
            fontSize: "24px",
            color: "#0f172a",
            marginTop: "40px",
            marginBottom: "16px",
            fontWeight: "700",
          }}
        >
          How We Use Your Information
        </h2>
        <p style={{ marginBottom: "16px" }}>
          We use the information we collect to respond to your inquiries, schedule
          mentoring and consultation sessions, process program registration, email
          business insights, and manage newsletter subscriptions.
        </p>

        <h2
          style={{
            fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
            fontSize: "24px",
            color: "#0f172a",
            marginTop: "40px",
            marginBottom: "16px",
            fontWeight: "700",
          }}
        >
          Security
        </h2>
        <p style={{ marginBottom: "16px" }}>
          We implement appropriate technical and organizational measures to
          protect the security of your personal information. However, please note
          that no method of transmission over the Internet or electronic storage
          is 100% secure.
        </p>
      </main>
      <SiteFooter backTo="/privacy#" />
    </>
  );
}
