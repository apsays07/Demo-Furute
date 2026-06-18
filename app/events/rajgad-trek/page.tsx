"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import SiteFooter from "@/components/layout/SiteFooter";
import { ArrowLeftIcon, ArrowRightIcon, PhoneIcon, CheckIcon } from "@/components/ui/Icons";
import styles from "./rajgad-trek.module.css";

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

export default function RajgadTrekPage() {
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
          <span className={`${styles.badge} ${styles.badgeOutbound}`}>Outbound</span>
          <p className={styles.eyebrow}>Experiential Team Learning</p>
        </div>
        <h1>Rajgad Trek</h1>
        <p className={styles.lead}>
          An outbound trek for entrepreneurs, founders, and leadership teams. Connect critical 
          business strategy and resilience concepts with actual wilderness adventure.
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
              
              {/* Introduction */}
              <motion.div className={styles.card} variants={fadeInUp}>
                <h2>Developing Strategy &amp; Endurance in the Wild</h2>
                <p>
                  Climbing the historic fort of Rajgad, the former capital of the Maratha Empire under Chhatrapati Shivaji Maharaj, provides a perfect canvas to test strategic endurance, build high-performance team bonding, and experience physical challenges in the wilderness.
                </p>
                <p>
                  Outbound training takes leadership concepts out of air-conditioned conference rooms and drops them into real-world scenarios. Facing steep climbs, wilderness paths, and changing weather conditions demands real team collaboration, risk assessment, and dynamic decision-making.
                </p>
                <p>
                  By pushing physical boundaries together, team members learn to communicate with transparency, build trust, and develop the mental fortitude required to guide organizations through complex business storms.
                </p>
              </motion.div>

              {/* Strategic Takeaways */}
              <motion.div className={styles.card} variants={fadeInUp}>
                <h3 className={styles.subHeading}>Outbound Strategic Takeaways</h3>
                <ul className={styles.list}>
                  <li>
                    <CheckIcon className={styles.iconWrap} />
                    <span><strong>Resource Optimization:</strong> Plan energy, water, and load management to scale the peak collectively.</span>
                  </li>
                  <li>
                    <CheckIcon className={styles.iconWrap} />
                    <span><strong>Team Resilience:</strong> Learn to pace the team, supporting each other to ensure that the entire group reaches the summit safely.</span>
                  </li>
                  <li>
                    <CheckIcon className={styles.iconWrap} />
                    <span><strong>Strategic Vision:</strong> Analyze the historic fortifications of Rajgad, connecting military defense strategies to modern market positioning.</span>
                  </li>
                  <li>
                    <CheckIcon className={styles.iconWrap} />
                    <span><strong>Mindset Mastery:</strong> Overcome physical and mental limitations to unlock new levels of confidence and persistence.</span>
                  </li>
                </ul>
              </motion.div>

              {/* Trek details */}
              <motion.div className={styles.card} variants={fadeInUp}>
                <h2>Program Details &amp; Design</h2>
                <p>
                  Our outbound treks are fully guided and supported by professional safety coordinators, medical teams, and experienced mountain guides. Interspersed during the trek are structured reflection circles and coaching debriefs led by Ashay Shah, translating the physical climbing challenges into business execution lessons.
                </p>
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
                  
                  <div className={styles.feeDetails}>
                    <div className={styles.feeItem}>
                      <span className={styles.feeLabel}>Difficulty</span>
                      <span className={styles.feeValue}>Moderate to Challenging</span>
                    </div>
                    <div className={styles.feeItem}>
                      <span className={styles.feeLabel}>Location</span>
                      <span className={styles.feeValue}>Rajgad Fort, Pune</span>
                    </div>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <p className={styles.statusDesc}>
                    This program is currently open for advance inquiries, group requests, and corporate batches. Connect with us to register your interest.
                  </p>

                  <Link 
                    href="/contact?subject=Inquiry: Rajgad Trek Outbound"
                    className={styles.inquiryBtn}
                  >
                    Inquire &amp; Register Interest
                    <ArrowRightIcon />
                  </Link>

                  <div className={styles.contactDesk}>
                    <span>Questions about Outbounds?</span>
                    <a href="tel:02026131921" className={styles.phoneLink}>
                      <PhoneIcon className={styles.phoneIcon} />
                      020-26131921
                    </a>
                    <a href="tel:+918378980521" className={styles.phoneLinkSub}>
                      Coordinator Mobile: +91 8378980521
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter backTo="/events/rajgad-trek#" />
    </main>
  );
}
