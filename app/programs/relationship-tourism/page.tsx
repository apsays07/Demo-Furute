"use client";

import Link from "next/link";
import { 
  ArrowLeft, ArrowRight, Compass, Clock, Users, ShieldCheck, 
  Sparkles, Trees, Palmtree, Mountain, Award, HeartHandshake, HelpCircle 
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import SiteFooter from "@/components/layout/SiteFooter";
import { CheckIcon } from "@/components/ui/Icons";
import styles from "./relationship-tourism.module.css";

export default function RelationshipTourismPage() {
  const pillars = [
    {
      title: "Generational Alignment",
      desc: "For family-run businesses navigating succession, heritage disputes, or differing strategic visions between founders and heirs.",
      icon: Award,
      color: "gold"
    },
    {
      title: "Founder & Partner Synergy",
      desc: "For co-founders and directors who need to realign capital decisions, operations, scaling speed, or exit roadmaps.",
      icon: HeartHandshake,
      color: "teal"
    },
    {
      title: "Executive Rejuvenation",
      desc: "For leadership circles looking to dismantle chronic burn-out, establish clear boundaries, and anchor purpose alongside metrics.",
      icon: Sparkles,
      color: "violet"
    }
  ];

  const itinerary = [
    {
      day: "Day 01",
      title: "Deconditioning & Boundary Reset",
      desc: "Arrive at a custom-curated, distraction-free environment. Disconnect from screens and participate in initial trust-auditing workshops guided by Ashay Shah.",
      highlights: ["Digital Detox check-in", "Subconscious fear auditing", "Personal boundary definition"]
    },
    {
      day: "Day 02",
      title: "Alignment Workshops & Strategic Mediation",
      desc: "Deep-dive mediation sessions. We audit relational bottlenecks, family-business disputes, or exit roadmap friction, synthesizing conclusions into a shared 90-day blueprint.",
      highlights: ["Boardroom crisis mediation", "Priority alignment matrix", "The legacy vision workshop"]
    },
    {
      day: "Day 03",
      title: "Experiential Bonding & Integration",
      desc: "Participate in local physical, cultural, or survival challenges designed to translate intellectual alignment into active, visceral trust.",
      highlights: ["Immersive group survival challenge", "Reflection & synthesis debrief", "Legacy commitment ritual"]
    }
  ];

  const packages = [
    {
      title: "Mountain Solitude",
      desc: "Private cabin retreats located in the Himalayas or Western Ghats. Perfect for deep reflection and strategic mediation.",
      icon: Mountain,
      theme: "teal"
    },
    {
      title: "Heritage Estates",
      desc: "Exclusive palace retreats in Rajasthan. Ideal for multi-generational family businesses focusing on heritage and succession.",
      icon: Trees,
      theme: "gold"
    },
    {
      title: "Island Alignment",
      desc: "Coastal villa retreats in Goa or international beach destinations. Best for co-founders seeking fresh perspective and operational scaling plans.",
      icon: Palmtree,
      theme: "violet"
    }
  ];

  return (
    <main className={styles.page}>
      <Navbar />

      {/* Decorative Blur Blobs */}
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />

      {/* Immersive Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft />
            Back to home
          </Link>
          
          <span className={styles.heroKicker}>
            <Compass className={styles.kickerIcon} />
            Experiential Retreats
          </span>

          <h1>Relationship Tourism</h1>
          <p className={styles.lead}>
            Where business logic meets profound human connection. Custom-curated, distraction-free travel retreats designed to align partner visions, resolve family disputes, and forge unshakeable trust.
          </p>

          <div className={styles.heroActions}>
            <Link href="/contact?subject=Business%20Mentoring" className={styles.primaryAction}>
              Design Your Private Retreat
              <ArrowRight />
            </Link>
          </div>

          {/* At-a-glance horizontal bar */}
          <div className={styles.glanceBar}>
            <div className={styles.glanceItem}>
              <Clock />
              <div>
                <strong>Duration</strong>
                <span>3 to 5 Days</span>
              </div>
            </div>
            <div className={styles.glanceItem}>
              <Compass />
              <div>
                <strong>Destination</strong>
                <span>Custom Curated</span>
              </div>
            </div>
            <div className={styles.glanceItem}>
              <Users />
              <div>
                <strong>Ideal For</strong>
                <span>Partners, Heirs, Founders</span>
              </div>
            </div>
            <div className={styles.glanceItem}>
              <ShieldCheck />
              <div>
                <strong>Privacy</strong>
                <span>100% Confidential</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Philosophy Section */}
      <section className={styles.philosophySection}>
        <div className={styles.sectionInner}>
          <div className={styles.splitContent}>
            <div className={styles.splitLeft}>
              <span className={styles.tag}>Philosophy</span>
              <h2>Legacies are won or lost in trust.</h2>
              <p>
                In high-stakes businesses, operational failures are rarely spreadsheet errors; they are communication failures. Differing ambitions, unsaid fears, and generational bottlenecks build silent friction that stalls growth.
              </p>
              <p>
                <strong>Relationship Tourism</strong> steps away from typical boardrooms. We place you and your key circle in inspiring, neutral environments where barriers naturally break down, allowing Ashay Shah to guide you through constructive, objective alignment.
              </p>
            </div>
            <div className={styles.splitRight}>
              <div className={styles.quoteCard}>
                <blockquote>
                  &quot;Legacies are not saved in spreadsheets. They are anchored in the quiet conversations between partners in spaces where screens cannot distract them.&quot;
                </blockquote>
                <cite>— Ashay Shah, Founder</cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className={styles.pillarsSection}>
        <div className={styles.sectionInner}>
          <div className={styles.centeredHeader}>
            <span className={styles.tag}>Core Focus Areas</span>
            <h2>What We Align</h2>
            <p>Every retreat is customized around one of three critical relationship dynamics.</p>
          </div>

          <div className={styles.pillarsGrid}>
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className={`${styles.pillarCard} ${styles[`theme-${pillar.color}`]}`}>
                  <div className={styles.pillarIconWrap}>
                    <Icon />
                  </div>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Experience Journey (Timeline) */}
      <section className={styles.journeySection}>
        <div className={styles.sectionInner}>
          <div className={styles.centeredHeader}>
            <span className={styles.tag}>The Framework</span>
            <h2>The 3-Day Journey</h2>
            <p>How we transition friction into a rigid, shared operating blueprint.</p>
          </div>

          <div className={styles.journeyTimeline}>
            {itinerary.map((step, idx) => (
              <div key={idx} className={styles.timelineItem}>
                <div className={styles.timelineHeader}>
                  <span className={styles.dayBadge}>{step.day}</span>
                  <h3>{step.title}</h3>
                </div>
                <div className={styles.timelineCard}>
                  <p>{step.desc}</p>
                  <div className={styles.highlightsArea}>
                    <strong>Key Activities:</strong>
                    <ul>
                      {step.highlights.map((h, hIdx) => (
                        <li key={hIdx}>
                          <span className={styles.bulletCheck}><CheckIcon /></span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destination packages */}
      <section className={styles.destinationsSection}>
        <div className={styles.sectionInner}>
          <div className={styles.centeredHeader}>
            <span className={styles.tag}>Environments</span>
            <h2>Retreat Environments</h2>
            <p>We audit and select destinations that naturally match the emotional profile of your team.</p>
          </div>

          <div className={styles.destinationsGrid}>
            {packages.map((pkg, idx) => {
              const Icon = pkg.icon;
              return (
                <div key={idx} className={`${styles.destinationCard} ${styles[`theme-${pkg.theme}`]}`}>
                  <div className={styles.destinationIconWrap}>
                    <Icon />
                  </div>
                  <h3>{pkg.title}</h3>
                  <p>{pkg.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Centered CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <h2>Begin Designing Your Private Engagement</h2>
          <p>
            Relationship Tourism retreats are highly confidential and custom-designed. Speak directly with Ashay Shah to outline your team profile, destination choices, and strategic goals.
          </p>
          <Link href="/contact?subject=Business%20Mentoring" className={styles.ctaButton}>
            Request A Private Consultation
            <ArrowRight />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter backTo="#" />
    </main>
  );
}


