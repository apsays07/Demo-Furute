"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import SiteFooter from "@/components/layout/SiteFooter";
import { ArrowLeftIcon, ArrowRightIcon, PhoneIcon } from "@/components/ui/Icons";
import styles from "./events.module.css";

// -------------------------------------------------------------
// EVENTS DATA DEFINITION
// -------------------------------------------------------------

type EventItem = {
  title: string;
  category: "Workshop" | "Outbound" | "Awards" | "Program";
  badgeClass: string;
  description: string;
  image: string;
  link?: string;
  forthcoming?: boolean;
  timing?: string;
};

const events: EventItem[] = [
  {
    title: "WOW Life",
    category: "Workshop",
    badgeClass: "badge-workshop",
    description: "Experiential personal growth training program focused on mindset development, emotional maturity, consistency, and holistic lifestyle enhancement.",
    image: "/events/wow-life.jpg",
    link: "https://furute.in/wow-life/",
  },
  {
    title: "Insights",
    category: "Workshop",
    badgeClass: "badge-workshop",
    description: "Practical leadership training, market analysis, and self-awareness inputs. Learn the right set of skills and attitude to become a successful entrepreneur.",
    image: "/events/insights.jpg",
    link: "https://furute.in/programs/business-insights-pune-leadership-development-program/",
  },
  {
    title: "WHY?",
    category: "Workshop",
    badgeClass: "badge-workshop",
    description: "Clarify your core motivation and focus. Discover your business and personal goals to align your actions with your ultimate purpose.",
    image: "/events/why-small.jpg",
    link: "https://furute.in/why/",
  },
  {
    title: "MUD ATTACK",
    category: "Outbound",
    badgeClass: "badge-outbound",
    description: "Mud Rush Biggest Fun Fest now in Pune. Forget everything, get outdoors, run, build team bonding, and experience physical endurance challenges.",
    image: "/events/mud-rush.jpg",
    link: "/events/mudrush",
  },
  {
    title: "Furute Awards",
    category: "Awards",
    badgeClass: "badge-awards",
    description: "Celebrating entrepreneurship, consistency, and growth results. Recognizing standout individuals who turned business insights into massive growth.",
    image: "/events/awards.jpg",
    link: "https://furute.in/awards/",
  },
  {
    title: "Do's & Don'ts for Start Ups",
    category: "Program",
    badgeClass: "badge-program",
    description: "Forthcoming Program. Fundamental checklists and risk mitigation strategies to co-create a stable, high-efficiency business setup.",
    image: "/events/start-ups.jpg",
    forthcoming: true,
    timing: "For details call: 020-26131921 / 8378980521",
  },
  {
    title: "Understand the 4th Monkey for Success",
    category: "Program",
    badgeClass: "badge-program",
    description: "Forthcoming Program. A deep dive into modern consumer mindset shifts, execution habits, and key success factors for scaling up business models.",
    image: "/events/4th-monkey.jpg",
    forthcoming: true,
    timing: "For details call: 020-26131921 / 8378980521",
  },
  {
    title: "Rajgad Trek",
    category: "Outbound",
    badgeClass: "badge-outbound",
    description: "Outbound trek for entrepreneurs and leadership teams. Connect concepts of strategy and resilience with actual wilderness adventure.",
    image: "/events/gap.jpg",
    link: "https://www.facebook.com/furutein",
  },
  {
    title: "Be the Trainer",
    category: "Program",
    badgeClass: "badge-program",
    description: "Forthcoming Program. Learn key presentation skills, public speaking styles, workshop facilitation, and mentorship frameworks.",
    image: "/events/be-the-trainer.jpg",
    forthcoming: true,
    timing: "For details call: 020-26131921 / 8378980521",
  },
  {
    title: "GAP - Know It, Outgrow It",
    category: "Workshop",
    badgeClass: "badge-workshop",
    description: "Identify, understand, and systematically eliminate all organizational, financial, and mindset GAPs holding back your business and life.",
    image: "/events/gap.jpg",
    link: "/events/gap",
  },
];

// -------------------------------------------------------------
// FRAMER MOTION ANIMATION VARIANTS
// -------------------------------------------------------------

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

export default function EventsPage() {
  return (
    <main className={styles.page}>
      {/* Visual Ambient Background Elements */}
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />
      <div className={styles.blob3} aria-hidden="true" />

      {/* Unified Global Navbar */}
      <Navbar />

      {/* Back button and page intro */}
      <motion.section 
        className={styles.hero}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <Link href="/" className={styles["back-link"]}>
          <ArrowLeftIcon />
          Back to home
        </Link>

        <p className={styles.eyebrow}>Batches & Outbounds</p>
        <h1>Our Events & Workshops</h1>
        <p className={styles.lead}>
          Take a look at our upcoming learning batches, award ceremonies, and outbound 
          experiential adventure programs built for holistic entrepreneur development.
        </p>
      </motion.section>

      {/* Events Grid Section */}
      <motion.section 
        className={styles["grid-section"]}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={staggerContainer}
      >
        <div className={styles["events-grid"]}>
          {events.map((event, index) => (
            <motion.article 
              className={styles["event-card"]} 
              key={index}
              variants={fadeInUp}
            >
              <div className={styles["badge-header"]}>
                <span className={`${styles.badge} ${styles[event.badgeClass]}`}>
                  {event.category}
                </span>
              </div>

              <div className={styles["image-wrap"]}>
                <Image 
                  src={event.image} 
                  alt={event.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              <div className={styles["card-body"]}>
                <h3>{event.title}</h3>
                <p>{event.description}</p>

                {event.forthcoming && event.timing && (
                  <div className={styles["forthcoming-box"]}>
                    <span>Forthcoming Program</span>
                    <p>{event.timing}</p>
                  </div>
                )}

                <div className={styles["card-footer"]}>
                  {event.link ? (
                    event.link.startsWith("http") ? (
                      <a 
                        href={event.link} 
                        target="_blank" 
                        rel="noreferrer" 
                        className={styles["card-cta"]}
                      >
                        View Details
                        <ArrowRightIcon className={styles["cta-arrow"]} />
                      </a>
                    ) : (
                      <Link 
                        href={event.link} 
                        className={styles["card-cta"]}
                      >
                        View Details
                        <ArrowRightIcon className={styles["cta-arrow"]} />
                      </Link>
                    )
                  ) : (
                    <Link 
                      href="/contact?subject=General Inquiry" 
                      className={styles["card-cta"]}
                    >
                      Inquire Now
                      <ArrowRightIcon className={styles["cta-arrow"]} />
                    </Link>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      {/* Call-to-Action Section */}
      <section className={styles["cta-section"]}>
        <motion.div 
          className={styles["cta-inner"]}
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <div className={styles["cta-eyebrow"]}>
            <span>Tailored Solutions</span>
          </div>
          <h2>
            Want a <span className={styles["cta-highlight"]}>customized workshop</span> for your team?
          </h2>
          <p>
            We organize outbound team-building camps, customized marketing insights programs, 
            and goal-setting sessions tailored to target specific growth milestones.
          </p>
          <div className={styles["cta-buttons"]}>
            <Link href="/contact" className={styles["primary-btn"]}>
              Contact Our Team
              <ArrowRightIcon />
            </Link>
            <a href="tel:+919822600521" className={styles["secondary-btn"]}>
              <PhoneIcon />
              Call Support: +91 9822600521
            </a>
          </div>
        </motion.div>
      </section>

      <SiteFooter backTo="/events#" />
    </main>
  );
}
