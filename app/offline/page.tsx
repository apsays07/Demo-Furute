"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import SiteFooter from "@/components/layout/SiteFooter";

export default function OfflinePage() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

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
          background: "linear-gradient(180deg, #f1f5f9 0%, #ffffff 100%)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "560px" }}>
          <h1
            style={{
              fontSize: "clamp(60px, 10vw, 90px)",
              fontWeight: "900",
              color: "#475569",
              lineHeight: "1",
              margin: "0 0 16px",
              letterSpacing: "-0.04em",
              fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
            }}
          >
            Offline
          </h1>
          <h2
            style={{
              fontSize: "clamp(22px, 3.5vw, 28px)",
              fontWeight: "800",
              color: "#1e293b",
              margin: "0 0 16px",
              lineHeight: "1.2",
              fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
            }}
          >
            No Internet Connection
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "#64748b",
              lineHeight: "1.6",
              margin: "0 0 32px",
            }}
          >
            {online
              ? "You are back online. Click refresh to reload the application."
              : "It looks like you are currently disconnected from the network. Please check your internet connection."}
          </p>
          <button
            onClick={handleRefresh}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "48px",
              padding: "0 28px",
              background: "#1e293b",
              color: "#ffffff",
              fontWeight: "700",
              fontSize: "15px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              transition: "transform 0.2s ease",
              boxShadow: "0 4px 14px rgba(15, 23, 42, 0.2)",
            }}
          >
            Refresh Page
          </button>
        </div>
      </main>
      <SiteFooter backTo="#" />
    </>
  );
}
