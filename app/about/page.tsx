"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import SiteFooter from "@/components/layout/SiteFooter";
import {
  ArrowLeftIcon,
  ShieldCheckIcon,
  SparklesIcon,
  HelpingHandsIcon,
  TrophyIcon,
  CompassIcon,
  SmartWorkIcon,
} from "@/components/ui/Icons";
import styles from "./about.module.css";

// -------------------------------------------------------------
// TYPES & DATA DEFINITIONS
// -------------------------------------------------------------

type IconProps = {
  className?: string;
};

// 1. DNA of a Kingmaker Timeline
const interactiveTimeline = [
  {
    phase: "Phase 01",
    year: "Early Steps",
    title: "Entrepreneur DNA",
    story: "Selling hand-made kites in 6th grade and fresh flower bouquets at age 13. Street commerce was his early university.",
    lesson: "Value is created by understanding immediate human desires, not just by having inventory.",
    takeaway: "I teach leaders to listen to what their market is craving before investing in heavy product structures.",
  },
  {
    phase: "Phase 02",
    year: "1989",
    title: "Cable T.V. Pioneer",
    story: "Stepped in during college to build one of Pune's first cable television distribution systems, navigating raw market currents.",
    lesson: "Being early to a disruptive trend is powerful, but distribution and reliability secure long-term loyalty.",
    takeaway: "I help clients spot early consumer trends and build unshakeable business distribution systems.",
  },
  {
    phase: "Phase 03",
    year: "1990s - 2005",
    title: "Logistics & Grit",
    story: "Managed large transport fleets and high-capacity industrial dealerships for top brands like Coca-Cola, 3M, and Vasavadatta Cement.",
    lesson: "High-stress logistics is won or lost in standard operating procedures (SOPs) and extreme team alignment.",
    takeaway: "I audit corporate operations to cut systematic waste, streamline supply workflows, and align logistics.",
  },
  {
    phase: "Phase 04",
    year: "2005",
    title: "The Pivot to Mentorship",
    story: "Made a courageous, defining decision to exit highly profitable active logistics trades to align with his ultimate destiny: building leaders.",
    lesson: "True wealth lies in purpose. Success is empty if it does not empower others to claim their own power.",
    takeaway: "I guide business founders through high-stakes pivots, helping them align business scaling with core life values.",
  },
  {
    phase: "Phase 05",
    year: "2013 - Present",
    title: "Building Kingmakers",
    story: "Founded Furute. He has now coached over 8,264 corporate leaders, speakers, and professionals, changing the landscape of leadership.",
    lesson: "When you build the person, you build the organization. Holistic leadership is the ultimate lever.",
    takeaway: "Through Furute, we deliver end-to-end organizational alignment, high-performance coaching, and strategic mentorship.",
  },
];

// 2. Core Values Refinement with Direct Applications
const valuesData = [
  {
    name: "Absolute Honesty",
    description: "Truthful, real-world direction is the root of growth. We don't sugarcoat business realities.",
    application: "We provide direct, no-nonsense feedback on operational bottlenecks, saving years of wasted efforts.",
    icon: ShieldCheckIcon,
    color: "#087f8c",
  },
  {
    name: "Reframed Positivity",
    description: "A positive attitude isn't passive hope; it is a calculated tool to bypass mental limitation.",
    application: "We train leaders to re-engineer setbacks into strategic pivot points through NLP principles.",
    icon: SparklesIcon,
    color: "#f2a51a",
  },
  {
    name: "Lending Hands",
    description: "Mentorship is not an elite podium; it is a commitment to lift others into high-leverage positions.",
    application: "We spend time crafting direct, personalized action lists for every single leader we counsel.",
    icon: HelpingHandsIcon,
    color: "#e45f4f",
  },
  {
    name: "Internal Certainty",
    description: "If you believe in your outcome, the market's doubts become secondary. We anchor self-belief.",
    application: "We help founders overcome operational fear, enabling them to make high-value hiring and strategy decisions.",
    icon: TrophyIcon,
    color: "#c83d73",
  },
  {
    name: "Relentless Dedication",
    description: "We are committed to walking the entire distance. We do not exit until systems are stabilized.",
    application: "We run ongoing tracking, feedback loops, and accountability calls to enforce execution.",
    icon: CompassIcon,
    color: "#6f58c9",
  },
  {
    name: "Smart Optimization",
    description: "Smart work overrides raw physical labor. We align priorities to multiply efficiency.",
    application: "We deploy operational structures and dashboards that let founders cut their work hours in half.",
    icon: SmartWorkIcon,
    color: "#31a475",
  },
];

// 3. Signature Coaching Methodologies (The Playbook)
const signatureFrameworks = [
  {
    id: "nlp",
    title: "NLP Subconscious Reframing",
    subtitle: "Mindset Architecture",
    description: "Neuro-Linguistic Programming is the science of decoding how language and neurological pathways govern behavior. We dive deep into neural patterns to dismantle imposter syndrome, stress reactions, and risk aversion.",
    bullets: [
      "Dismantling subconscious scaling limitations",
      "Building high-stakes negotiation confidence",
      "Anchoring emotional resilience under high stress",
      "Re-patterning daily language for clear directive command"
    ]
  },
  {
    id: "priority",
    title: "Priority Architecting (90/10 Focus)",
    subtitle: "Operational Optimization",
    description: "Most founders waste 90% of their energy on tasks that drive only 10% of their business outcome. We restructure operational habits to identify the critical levers that yield maximum revenue and system autonomy.",
    bullets: [
      "Identifying the 'Single Critical Goal' of the business",
      "Eradicating operational micro-management",
      "Building weekly execution sprints that guarantee progress",
      "Freeing up 20+ hours of executive time every single week"
    ]
  },
  {
    id: "sarathi",
    title: "Sarathi Mentorship Path",
    subtitle: "Holistic Direction",
    description: "An elite, high-proximity program where Ashay Shah acts as your trusted partner for high-level business navigation, strategic pivots, and personal clarity.",
    bullets: [
      "1-on-1 strategic boardroom advisory",
      "Family business dispute resolution & alignment",
      "High-proximity crisis navigation",
      "Integrating business scaling with profound personal peace"
    ]
  }
];

// 4. Moments That Define The Journey — real photographs from the field
const journeyMoments = [
  {
    src: "/about/journey-1-cement-wagon.jpg",
    alt: "Ashay Shah and the team celebrating a cement wagon dispatch with a ceremonial garland",
    caption: "Marking a cement wagon dispatch milestone with the dealer team",
  },
  {
    src: "/about/journey-2-award.jpg",
    alt: "Ashay Shah receiving a recognition award on stage at Laxmi Hostel",
    caption: "Recognised for mentorship impact at Laxmi Hostel",
  },
  {
    src: "/about/journey-3-dealership-milestone.jpg",
    alt: "Handing over the Shree Cement dealership certificate to Milestone Traders",
    caption: "Appointing Milestone Traders as an authorised Shree Cement dealer",
  },
  {
    src: "/about/journey-4-dealership-padmavati.jpg",
    alt: "Handing over the Shree Cement dealership certificate to Shri Padmavati Enterprises",
    caption: "Appointing Shri Padmavati Enterprises as an authorised dealer",
    portrait: true,
  },
  {
    src: "/about/journey-5-training-session.jpg",
    alt: "Ashay Shah leading a training session with a large group of students",
    caption: "Leading a hands-on training session with young professionals",
  },
  {
    src: "/about/journey-6-plant-visit.jpg",
    alt: "Ashay Shah on site at a cement manufacturing plant",
    caption: "On-site at a cement plant during a dealer visit",
    portrait: true,
  },
];

export default function AboutUsPage() {
  const [imageError, setImageError] = useState(false);

  return (
    <main className={styles.page}>
      {/* Background Blobs */}
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />

      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <Link href="/" className={styles.backLink}>
              <ArrowLeftIcon />
              Back to home
            </Link>
            <span className={styles.eyebrow}>Founder of Furute</span>
            <h1>Meet Ashay Shah</h1>
            <p className={styles.lead}>
              Certified Business & Life Coach, Master Trainer in NLP, and Keynote Speaker
              with over 20 years of real-world business insights.
            </p>
            
            <div className={styles.statsBar}>
              <div className={styles.statItem}>
                <strong>8,264+</strong>
                <span>Leaders Trained</span>
              </div>
              <div className={styles.statItem}>
                <strong>19,852+</strong>
                <span>Counseled</span>
              </div>
            </div>
          </div>

          <div className={styles.portraitWrapper}>
            <div className={styles.portraitCard}>
              {!imageError ? (
                <Image
                  src="/ashay-shah.png"
                  alt="Ashay Shah"
                  className={styles.portrait}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className={styles.portraitFallback}>
                  <span>AS</span>
                  <div className={styles.portraitTag}>Ashay Shah</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Biography Focus Section */}
      <section className={styles.bioSection}>
        <div className={styles.bioGrid}>
          <div className={styles.bioLeft}>
            <h2>A Self-Made Coach and Strategist</h2>
            <p>
              Ashay Shah is the founder of <strong>Furute</strong>, bringing over 20 years of hands-on
              business experience to leadership training and corporate coaching. He is a key resource for
              entrepreneurs who need clear structures, goals, and actionable growth pathways.
            </p>
            <p>
              By identifying core strengths and addressing structural bottlenecks, he has successfully mentored over
              <strong> 8,264 entrepreneurs</strong> and counseled more than <strong>19,852 individuals</strong> across India.
            </p>
          </div>
          <div className={styles.bioRight}>
            <div className={styles.quoteCard}>
              <p>
                &quot;In life we will not get what we desire, we will get what we deserve.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Gallery Section */}
      <section className={styles.gallerySection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>
            Leadership & Recognition
          </span>

          <h2>Moments That Define The Journey</h2>

          <p>
            Real experiences, recognitions, and leadership moments that shaped
            the vision behind Furute.
          </p>
        </div>

        <div className={styles.galleryGrid}>
          {journeyMoments.map((moment, idx) => (
            <div key={idx} className={styles.galleryCard}>
              <div
                className={
                  moment.portrait
                    ? `${styles.galleryImageWrap} ${styles.portraitImage}`
                    : styles.galleryImageWrap
                }
              >
                <Image
                  src={moment.src}
                  alt={moment.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={styles.galleryImage}
                />
              </div>
              <div className={styles.galleryCaption}>
                <p>{moment.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars of Mentorship Grid */}
      <section className={styles.pillarsSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>PROVEN METHODOLOGIES</span>
          <h2>Pillars of Mentorship</h2>
          <p>We combine subconscious mindset reframing with rigid operational systems to unlock scaling potential.</p>
        </div>

        <div className={styles.pillarsGrid}>
          {signatureFrameworks.map((framework) => (
            <div key={framework.id} className={styles.pillarCard}>
              <span className={styles.pillarSubtitle}>{framework.subtitle}</span>
              <h3>{framework.title}</h3>
              <p>{framework.description}</p>
              <ul className={styles.pillarBullets}>
                {framework.bullets.map((bullet, idx) => (
                  <li key={idx}>
                    <span className={styles.bulletCheck}>✓</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Simplified Vertical Timeline */}
      <section className={styles.timelineSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>OUR BUSINESS DNA</span>
          <h2>The Journey & Experience</h2>
          <p>Real-world experience built across street commerce, fleet logistics, and leadership advisory.</p>
        </div>

        <div className={styles.verticalTimeline}>
          {interactiveTimeline.map((node, idx) => (
            <div key={idx} className={styles.timelineItem}>
              <div className={styles.timelineNode}>
                <div className={styles.nodeDot} />
                <span className={styles.nodeYear}>{node.year}</span>
              </div>
              <div className={styles.timelineCard}>
                <div className={styles.timelineCardHeader}>
                  <span className={styles.timelinePhase}>{node.phase}</span>
                  <h4>{node.title}</h4>
                </div>
                <p className={styles.timelineStory}>{node.story}</p>
                <div className={styles.timelineInsights}>
                  <div className={styles.insightBox}>
                    <strong>Business Lesson:</strong>
                    <p>{node.lesson}</p>
                  </div>
                  <div className={styles.insightBox}>
                    <strong>Client Application:</strong>
                    <p>{node.takeaway}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Philosophy Section */}
      <section className={styles.philosophySection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Core Philosophy</span>
          <h2>Values That Drive Outcomes</h2>
          <p>Values are useless if they remain simple slogans. Here is how our philosophical core converts into your company&apos;s real-world leverage.</p>
        </div>

        <div className={styles.valuesGrid}>
          {valuesData.map((value, idx) => {
            const Icon = value.icon;
            return (
              <div key={idx} className={styles.valueCard} style={{ "--theme-color": value.color } as React.CSSProperties}>
                <div className={styles.valueHeader}>
                  <div className={styles.valueIconWrap}>
                    <Icon />
                  </div>
                  <h3>{value.name}</h3>
                </div>
                <p className={styles.valDesc}>{value.description}</p>
                <div className={styles.valApp}>
                  <strong>Direct Client Application:</strong>
                  <p>{value.application}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Organization & CTA Combined Section */}
      <section className={styles.footerCtaSection}>
        <div className={styles.footerCtaGrid}>
          <div className={styles.orgInfo}>
            <Image src="/furute-logo.png" alt="Furute Logo" width={110} height={54} className={styles.orgLogo} />
            <h3>Furute - Kingmakers</h3>
            <p>
              Founded in January 2013 under the leadership of Ashay Shah. Furute is a dedicated business training, branding, and life coaching partner committed to building stable, high-efficiency business operations.
            </p>
          </div>
          <div className={styles.ctaBox}>
            <h3>Ready to transform your business direction?</h3>
            <p>Invite Ashay Shah as a speaker for your organization or request a consultation with our team.</p>
            <div className={styles.ctaButtons}>
              <Link href="/invite" className={styles.btnPrimary}>
                Invite Me as a Speaker
              </Link>
              <Link href="/contact" className={styles.btnSecondary}>
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter backTo="/about#" />
    </main>
  );
}
