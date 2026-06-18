"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import SiteFooter from "@/components/layout/SiteFooter";
import { ArrowLeftIcon, ArrowRightIcon, PhoneIcon } from "@/components/ui/Icons";
import styles from "./events.module.css";

// -------------------------------------------------------------
// DB EVENT TYPE (from admin panel)
// -------------------------------------------------------------
interface DBEvent {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
  registrationLink?: string;
  status: "upcoming" | "past" | "active";
  featured: boolean;
}

// -------------------------------------------------------------
// STATIC EVENTS DATA DEFINITION (existing hardcoded events)
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

const staticEvents: EventItem[] = [
  {
    title: "WOW Life",
    category: "Workshop",
    badgeClass: "badge-workshop",
    description: "Experiential personal growth training program focused on mindset development, emotional maturity, consistency, and holistic lifestyle enhancement.",
    image: "/events/wow-life.webp",
    link: "/events/wow-life",
  },
  {
    title: "Insights",
    category: "Workshop",
    badgeClass: "badge-workshop",
    description: "Practical leadership training, market analysis, and self-awareness inputs. Learn the right set of skills and attitude to become a successful entrepreneur.",
    image: "/events/insights.webp",
    link: "/events/insights",
  },
  {
    title: "WHY?",
    category: "Workshop",
    badgeClass: "badge-workshop",
    description: "Clarify your core motivation and focus. Discover your business and personal goals to align your actions with your ultimate purpose.",
    image: "/events/why-small.webp",
    link: "/events/why",
  },
  {
    title: "MUD ATTACK",
    category: "Outbound",
    badgeClass: "badge-outbound",
    description: "Mud Rush Biggest Fun Fest now in Pune. Forget everything, get outdoors, run, build team bonding, and experience physical endurance challenges.",
    image: "/events/mud-rush.webp",
    link: "/events/mudrush",
  },
  {
    title: "Furute Awards",
    category: "Awards",
    badgeClass: "badge-awards",
    description: "Celebrating entrepreneurship, consistency, and growth results. Recognizing standout individuals who turned business insights into massive growth.",
    image: "/events/awards.webp",
    link: "/events/awards",
  },
  {
    title: "Do's & Don'ts for Start Ups",
    category: "Program",
    badgeClass: "badge-program",
    description: "Forthcoming Program. Fundamental checklists and risk mitigation strategies to co-create a stable, high-efficiency business setup.",
    image: "/events/start-ups.webp",
    forthcoming: true,
    timing: "For details call: 020-26131921 / 8378980521",
  },
  {
    title: "Understand the 4th Monkey for Success",
    category: "Program",
    badgeClass: "badge-program",
    description: "Forthcoming Program. A deep dive into modern consumer mindset shifts, execution habits, and key success factors for scaling up business models.",
    image: "/events/4th-monkey.webp",
    forthcoming: true,
    timing: "For details call: 020-26131921 / 8378980521",
  },
  {
    title: "Rajgad Trek",
    category: "Outbound",
    badgeClass: "badge-outbound",
    description: "Outbound trek for entrepreneurs and leadership teams. Connect concepts of strategy and resilience with actual wilderness adventure.",
    image: "/events/gap.webp",
    link: "/events/rajgad-trek",
  },
  {
    title: "Be the Trainer",
    category: "Program",
    badgeClass: "badge-program",
    description: "Forthcoming Program. Learn key presentation skills, public speaking styles, workshop facilitation, and mentorship frameworks.",
    image: "/events/be-the-trainer.webp",
    forthcoming: true,
    timing: "For details call: 020-26131921 / 8378980521",
  },
  {
    title: "GAP - Know It, Outgrow It",
    category: "Workshop",
    badgeClass: "badge-workshop",
    description: "Identify, understand, and systematically eliminate all organizational, financial, and mindset GAPs holding back your business and life.",
    image: "/events/gap.webp",
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

// Calendar icon inline SVG
function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ArrowRightSmIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function EventsPage() {
  const [dbEvents, setDbEvents] = useState<DBEvent[]>([]);
  const [dbLoading, setDbLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events?limit=20")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.length > 0) {
          setDbEvents(json.data);
        }
      })
      .catch(() => {})
      .finally(() => setDbLoading(false));
  }, []);

  return (
    <main className={styles.page}>
      {/* Visual Ambient Background Elements */}
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />
      <div className={styles.blob3} aria-hidden="true" />

      {/* Unified Global Navbar */}
      <Navbar />

      {/* Large Hero Section matching Homepage */}
      <section className={styles["hero-section"]} aria-label="Furute events and workshops banner">
        <Image 
          src="/events/upcoming-events.jpg" 
          alt="Furute Events and Workshops background"
          fill
          sizes="100vw"
          priority
          className={styles.heroBgImage}
        />
        <div className={styles["hero-overlay-tint"]} />

        <motion.div 
          className={styles["hero-overlay"]}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <Link href="/" className={styles["back-link-hero"]}>
            <ArrowLeftIcon />
            Back to home
          </Link>

          <div className={styles.headerRowHero}>
            <p className={styles.eyebrowHero}>Batches & Outbounds</p>
          </div>
          <h1>Our Events & Workshops</h1>
          <p className={styles.leadHero}>
            Take a look at our upcoming learning batches, award ceremonies, and outbound 
            experiential adventure programs built for holistic entrepreneur development.
          </p>
        </motion.div>
      </section>

      {/* ===========================
          DYNAMIC EVENTS FROM ADMIN
          =========================== */}
      {!dbLoading && dbEvents.length > 0 && (
        <motion.section
          className={styles["db-events-section"]}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.15 }}
        >
          <div className={styles["db-events-header"]}>
            <div className={styles["db-events-title"]}>
              <h2>Upcoming Events</h2>
              <span className={styles["live-badge"]}>
                <span className={styles["live-dot"]} />
                Live
              </span>
            </div>
          </div>

          <div className={styles["db-events-grid"]}>
            {dbEvents.map((event) => (
              <article key={event._id} className={styles["db-event-card"]}>
                {event.registrationLink ? (
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noreferrer"
                    className={styles["card-inner-link"]}
                  >
                    <div className={styles["db-event-image"]}>
                      {event.image ? (
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          unoptimized
                          loading="lazy"
                        />
                      ) : (
                        <div className={styles["db-event-no-image"]}>
                          <CalendarIcon />
                        </div>
                      )}
                      <span
                        className={`${styles["db-event-status-badge"]} ${
                          event.status === "upcoming"
                            ? styles["status-upcoming"]
                            : event.status === "active"
                            ? styles["status-active"]
                            : styles["status-past"]
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>

                    <div className={styles["db-event-body"]}>
                      <h3>{event.title}</h3>

                      <div className={styles["db-event-meta"]}>
                        <div className={styles["db-event-meta-row"]}>
                          <CalendarIcon />
                          <span>
                            {new Date(event.date).toLocaleDateString("en-IN", {
                              weekday: "short",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className={styles["db-event-meta-row"]}>
                          <MapPinIcon />
                          <span>{event.location}</span>
                        </div>
                      </div>

                      <p className={styles["db-event-desc"]}>{event.description}</p>

                      <div className={styles["db-event-footer"]}>
                        <span className={styles["db-event-cta"]}>
                          Register Now
                          <ArrowRightSmIcon />
                        </span>
                        {event.featured && (
                          <span className={styles["featured-pill"]}>Featured</span>
                        )}
                      </div>
                    </div>
                  </a>
                ) : (
                  <Link
                    href={`/contact?subject=Inquiry: ${event.title}`}
                    className={styles["card-inner-link"]}
                  >
                    <div className={styles["db-event-image"]}>
                      {event.image ? (
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          unoptimized
                          loading="lazy"
                        />
                      ) : (
                        <div className={styles["db-event-no-image"]}>
                          <CalendarIcon />
                        </div>
                      )}
                      <span
                        className={`${styles["db-event-status-badge"]} ${
                          event.status === "upcoming"
                            ? styles["status-upcoming"]
                            : event.status === "active"
                            ? styles["status-active"]
                            : styles["status-past"]
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>

                    <div className={styles["db-event-body"]}>
                      <h3>{event.title}</h3>

                      <div className={styles["db-event-meta"]}>
                        <div className={styles["db-event-meta-row"]}>
                          <CalendarIcon />
                          <span>
                            {new Date(event.date).toLocaleDateString("en-IN", {
                              weekday: "short",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className={styles["db-event-meta-row"]}>
                          <MapPinIcon />
                          <span>{event.location}</span>
                        </div>
                      </div>

                      <p className={styles["db-event-desc"]}>{event.description}</p>

                      <div className={styles["db-event-footer"]}>
                        <span className={styles["db-event-cta"]}>
                          Inquire
                          <ArrowRightSmIcon />
                        </span>
                        {event.featured && (
                          <span className={styles["featured-pill"]}>Featured</span>
                        )}
                      </div>
                    </div>
                  </Link>
                )}
              </article>
            ))}
          </div>
        </motion.section>
      )}

      {/* Section divider between DB events and static events */}
      {!dbLoading && dbEvents.length > 0 && (
        <div className={styles["section-divider"]}>
          <span>All Programs & Workshops</span>
        </div>
      )}

      {/* Static Events Grid Section (existing) */}
      <motion.section 
        className={styles["grid-section"]}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={staggerContainer}
      >
        <div className={styles["events-grid"]}>
          {staticEvents.map((event, index) => (
            <motion.article 
              className={`${styles["event-card"]} ${styles[`card-${event.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`] || ""}`} 
              key={index}
              variants={fadeInUp}
            >
              {event.link ? (
                event.link.startsWith("http") ? (
                  <a 
                    href={event.link} 
                    target="_blank" 
                    rel="noreferrer" 
                    className={styles["card-inner-link"]}
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
                        <span className={styles["card-cta"]}>
                          View Details
                          <ArrowRightIcon className={styles["cta-arrow"]} />
                        </span>
                      </div>
                    </div>
                  </a>
                ) : (
                  <Link 
                    href={event.link} 
                    className={styles["card-inner-link"]}
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
                        <span className={styles["card-cta"]}>
                          View Details
                          <ArrowRightIcon className={styles["cta-arrow"]} />
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              ) : (
                <Link 
                  href={`/contact?subject=Inquiry: ${event.title}`}
                  className={styles["card-inner-link"]}
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
                      <span className={styles["card-cta"]}>
                        Inquire Now
                        <ArrowRightIcon className={styles["cta-arrow"]} />
                      </span>
                    </div>
                  </div>
                </Link>
              )}
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
