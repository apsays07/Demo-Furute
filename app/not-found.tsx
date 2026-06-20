"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import SiteFooter from "@/components/layout/SiteFooter";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: "80vh",
          display: "grid",
          placeItems: "center",
          padding: "120px 24px 80px",
          fontFamily: "var(--font-inter), sans-serif",
          background: "linear-gradient(180deg, #f7fbff 0%, #ffffff 100%)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "560px" }}>
          <h1
            style={{
              fontSize: "clamp(80px, 12vw, 120px)",
              fontWeight: "900",
              color: "#0f172a",
              lineHeight: "1",
              margin: "0 0 16px",
              letterSpacing: "-0.05em",
              fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
            }}
          >
            404
          </h1>
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 32px)",
              fontWeight: "800",
              color: "#1e293b",
              margin: "0 0 16px",
              lineHeight: "1.2",
              fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
            }}
          >
            Page Not Found
          </h2>
          <p
            style={{
              fontSize: "18px",
              color: "#64748b",
              lineHeight: "1.6",
              margin: "0 0 32px",
            }}
          >
            The page you are looking for doesn&apos;t exist or has been moved. Check
            the URL or return to home.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "48px",
                padding: "0 24px",
                background: "#1e40af",
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "15px",
                borderRadius: "8px",
                textDecoration: "none",
                transition: "transform 0.2s ease",
                boxShadow: "0 4px 14px rgba(30, 64, 175, 0.25)",
              }}
            >
              Return Home
            </Link>
            <Link
              href="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "48px",
                padding: "0 24px",
                background: "#ffffff",
                color: "#1e293b",
                fontWeight: "750",
                fontSize: "15px",
                borderRadius: "8px",
                border: "1px solid rgba(16, 27, 53, 0.12)",
                textDecoration: "none",
                transition: "transform 0.2s ease",
              }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter backTo="#" />
    </>
  );
}
