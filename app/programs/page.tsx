"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import SiteFooter from "@/components/layout/SiteFooter";
import styles from "./programs.module.css";
import {
  ArrowRight,
  Compass,
  GraduationCap,
  Flame,
  Calendar,
  CheckCircle2,
  BookOpen,
  Clock,
  Tag,
} from "lucide-react";

// ─── DB Program type ────────────────────────────────────────
interface DBProgram {
  _id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  image?: string;
  visible: boolean;
}

export default function ProgramsPage() {
  const [dbPrograms, setDbPrograms] = useState<DBProgram[]>([]);

  useEffect(() => {
    fetch("/api/programs?limit=30")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.length > 0) setDbPrograms(json.data);
      })
      .catch(() => {});
  }, []);

  const categories = [
    {
      title: "Training Programs",
      label: "Long-form capability building",
      description:
        "Comprehensive, multi-session learning models to align organizations, refine strategies, and build leaders.",
      theme: "teal",
      icon: GraduationCap,
      items: [
        {
          name: "Insights",
          path: "/programs/training/insights",
          desc: "Practical market inputs to see decisions clearly.",
        },
        {
          name: "Organization Training",
          path: "/programs/training/organization-training",
          desc: "Structured learning sessions for high-performance teams.",
        },
        {
          name: "Breakthrough",
          path: "/programs/training/breakthrough",
          desc: "Mindset and strategy work to move past stuck points.",
        },
        {
          name: "Sarathi Mentorship Path",
          path: "/programs/training/sarathi",
          desc: "Elite 1-on-1 personal guidance and crisis advisory.",
        },
        {
          name: "Beyond the Classroom",
          path: "/programs/training/beyond-the-classroom",
          desc: "Experiential outdoor training to forge team trust.",
        },
        {
          name: "Young Adults",
          path: "/programs/training/young-adults",
          desc: "Purpose alignment and EQ for next-gen leaders.",
        },
      ],
    },
    {
      title: "1 Day Training Programs",
      label: "Focused diagnosis and action",
      description:
        "Intensive, high-impact one-day workshops designed to audit specific bottlenecks and deliver action roadmaps.",
      theme: "gold",
      icon: Flame,
      items: [
        {
          name: "Goal Setting",
          path: "/programs/1-day/goal-setting",
          desc: "Create a rigid 90-day milestone execution framework.",
        },
        {
          name: "Business Communication",
          path: "/programs/1-day/business-communication",
          desc: "Effective communication skills training to align teams and run operations smoothly.",
        },
        {
          name: "Leadership and Negotiation",
          path: "/programs/1-day/leadership-and-negotiation",
          desc: "Decision-making, negotiation psychology, and management confidence.",
        },
      ],
    },
    {
      title: "Relationship Tourism",
      label: "Immersive alignment retreats",
      description:
        "Custom-curated experiential retreats at neutral, inspiring destinations to align partner relationships and resolve generational disputes.",
      theme: "violet",
      icon: Compass,
      items: [
        {
          name: "Relationship Tourism Retreats",
          path: "/programs/relationship-tourism",
          desc: "Experiential travel for business partners and family founders.",
        },
      ],
    },
  ];

  return (
    <main className={styles.page}>
      <Navbar />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>Furute program catalogue</span>
            <h1>Professional guidance for decisive growth.</h1>
            <p className={styles.lead}>
              Choose a structured path for business clarity, leadership
              maturity, team alignment, or relationship-led decision making.
            </p>
            <div className={styles.heroActions}>
              <Link
                href="/contact?subject=Program%20Recommendation"
                className={styles.primaryAction}
              >
                Find the right program
                <ArrowRight />
              </Link>
              <Link href="#program-list" className={styles.secondaryAction}>
                View all programs
              </Link>
            </div>
          </div>

          <aside
            className={styles.heroPanel}
            aria-label="How Furute programs work"
          >
            <div>
              <span>01</span>
              <p>Diagnose the real bottleneck before recommending a format.</p>
            </div>
            <div>
              <span>02</span>
              <p>
                Convert insight into operating habits, review rituals, and next
                actions.
              </p>
            </div>
            <div>
              <span>03</span>
              <p>Keep the work practical for founders, teams, and family businesses.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.pathSection} aria-label="Program outcomes">
        <div className={styles.pathGrid}>
          {[
            "Business owners needing sharper priorities",
            "Teams that need ownership and execution discipline",
            "Next-generation leaders preparing for responsibility",
            "Partners or families seeking alignment before major decisions",
          ].map((item) => (
            <div className={styles.pathItem} key={item}>
              <CheckCircle2 />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── DYNAMIC PROGRAMS FROM ADMIN ────────────────── */}
      {dbPrograms.length > 0 && (
        <section className={styles.dbProgramsSection} id="admin-programs">
          <div className={styles.dbProgramsHeader}>
            <div className={styles.dbProgramsTitle}>
              <BookOpen size={20} />
              <h2>New Programs</h2>
              <span className={styles.liveBadge}>
                <span className={styles.liveDot} />
                Live
              </span>
            </div>
          </div>
          <div className={styles.dbProgramsGrid}>
            {dbPrograms.map((prog) => (
              <article key={prog._id} className={styles.dbProgramCard}>
                {/* Cover image or gradient placeholder */}
                <div className={styles.dbProgramImageWrap}>
                  {prog.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={prog.image} alt={prog.title} className={styles.dbProgramImage} />
                  ) : (
                    <div className={styles.dbProgramImagePlaceholder}>
                      <BookOpen size={32} />
                    </div>
                  )}
                </div>
                <div className={styles.dbProgramBody}>
                  <div className={styles.dbProgramMeta}>
                    <span className={styles.dbProgramDuration}>
                      <Clock size={12} />
                      {prog.duration}
                    </span>
                    <span className={styles.dbProgramCategory}>
                      <Tag size={12} />
                      {prog.category}
                    </span>
                  </div>
                  <h3>{prog.title}</h3>
                  <p>{prog.description}</p>
                  <Link
                    href={`/contact?subject=Program Inquiry - ${encodeURIComponent(prog.title)}`}
                    className={styles.dbProgramCta}
                  >
                    Inquire Now <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className={styles.categoriesSection} id="program-list">
        <div className={styles.sectionHeader}>
          <span>Explore by need</span>
          <h2>
            Every format is designed to produce visible decisions, not passive
            inspiration.
          </h2>
        </div>

        <div className={styles.categoriesGrid}>
          {categories.map((category, catIdx) => {
            const IconComponent = category.icon;
            return (
              <div
                key={catIdx}
                className={`${styles.categoryCard} ${
                  styles[`theme-${category.theme}`]
                }`}
              >
                <div className={styles.categoryHeader}>
                  <div className={styles.iconWrap}>
                    <IconComponent />
                  </div>
                  <span>{category.label}</span>
                  <h2>{category.title}</h2>
                  <p>{category.description}</p>
                </div>
                <div className={styles.itemsList}>
                  {category.items.map((item, itemIdx) => (
                    <Link
                      key={itemIdx}
                      href={item.path}
                      className={styles.programItemLink}
                    >
                      <span className={styles.itemNumber}>
                        {String(itemIdx + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3>{item.name}</h3>
                        <p>{item.desc}</p>
                      </div>
                      <ArrowRight className={styles.itemArrow} />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.bottomCta}>
        <div className={styles.ctaBox}>
          <div>
            <span className={styles.ctaEyebrow}>
              <Calendar />
              Diagnostic conversation
            </span>
            <h2>Not sure where to start?</h2>
            <p>
              Request a 20-minute consultation with Ashay Shah to identify the
              correct program for your current stage.
            </p>
          </div>
          <Link
            href="/contact?subject=General%20Inquiry"
            className={styles.ctaButton}
          >
            Book A Discovery Call
            <ArrowRight />
          </Link>
        </div>
      </section>

      <SiteFooter backTo="#" />
    </main>
  );
}
