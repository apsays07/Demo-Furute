"use client";

import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import SiteFooter from "@/components/layout/SiteFooter";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error boundary triggered:", error);
  }, [error]);

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
          background: "linear-gradient(180deg, #fff5f5 0%, #ffffff 100%)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "560px" }}>
          <h1
            style={{
              fontSize: "clamp(80px, 12vw, 120px)",
              fontWeight: "900",
              color: "#e45f4f",
              lineHeight: "1",
              margin: "0 0 16px",
              letterSpacing: "-0.05em",
              fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
            }}
          >
            500
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
            Something went wrong!
          </h2>
          <p
            style={{
              fontSize: "18px",
              color: "#64748b",
              lineHeight: "1.6",
              margin: "0 0 32px",
            }}
          >
            An unexpected error occurred on the server. Our technical team has
            been notified.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => reset()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "48px",
                padding: "0 24px",
                background: "#087f8c",
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "15px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                transition: "transform 0.2s ease",
                boxShadow: "0 4px 14px rgba(8, 127, 140, 0.25)",
              }}
            >
              Try Again
            </button>
            <Link
              href="/"
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
              Return Home
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter backTo="#" />
    </>
  );
}
