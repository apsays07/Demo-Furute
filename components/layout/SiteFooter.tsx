
import Link from "next/link";
import Image from "next/image";
import styles from "./SiteFooter.module.css";
import {
  FacebookIcon,
  XIcon,
  LinkedInIcon,
  YouTubeIcon,
  ArrowUpIcon,
} from "@/components/ui/Icons";

const siteLinks: string[] = [
  "Insights",
  "Organization Training",
  "Sarathi",
  "Breakthrough",
  "Beyond the Classroom",
  "Goal Setting",
  "Leadership and Negotiation",
];

const services: string[] = ["Branding", "Consultancy", "Mentoring", "Digital Marketing"];

interface HighlightItem {
  title: string;
  text: string;
  href: string;
}

const highlights: HighlightItem[] = [
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

interface SiteFooterProps {
  backTo?: string;
}

export default function SiteFooter({ backTo = "#home" }: SiteFooterProps) {
  return (
    <footer className={styles.footer} id="contact-us">
      <div className={styles.main}>
        <div className={styles.brand}>
          <Image src="/lion-logo.png" alt="Furute" width={190} height={94} loading="lazy" quality={75} sizes="190px" />
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
          <a href="https://www.furute.in" target="_blank" rel="noopener noreferrer">
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
          <a href="https://www.facebook.com/furutein" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FacebookIcon />
          </a>
          <a href="https://x.com/Furutekingmaker" target="_blank" rel="noopener noreferrer" aria-label="X">
            <XIcon />
          </a>
          <a href="https://www.linkedin.com/company/furute-king-makers" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <LinkedInIcon />
          </a>
          <a href="https://www.youtube.com/ashayshah" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
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
