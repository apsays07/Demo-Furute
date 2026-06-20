import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata = {
  title: "Unauthorized Access",
  description: "Access denied. Please authenticate as administrator.",
};

export default function UnauthorizedPage() {
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
          background: "linear-gradient(180deg, #fffcf6 0%, #ffffff 100%)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "560px" }}>
          <h1
            style={{
              fontSize: "clamp(70px, 11vw, 100px)",
              fontWeight: "900",
              color: "#f97316",
              lineHeight: "1",
              margin: "0 0 16px",
              letterSpacing: "-0.04em",
              fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
            }}
          >
            401
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
            Access Unauthorized
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "#64748b",
              lineHeight: "1.6",
              margin: "0 0 32px",
            }}
          >
            You do not have the required permissions to view this resource. Please
            log in as an administrator first.
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
              href="/admin/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "48px",
                padding: "0 28px",
                background: "#0f172a",
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "15px",
                borderRadius: "8px",
                textDecoration: "none",
                transition: "transform 0.2s ease",
                boxShadow: "0 4px 14px rgba(15, 23, 42, 0.2)",
              }}
            >
              Sign In
            </Link>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "48px",
                padding: "0 28px",
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
