"use client";

import Link from "next/link";
import styles from "./SiteFooter.module.css";

const siteLinks = [
  "Insights",
  "Organization Training",
  "Sarathi",
  "Breakthrough",
  "Beyond the Classroom",
  "Goal Setting",
  "Leadership and Negotiation",
];

const services = ["Branding", "Consultancy", "Mentoring", "Digital Marketing"];

const highlights = [
  {
    title: "Invite Ashay Shah",
    text: "Keynotes and practical sessions for leadership and business audiences.",
    href: "/invite",
  },
  {
    title: "Furute Programs",
    text: "Training, mentoring, and guidance for business growth.",
    href: "/#programs",
  },
];

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14 8.8V7.2c0-.7.5-1.2 1.2-1.2H17V3h-2.6C11.7 3 10 4.7 10 7.4v1.4H7.5V12H10v9h3.5v-9h2.8l.5-3.2H14Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.7 10.7 20.3 3h-1.6L13 9.7 8.4 3H3l6.9 10.1L3 21h1.6l6-6.9 4.8 6.9H21l-7.3-10.3Zm-2.1 2.4-.7-1L5.3 4.2h2.3l4.5 6.4.7 1 5.9 8.3h-2.3l-4.8-6.8Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.7 8.8H3.4V21h3.3V8.8ZM5.1 3A1.9 1.9 0 1 0 5 6.8 1.9 1.9 0 0 0 5.1 3Zm8.4 5.8h-3.2V21h3.2v-6.4c0-1.7.8-2.7 2.1-2.7 1.2 0 1.8.9 1.8 2.7V21h3.2v-7.1c0-3.5-1.8-5.4-4.5-5.4-1.3 0-2.3.6-2.9 1.5h-.1l.4-1.2Z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5a3 3 0 0 0-2.1 2.1C2 9 2 12 2 12s0 3 .4 4.8a3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1C22 15 22 12 22 12s0-3-.4-4.8ZM10 15.4V8.6l5.8 3.4-5.8 3.4Z" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

export default function SiteFooter({ backTo = "#home" }) {
  return (
    <footer className={styles.footer} id="contact-us">
      <div className={styles.main}>
        <div className={styles.brand}>
          <img src="/furute-logo.png" alt="Furute" />
          <p>
            Practical business training, mentoring, and life coaching for
            people who want clearer direction and stronger execution.
          </p>
          <address>
            3rd Floor, Ujjivan Small Finance Bank,
            <br />
            Mitra Mandal Colony, Near Parvati,
            <br />
            Swargate, Pune, Maharashtra 411009
          </address>
        </div>

        <nav className={styles.column} aria-label="Footer site links">
          <h2>Explore</h2>
          {siteLinks.map((link) => (
            <Link href="/#programs" key={link}>
              {link}
            </Link>
          ))}
        </nav>

        <nav className={styles.column} aria-label="Footer services">
          <h2>Services</h2>
          {services.map((service) => (
            <Link href="/#services" key={service}>
              {service}
            </Link>
          ))}
        </nav>

        <div className={styles.contact}>
          <h2>Contact</h2>
          <a href="https://www.furute.in" target="_blank" rel="noreferrer">
            www.furute.in
          </a>
          <a href="mailto:info@furute.in">info@furute.in</a>
          <a href="tel:+919822600521">9822600521</a>

          <div className={styles.highlights}>
            {highlights.map((item) => (
              <Link href={item.href} key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>Copyright 2026 Furute. All rights reserved.</p>

        <div className={styles.socials} aria-label="Social links">
          <a href="https://www.facebook.com/furutein" target="_blank" rel="noreferrer" aria-label="Facebook">
            <FacebookIcon />
          </a>
          <a href="https://x.com/Furutekingmaker" target="_blank" rel="noreferrer" aria-label="X">
            <XIcon />
          </a>
          <a href="https://www.linkedin.com/company/furute-king-makers" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <LinkedInIcon />
          </a>
          <a href="https://www.youtube.com/ashayshah" target="_blank" rel="noreferrer" aria-label="YouTube">
            <YouTubeIcon />
          </a>
        </div>

        <a className={styles.backTop} href={backTo} aria-label="Back to top">
          <ArrowUpIcon />
        </a>
      </div>
    </footer>
  );
}
