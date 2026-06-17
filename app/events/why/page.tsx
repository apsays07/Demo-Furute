"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import SiteFooter from "@/components/layout/SiteFooter";
import { ArrowLeftIcon, ArrowRightIcon, PhoneIcon } from "@/components/ui/Icons";
import styles from "./why.module.css";

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

function QuestionMarkIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export default function WhyPage() {
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
          <span className={`${styles.badge} ${styles.badgeWorkshop}`}>Seminar</span>
          <p className={styles.eyebrow}>Life-Changing Talk by Ashay Shah</p>
        </div>
        <h1>WHY? — Discover Your Core Purpose</h1>
        <p className={styles.lead}>
          Clarify your core motivation and focus. Discover your business and personal goals 
          to align your actions with your ultimate purpose.
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
                <h2>Your Guide to this Competitive Jungle</h2>
                <p>
                  Ashay Shah has been staying on the top of global business trends and local business environments for 20 years. He is a priceless resource for Entrepreneurs and Companies who have a Business Plan or Model but need to identify the best way to achieve their goals by discovering their key strengths and weaknesses.
                </p>
                <p>
                  This talk is heavily based on real-world case studies and practical examples. We ask the hard questions that stop most intelligent people from winning. If you feel like your daily routine is mundane or you are not getting the growth results you expect, it&rsquo;s time to step back and ask: <strong>WHY?</strong>
                </p>
              </motion.div>

              {/* Core Questions Addressed */}
              <motion.div className={styles.card} variants={fadeInUp}>
                <h3 className={styles.subHeading}>Critical Questions We Address</h3>
                <ul className={styles.list}>
                  <li>
                    <QuestionMarkIcon className={styles.questionIcon} />
                    <span>Why does a mundane routine affect your daily progress and life?</span>
                  </li>
                  <li>
                    <QuestionMarkIcon className={styles.questionIcon} />
                    <span>Why are there so few winners among so many highly intelligent people?</span>
                  </li>
                  <li>
                    <QuestionMarkIcon className={styles.questionIcon} />
                    <span>Why do people fail to sustain success even after reaching the top?</span>
                  </li>
                  <li>
                    <QuestionMarkIcon className={styles.questionIcon} />
                    <span>Why do people give up on their dreams when challenges arise?</span>
                  </li>
                  <li>
                    <QuestionMarkIcon className={styles.questionIcon} />
                    <span>Why are people so hesitant to accept changes and upgrade themselves?</span>
                  </li>
                  <li>
                    <QuestionMarkIcon className={styles.questionIcon} />
                    <span>Why does competition make people scared, and how to face it?</span>
                  </li>
                  <li>
                    <QuestionMarkIcon className={styles.questionIcon} />
                    <span>Why do people become afraid of losing their strength, love, or influence?</span>
                  </li>
                </ul>
              </motion.div>

              {/* Case Studies & Inspirations Section */}
              <motion.div className={styles.card} variants={fadeInUp}>
                <h3 className={styles.subHeading}>Case Studies &amp; Practical Examples</h3>
                <p>During the seminar, we analyze the execution mindsets and actions of legendary leaders to map out strategies for local business success:</p>
                <div className={styles.leadersGrid}>
                  <div className={styles.leaderItem}>
                    <div className={styles.leaderImageWrap}>
                      <Image 
                        src="/events/why/Steav-Jobs.jpg" 
                        alt="Steve Jobs" 
                        fill 
                        className={styles["leaderImageWrap img"]}
                      />
                    </div>
                    <div className={styles.leaderBody}>
                      <strong>Steve Jobs</strong>
                      <p>Sustained innovation, visionary positioning, and building an uncompromising brand.</p>
                    </div>
                  </div>
                  <div className={styles.leaderItem}>
                    <div className={styles.leaderImageWrap}>
                      <Image 
                        src="/events/why/dhirrubai.jpg" 
                        alt="Dhirubhai Ambani" 
                        fill 
                      />
                    </div>
                    <div className={styles.leaderBody}>
                      <strong>Dhirubhai Ambani</strong>
                      <p>Massive scalability, strategic audacity, and pioneering resource execution.</p>
                    </div>
                  </div>
                  <div className={styles.leaderItem}>
                    <div className={styles.leaderImageWrap}>
                      <Image 
                        src="/events/why/dhoni.jpg" 
                        alt="MS Dhoni" 
                        fill 
                      />
                    </div>
                    <div className={styles.leaderBody}>
                      <strong>MS Dhoni (Captain Cool)</strong>
                      <p>Emotional control, leading under extreme pressure, and consistent execution habits.</p>
                    </div>
                  </div>
                </div>
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
                  <span className={styles.cardStatusLabel}>Seminar Status</span>
                  <div className={styles.cardStatus}>
                    <span>Forthcoming</span>
                  </div>
                  
                  <div className={styles.feeDetails}>
                    <div className={styles.feeItem}>
                      <span className={styles.feeLabel}>Format</span>
                      <span className={styles.feeValue}>Live Seminar (Pune)</span>
                    </div>
                    <div className={styles.feeItem}>
                      <span className={styles.feeLabel}>Registration Fee</span>
                      <span className={styles.feeValue}>Free (Invite-Only)</span>
                    </div>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <p className={styles.statusDesc}>
                    Commit yourself to attend and discover the strategic breakthroughs needed to upgrade your life and business mindset.
                  </p>

                  <Link 
                    href="/contact?subject=Inquiry: WHY? Seminar Registration"
                    className={styles.inquiryBtn}
                  >
                    Commit to Attend
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

              {/* About Ashay Shah - below Forthcoming card */}
              <motion.div
                className={styles.speakerCard}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                style={{ marginTop: 24 }}
              >
                {/* Full-width banner photo with name overlay */}
                <div className={styles.speakerBanner}>
                  <Image
                    src="/events/why/ashay-Shah-Sir.png"
                    alt="Ashay Shah - Business & Life Coach"
                    fill
                    className={styles.speakerBannerImg}
                  />
                  <div className={styles.speakerBannerOverlay} />
                  <div className={styles.speakerNameBlock}>
                    <p className={styles.speakerTitle}>Business & Life Coach</p>
                    <h2>Ashay Shah</h2>
                  </div>
                </div>

                {/* Credential stats */}
                <div className={styles.speakerStats}>
                  <div className={styles.speakerStat}>
                    <span className={styles.speakerStatNum}>8,264+</span>
                    <span className={styles.speakerStatLabel}>Entrepreneurs</span>
                  </div>
                  <div className={styles.speakerStat}>
                    <span className={styles.speakerStatNum}>19,852+</span>
                    <span className={styles.speakerStatLabel}>Counselled</span>
                  </div>
                  <div className={styles.speakerStat}>
                    <span className={styles.speakerStatNum}>20 Yrs</span>
                    <span className={styles.speakerStatLabel}>Experience</span>
                  </div>
                </div>

                {/* Bio */}
                <div className={styles.speakerBody}>
                  <p>
                    A charismatic leader, phenomenal speaker, and mentor who has trained thousands of entrepreneurs to see their goals with clarity and turn ambition into measurable action.
                  </p>
                  <p>
                    Invited as a keynote speaker for educational and industrial organizations across India, Ashay Shah brings 20 years of global trend analysis and local market expertise to every engagement.
                  </p>
                  {/* Specialty tags */}
                  <div className={styles.speakerTags}>
                    {["Leadership Training","Motivational Keynotes","Business Coaching","Team Building","Negotiation","Counseling"].map(tag => (
                      <span key={tag} className={styles.speakerTag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter backTo="/events/why#" />
    </main>
  );
}
