import type { Metadata } from "next";
import {
  Inter,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://furute.com"),

  title: {
    default: "Furute | Leadership & Business Coaching",
    template: "%s | Furute",
  },

  description:
    "Empowering individuals and organizations through leadership development, mentoring, business consulting, branding, and professional training programs.",

  keywords: [
    "Leadership",
    "Business Coaching",
    "Corporate Training",
    "Consulting",
    "Mentoring",
    "Branding",
    "Digital Marketing",
    "Professional Development",
  ],

  authors: [
    {
      name: "Furute",
    },
  ],

  creator: "Furute",

  publisher: "Furute",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Furute",
    description:
      "Leadership Development, Business Consulting, Corporate Training & Mentoring.",

    type: "website",

    locale: "en_US",

    siteName: "Furute",
  },

  twitter: {
    card: "summary_large_image",
    title: "Furute",
    description:
      "Leadership Development, Business Consulting & Corporate Training.",
  },

  icons: {
    icon: "/favicon-image.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-white text-black">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Furute",
              "url": "https://furute.in",
              "logo": "https://furute.in/lion-logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-9822600521",
                "contactType": "customer service",
                "areaServed": "IN",
                "availableLanguage": ["en", "hi", "mr"],
              },
              "sameAs": [
                "https://www.linkedin.com/company/furute-king-makers",
                "https://www.youtube.com/ashayshah",
                "https://www.facebook.com/furutein",
              ],
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}