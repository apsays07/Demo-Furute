"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import SiteFooter from "@/components/layout/SiteFooter";
import { ArrowLeftIcon, ArrowRightIcon, PhoneIcon, CheckIcon } from "@/components/ui/Icons";
import styles from "./gap.module.css";

// -------------------------------------------------------------
// FRAMER MOTION ANIMATION VARIANTS
// -------------------------------------------------------------

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
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
      staggerChildren: 0.06,
      delayChildren: 0.05
    }
  }
};

export default function GapPage() {
  return (
    <main className={styles.page}>
      {/* Visual Ambient Background Elements */}
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />

      {/* Global Navbar */}
      <Navbar />

      {/* Hero Section */}
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
          <p className={styles.eyebrow}>Business & Mindset Optimization</p>
        </div>
        <h1>GAP - Know It, Outgrow It</h1>
        <p className={styles.lead}>
          Identify, understand, and systematically eliminate all organizational, financial, 
          and mindset GAPs holding back your business expansion and personal progress.
        </p>
      </motion.section>

      {/* Main Info Section */}
      <section className={styles["info-section"]}>
        <div className={styles.container}>
          <div className={styles.grid}>
            
            {/* Left Column - Details */}
            <motion.div 
              className={styles.detailsCol}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={staggerContainer}
            >
              {/* YouTube Video Embed */}
              <motion.div className={styles.videoCard} variants={fadeInUp}>
                <div className={styles.videoWrapper}>
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/L0pUOCcUKuY?feature=oembed&wmode=opaque" 
                    title="GAP Workshop - Know It, Outgrow It"
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  />
                </div>
              </motion.div>

              {/* Introduction */}
              <motion.div className={styles.card} variants={fadeInUp}>
                <h2>Delivering Superior Customer Value</h2>
                <p>
                  Remember the good old days when there used to be just one grocery store in the entire neighborhood. No matter how long you had to wait outside the shop or how bad his service was, you had no other option to go. But today’s customers have so many choices for virtually everything. This has left the businesses in a fix. They have to keep on improving their products as well as their services to survive in the market. Delivering superior customer value is what will help you compete.
                </p>
                <p>
                  In such a situation, there is no scope for any kind of gap. You have to at least be at par with your customers’ expectations or your game is over. To eliminate every possible gap, we first need to understand what kind of gaps can occur and then try to outgrow them.
                </p>
              </motion.div>

              {/* Takeaways */}
              <motion.div className={styles.card} variants={fadeInUp}>
                <h3 className={styles.subHeading}>Takeaways of the Day</h3>
                <ul className={styles.list}>
                  <li>
                    <CheckIcon className={styles.checkIcon} />
                    <span><strong>What is GAP?</strong> Learn to define and categorize gaps in your business.</span>
                  </li>
                  <li>
                    <CheckIcon className={styles.checkIcon} />
                    <span><strong>Where does GAP occur?</strong> Pinpoint operational, communication, and expectation gaps.</span>
                  </li>
                  <li>
                    <CheckIcon className={styles.checkIcon} />
                    <span><strong>When does GAP occur?</strong> Understand triggers and time-based challenges in execution.</span>
                  </li>
                  <li>
                    <CheckIcon className={styles.checkIcon} />
                    <span><strong>Why does GAP occur?</strong> Identify the root causes like mindset, culture, and processes.</span>
                  </li>
                  <li>
                    <CheckIcon className={styles.checkIcon} />
                    <span><strong>How to fill the GAP?</strong> Construct actionable checklists and mitigation plans to outgrow them.</span>
                  </li>
                </ul>
              </motion.div>

            </motion.div>

            {/* Right Column - Sticky Sidebar */}
            <div className={styles.stickyCol}>
              <motion.div 
                className={styles.statusCard}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.cardStatusLabel}>Program Status</span>
                  <div className={styles.cardStatus}>
                    <span>Forthcoming</span>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <p className={styles.statusDesc}>
                    This program is currently open for advance inquiries and group requests. Reach out to co-create a tailored session for your leadership team or business association.
                  </p>

                  <Link 
                    href="/contact?subject=GAP Workshop Inquiry"
                    className={styles.inquiryBtn}
                  >
                    Inquire & Register Interest
                    <ArrowRightIcon />
                  </Link>

                  <div className={styles.contactDesk}>
                    <span>Still Have Questions?</span>
                    <a href="tel:02026131921" className={styles.phoneLink}>
                      <PhoneIcon className={styles.phoneIcon} />
                      020-26131921
                    </a>
                    <a href="tel:+918378980521" className={styles.phoneLinkSub}>
                      Mobile: +91 8378980521
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter backTo="/events/gap#" />
    </main>
  );
}
