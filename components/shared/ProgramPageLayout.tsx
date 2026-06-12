"use client";

import Link from "next/link";
import { ArrowLeft, Check, Clock, Users, ArrowRight, Target, Calendar, Award, Compass } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import SiteFooter from "@/components/layout/SiteFooter";
import styles from "./ProgramPageLayout.module.css";

export interface SyllabusItem {
  title: string;
  description: string;
  details?: string[];
}

export interface ProgramPageLayoutProps {
  category?: string;
  title: string;
  description: string;
  introText?: string;
  theme?: "teal" | "gold" | "coral" | "violet" | "rose" | "mint";
  benefits?: string[];
  syllabus?: SyllabusItem[];
  targetAudience?: string[];
  duration?: string;
  contactSubject?: string;
}

export default function ProgramPageLayout({
  category = "Programs",
  title,
  description,
  introText,
  theme = "teal",
  benefits = [],
  syllabus = [],
  targetAudience = [],
  duration,
  contactSubject = "General Inquiry",
}: ProgramPageLayoutProps) {
  // Determine layout style based on category
  const isOneDay = category === "1 Day Training Programs";
  const isRetreat = category === "Experiential Retreats" || title.toLowerCase().includes("tourism");

  return (
    <main className={`${styles.page} ${styles[`theme-${theme}`]} ${isOneDay ? styles.oneDayPage : ""} ${isRetreat ? styles.retreatPage : ""}`}>
      {/* Global Navbar */}
      <Navbar />

      {/* Hero Header */}
      <section className={`${styles.hero} ${isOneDay ? styles.heroLight : ""} ${isRetreat ? styles.heroRetreat : ""}`}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <Link href="/" className={styles.backLink}>
              <ArrowLeft />
              Back to home
            </Link>
            
            <span className={styles.categoryTag}>
              {category}
            </span>

            <h1>{title}</h1>
            <p className={styles.description}>{description}</p>

            <div className={styles.heroActions}>
              <Link
                href={`/contact?subject=${encodeURIComponent(contactSubject)}`}
                className={styles.primaryAction}
              >
                Enquire About This Program
                <ArrowRight className={styles.btnIcon} />
              </Link>
            </div>
          </div>

          <aside className={styles.briefCard} aria-label="Quick Info">
            <div className={styles.briefHeader}>
              <Target />
              <span>Quick Info</span>
            </div>
            <div className={styles.quickInfoGrid}>
              {duration && (
                <div className={styles.quickInfoItem}>
                  <Clock className={styles.infoIcon} />
                  <div>
                    <strong>Duration / Format</strong>
                    <span>{duration}</span>
                  </div>
                </div>
              )}
              {targetAudience.length > 0 && (
                <div className={styles.quickInfoItem}>
                  <Users className={styles.infoIcon} />
                  <div>
                    <strong>Ideal For</strong>
                    <span>{targetAudience.join(", ")}</span>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className={styles.contentSection}>
        <div className={`${styles.contentGrid} ${isOneDay ? styles.gridLeftSidebar : ""} ${isRetreat ? styles.gridFullWidth : ""}`}>
          
          {/* Sidebar Left (for 1 Day Programs only) */}
          {isOneDay && (
            <div className={styles.contentRight}>
              <div className={styles.quickContactCard}>
                <h3>Quick Inquiry</h3>
                <p>Register for our next 1-day batch or request a corporate group session.</p>
                <Link
                  href={`/contact?subject=${encodeURIComponent(contactSubject)}`}
                  className={styles.secondaryAction}
                >
                  Request Batch Dates
                </Link>
              </div>
            </div>
          )}

          {/* Left Column / Main Content */}
          <div className={styles.contentLeft}>
            {introText && (
              <div className={styles.introBlock}>
                <span className={styles.sectionKicker}>Overview</span>
                <h2>What is this program about?</h2>
                <p>{introText}</p>
              </div>
            )}

            {benefits && benefits.length > 0 && (
              <div className={styles.outcomesBlock}>
                <span className={styles.sectionKicker}>Key Takeaways</span>
                <h2>What you will gain</h2>
                <div className={styles.outcomesGrid}>
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className={styles.outcomeItem}>
                      <div className={styles.checkIconWrap}>
                        <Check />
                      </div>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Layout-specific Syllabus rendering */}
            {syllabus && syllabus.length > 0 && (
              <div className={styles.syllabusBlock}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionKicker}>Program Modules</span>
                  <h2>
                    {isOneDay ? "Intensive Schedule" : isRetreat ? "Retreat Itinerary" : "Program Structure"}
                  </h2>
                </div>

                {isOneDay ? (
                  /* 1-Day programs use a clean 3-column grid card structure */
                  <div className={styles.syllabusGrid3Col}>
                    {syllabus.map((item, idx) => (
                      <div key={idx} className={styles.gridSyllabusItem}>
                        <div className={styles.gridSyllabusHeader}>
                          <span className={styles.gridSyllabusIndex}>Module 0{idx + 1}</span>
                          <h3>{item.title}</h3>
                        </div>
                        <p>{item.description}</p>
                        {item.details && item.details.length > 0 && (
                          <ul className={styles.syllabusDetailsList}>
                            {item.details.map((detail, dIdx) => (
                              <li key={dIdx}>{detail}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ) : isRetreat ? (
                  /* Retreats use a special immersive vertical card stack */
                  <div className={styles.retreatItineraryStack}>
                    {syllabus.map((item, idx) => (
                      <div key={idx} className={styles.retreatItineraryItem}>
                        <div className={styles.retreatItineraryHeader}>
                          <span className={styles.retreatItineraryIndex}>Day 0{idx + 1}</span>
                          <h3>{item.title}</h3>
                        </div>
                        <div className={styles.retreatItineraryCard}>
                          <p>{item.description}</p>
                          {item.details && item.details.length > 0 && (
                            <ul className={styles.syllabusDetailsList}>
                              {item.details.map((detail, dIdx) => (
                                <li key={dIdx}>{detail}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Training programs use a clean timeline stack */
                  <div className={styles.timelineStack}>
                    {syllabus.map((item, idx) => (
                      <div key={idx} className={styles.timelineItem}>
                        <div className={styles.timelineNode}>
                          <div className={styles.nodeDot} />
                          <span className={styles.nodeIndex}>Phase 0{idx + 1}</span>
                        </div>
                        <div className={styles.timelineCard}>
                          <h3>{item.title}</h3>
                          <p>{item.description}</p>
                          {item.details && item.details.length > 0 && (
                            <ul className={styles.syllabusDetailsList}>
                              {item.details.map((detail, dIdx) => (
                                <li key={dIdx}>{detail}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Right (for Training Programs only) */}
          {!isOneDay && !isRetreat && (
            <div className={styles.contentRight}>
              <div className={styles.quickContactCard}>
                <h3>Have Specific Questions?</h3>
                <p>Speak directly with our learning advisor to customize this program for your personal or business goals.</p>
                <Link
                  href={`/contact?subject=${encodeURIComponent(contactSubject)}`}
                  className={styles.secondaryAction}
                >
                  Request Free Consultation
                </Link>
              </div>
            </div>
          )}

          {/* Retreat Special Action Block (Centered CTA at bottom, no sidebars) */}
          {isRetreat && (
            <div className={styles.retreatCtaBlock}>
              <div className={styles.retreatCtaCard}>
                <h2>Ready to Align Your Team or Family?</h2>
                <p>Relationship Tourism retreats are customized, private engagements. Contact us to select destinations, outline goals, and request pricing.</p>
                <Link
                  href={`/contact?subject=${encodeURIComponent(contactSubject)}`}
                  className={styles.primaryAction}
                >
                  Begin Designing Your Retreat
                </Link>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Footer */}
      <SiteFooter backTo="#" />
    </main>
  );
}
