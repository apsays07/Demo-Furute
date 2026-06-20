import Navbar from "@/components/layout/Navbar";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata = {
  title: "Terms & Conditions",
  description: "Terms and Conditions of service for Furute leadership and business coaching.",
};

export default function TermsPage() {
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
          Terms & Conditions
        </h1>
        <p style={{ marginBottom: "16px", fontSize: "14px", color: "#64748b" }}>
          Last updated: June 20, 2026
        </p>

        <p style={{ marginBottom: "20px" }}>
          Welcome to Furute. By accessing our website and using our professional
          business mentoring, life coaching, or corporate training services, you
          agree to comply with and be bound by the following terms and conditions.
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
          Use of Services
        </h2>
        <p style={{ marginBottom: "16px" }}>
          All program materials, training frameworks, mentoring worksheets, and
          keynote content developed by Ashay Shah and the Furute team are
          protected under intellectual property laws. You agree not to distribute,
          resell, or replicate any of our training materials without prior written
          consent.
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
          Disclaimer
        </h2>
        <p style={{ marginBottom: "16px" }}>
          Business mentoring, goal setting, and coaching results vary based on
          individual and organizational execution. While Ashay Shah brings over 20
          years of mentoring experience, Furute does not guarantee specific commercial
          outcomes or earnings.
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
          Contact & Governing Law
        </h2>
        <p style={{ marginBottom: "16px" }}>
          These terms are governed by the laws of India, and any disputes will be
          subject to the exclusive jurisdiction of the courts in Pune, Maharashtra.
        </p>
      </main>
      <SiteFooter backTo="/terms#" />
    </>
  );
}
