"use client";

import Link from "next/link";
import { 
  ArrowLeft, ArrowRight, Compass, Clock, Users, ShieldCheck, 
  Sparkles, Trees, Palmtree, Mountain, Award, HeartHandshake 
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

      {/* Universal Principle Section: What We Invest Time In, Grows */}
      <section className={styles.introSection}>
        <div className={styles.sectionInner}>
          <div className={styles.centeredHeader}>
            <span className={styles.tag}>A Universal Principle</span>
            <h2>What We Invest Time In, Grows</h2>
            <p>Every meaningful achievement in life is the result of time invested with intention.</p>
          </div>

          <div className={styles.investGrid}>
            <div className={styles.investCard}>
              <div className={styles.investIconWrap}>
                <Sparkles />
              </div>
              <h3>Hobbies & Skills</h3>
              <p>When we dedicate time to a hobby, our skills improve and our horizons expand.</p>
            </div>
            <div className={styles.investCard}>
              <div className={styles.investIconWrap}>
                <Mountain />
              </div>
              <h3>Sports & Fitness</h3>
              <p>When we consistently practice, we become stronger, healthier, and more resilient.</p>
            </div>
            <div className={styles.investCard}>
              <div className={styles.investIconWrap}>
                <Award />
              </div>
              <h3>Academics & Study</h3>
              <p>Students who invest quality time in learning excel academically and build lasting foundations.</p>
            </div>
            <div className={styles.investCard}>
              <div className={styles.investIconWrap}>
                <Users />
              </div>
              <h3>Business & Career</h3>
              <p>Professionals and entrepreneurs who devote themselves to their work achieve great success.</p>
            </div>
          </div>

          <div className={styles.introTransition}>
            <p>
              Growth never happens by accident. It happens where attention, effort, and time are invested.
            </p>
            <p className={styles.transitionEmphasis}>
              Yet, while we understand this principle in education, careers, business, and personal ambitions, we often overlook its importance in the area that matters most—<strong>our relationships</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* The Missing Secret & Reflective Questions */}
      <section className={styles.missingSecretSection}>
        <div className={styles.sectionInner}>
          <div className={styles.splitContent}>
            <div className={styles.splitLeft}>
              <span className={styles.tag}>The Bottleneck</span>
              <h2>The Missing Secret in Relationships</h2>
              <p>
                Many people struggle with relationships not because they lack love, but because they fail to invest enough quality time in nurturing those bonds.
              </p>
              <p>
                Relationships are living connections. They require attention, understanding, communication, and shared experiences to grow stronger over time.
              </p>
            </div>
            <div className={styles.splitRight}>
              <div className={styles.factBox}>
                <h3>The Simple Truth</h3>
                <p>Relationships thrive where time, care, and meaningful experiences are actively invested.</p>
              </div>
            </div>
          </div>

          <div className={styles.questionsContainer}>
            <h3 className={styles.questionsTitle}>Consider these questions:</h3>
            <div className={styles.questionsGrid}>
              <div className={styles.questionCard}>
                <div className={styles.questionCardIcon}>
                  <Users />
                </div>
                <p>Why do strong family bonds often weaken as life becomes busier?</p>
              </div>
              <div className={styles.questionCard}>
                <div className={styles.questionCardIcon}>
                  <Compass />
                </div>
                <p>Why do children who once depended on their parents gradually drift away?</p>
              </div>
              <div className={styles.questionCard}>
                <div className={styles.questionCardIcon}>
                  <HeartHandshake />
                </div>
                <p>Why do siblings who grew up sharing laughter, challenges, and memories become distant after marriage?</p>
              </div>
              <div className={styles.questionCard}>
                <div className={styles.questionCardIcon}>
                  <Sparkles />
                </div>
                <p>Why do newly married couples often unintentionally neglect older relationships?</p>
              </div>
              <div className={styles.questionCard}>
                <div className={styles.questionCardIcon}>
                  <Trees />
                </div>
                <p>Why do joint families become fragmented into smaller, disconnected units?</p>
              </div>
              <div className={styles.questionCard}>
                <div className={styles.questionCardIcon}>
                  <ShieldCheck />
                </div>
                <p>Why do misunderstandings frequently arise between mothers-in-law and daughters-in-law despite their shared desire for love, respect, and acceptance?</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reconnecting Section */}
      <section className={styles.reconnectSection}>
        <div className={styles.sectionInner}>
          <div className={styles.reconnectCard}>
            <span className={styles.tag}>A New Approach</span>
            <h2>Reconnecting Through Relationship Tourism</h2>
            <div className={styles.reconnectTextGrid}>
              <div>
                <p>
                  In today&apos;s fast-paced world, we rarely create dedicated time to strengthen our relationships. Vacations are often planned for relaxation, sightseeing, or entertainment—but what if they could also deepen the bonds that matter most?
                </p>
                <p>
                  <strong>Relationship Tourism</strong> is a unique concept designed to help individuals, couples, and families reconnect, rebuild, and strengthen their relationships through meaningful shared experiences.
                </p>
              </div>
              <div>
                <p>
                  It is about creating memories, fostering understanding, building trust, and nurturing deeper connections through love, respect, and togetherness.
                </p>
                <p>
                  Whether it is parents and children, siblings, spouses, extended families, or in-laws, every relationship deserves an opportunity to grow stronger.
                </p>
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

      {/* Make Your Next Vacation Meaningful Section */}
      <section className={styles.vacationMeaningfulSection}>
        <div className={styles.sectionInner}>
          <div className={styles.meaningfulCard}>
            <span className={styles.tag}>Next Steps</span>
            <h2>Make Your Next Vacation Meaningful</h2>
            <p className={styles.meaningfulLead}>
              Let your next journey be more than just a getaway. Choose an experience that brings hearts closer, strengthens bonds, and creates memories that last a lifetime.
            </p>
            <p className={styles.meaningfulSub}>
              Because relationships, like every valuable part of life, flourish when we invest our time in them.
            </p>
            <div className={styles.meaningfulCallouts}>
              <div className={styles.calloutItem}>
                <span className={styles.calloutIcon}>💖</span>
                <span>Invest in relationships</span>
              </div>
              <div className={styles.calloutItem}>
                <span className={styles.calloutIcon}>🤝</span>
                <span>Invest in connection</span>
              </div>
              <div className={styles.calloutItem}>
                <span className={styles.calloutIcon}>✨</span>
                <span>Invest in what truly matters</span>
              </div>
            </div>
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


