"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import SiteFooter from "@/components/layout/SiteFooter";
import { ArrowLeftIcon, ArrowRightIcon, PhoneIcon, CheckIcon } from "@/components/ui/Icons";
import styles from "./insights.module.css";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

export default function InsightsEventPage() {
  return (
    <main className={styles.page}>
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />

      <Navbar />

      {/* Hero */}
      <motion.section
        className={styles.hero}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <Link href="/events" className={styles["back-link"]}>
          <ArrowLeftIcon />
          Back to events
        </Link>
        <div className={styles.headerRow}>
          <span className={`${styles.badge} ${styles.badgeWorkshop}`}>Workshop</span>
          <p className={styles.eyebrow}>Leadership &amp; Market Clarity</p>
        </div>
        <h1>Insights — See Clearly, Act Decisively</h1>
        <p className={styles.lead}>
          Practical leadership training, market analysis, and self-awareness inputs. Learn
          the right set of skills and attitude to become a successful entrepreneur.
        </p>
      </motion.section>

      {/* Main Content */}
      <section className={styles["info-section"]}>
        <div className={styles.container}>
          <div className={styles.grid}>

            {/* Left Column */}
            <motion.div
              className={styles.detailsCol}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={staggerContainer}
            >
              {/* Hero image */}
              <motion.div className={styles.card} variants={fadeInUp}>
                <div className={styles.eventImageWrap}>
                  <Image
                    src="/events/insights.webp"
                    alt="Insights Workshop"
                    fill
                    className={styles.eventImage}
                    priority
                  />
                </div>
              </motion.div>

              {/* About */}
              <motion.div className={styles.card} variants={fadeInUp}>
                <h2 className={styles.subHeading}>About the Workshop</h2>
                <p>
                  The <strong>Insights</strong> workshop is designed for business owners,
                  founders, and executives who need to cut through the noise and focus on
                  what truly drives market results. Through structured analysis, market
                  trend reviews, and self-awareness exercises, you will develop a sharp,
                  objective perspective on your company&apos;s opportunities and challenges.
                </p>
                <p>
                  Ashay Shah&apos;s coaching method combines real-world case studies with
                  hands-on reflection tools, giving you a personalised clarity roadmap to
                  make better decisions — faster.
                </p>
              </motion.div>

              {/* What You Will Learn */}
              <motion.div className={styles.card} variants={fadeInUp}>
                <h2 className={styles.subHeading}>What You Will Gain</h2>
                <ul className={styles.checkList}>
                  {[
                    "Identify current market shifts before they impact your business",
                    "Develop objective self-awareness of leadership strengths & bottlenecks",
                    "Acquire framework-based decision making to filter complex choices",
                    "Formulate a clear 90-day action plan for immediate growth",
                    "Build the mindset discipline to sustain your competitive edge",
                  ].map((item, i) => (
                    <li key={i} className={styles.checkItem}>
                      <span className={styles.checkIcon}><CheckIcon /></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Programme Modules */}
              <motion.div className={styles.card} variants={fadeInUp}>
                <h2 className={styles.subHeading}>Programme Modules</h2>
                <div className={styles.moduleGrid}>
                  {[
                    { title: "Market Clarity", desc: "Diagnose active market shifts, consumer behaviour changes, and industry distribution trends." },
                    { title: "Subconscious Auditing", desc: "Identify hidden operational fears, risk-aversion, or scaling limits holding you back." },
                    { title: "Clarity Execution", desc: "Synthesize findings into actionable milestones, aligning your team to execute without micro-management." },
                    { title: "Strategic Positioning", desc: "Understand your unique value proposition and how to position it for maximum market impact." },
                  ].map((mod, i) => (
                    <div key={i} className={styles.moduleCard}>
                      <span className={styles.moduleNum}>{String(i + 1).padStart(2, "0")}</span>
                      <strong>{mod.title}</strong>
                      <p>{mod.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column — Sidebar */}
            <div className={styles.stickyCol}>
              <motion.div
                className={styles.statusCard}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.cardStatusLabel}>Workshop Status</span>
                  <div className={styles.cardStatus}>
                    <span>Forthcoming</span>
                  </div>
                  <div className={styles.feeDetails}>
                    <div className={styles.feeItem}>
                      <span className={styles.feeLabel}>Format</span>
                      <span className={styles.feeValue}>Live Workshop (Pune)</span>
                    </div>
                    <div className={styles.feeItem}>
                      <span className={styles.feeLabel}>Duration</span>
                      <span className={styles.feeValue}>4 Sessions (1 Month)</span>
                    </div>
                    <div className={styles.feeItem}>
                      <span className={styles.feeLabel}>Audience</span>
                      <span className={styles.feeValue}>Business Owners, Founders, CEOs</span>
                    </div>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <p className={styles.statusDesc}>
                    Reserve your seat in this high-impact workshop and walk away with
                    a personalised action plan and renewed market clarity.
                  </p>
                  <Link
                    href="/contact?subject=Inquiry: Insights Workshop Registration"
                    className={styles.inquiryBtn}
                  >
                    Enquire Now
                    <ArrowRightIcon />
                  </Link>
                  <div className={styles.contactDesk}>
                    <span>Need Help Registering?</span>
                    <a href="tel:9822966644" className={styles.phoneLink}>
                      <PhoneIcon className={styles.phoneIcon} />
                      +91 9822966644
                    </a>
                    <a href="tel:02026131921" className={styles.phoneLinkSub}>
                      Office: 020-26131921
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      <SiteFooter backTo="/events/insights#" />
    </main>
  );
}
