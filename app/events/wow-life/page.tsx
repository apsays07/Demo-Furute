"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import SiteFooter from "@/components/layout/SiteFooter";
import { ArrowLeftIcon, ArrowRightIcon, PhoneIcon, CheckIcon } from "@/components/ui/Icons";
import styles from "./wow-life.module.css";

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

export default function WowLifePage() {
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
          <p className={styles.eyebrow}>Life Management & Self-Control</p>
        </div>
        <h1>WOW LIFE (LIFE Management)</h1>
        <p className={styles.lead}>
          An experiential personal growth training program focused on mindset development, 
          emotional maturity, consistency, and holistic lifestyle rejuvenation.
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
              
              {/* Quote Block */}
              <motion.div className={styles.quoteCard} variants={fadeInUp}>
                <p className={styles.quoteText}>
                  &ldquo;In a day, when you don&rsquo;t come across any problems you can be sure that you are travelling in a wrong path&rdquo;
                </p>
                <p className={styles.quoteAuthor}>— Swami Vivekananda</p>
              </motion.div>

              {/* Introduction */}
              <motion.div className={styles.card} variants={fadeInUp}>
                <h2>A Beautiful Life Begins with a Beautiful Mind</h2>
                <p>
                  The prime ingredients of the recipe for a beautiful life are Mental peace, Positive thoughts, and rejuvenation which lead us to love &amp; laugh abundantly. Though problems of life are common issues, very often they come as a disaster and ruin everything along with self confidence. Sometimes they don&rsquo;t appear in a vast form, but with our back to the wall, life becomes badly affected.
                </p>
                <p>
                  Often we look only at the negative side of life. On the other hand, life contains a positive &amp; gorgeous side also, and obviously it is a great gift bestowed upon us by our Creator. Every moment of our life is priceless and should be cherished. But, in the quest of being successful and leading the race of reaching to the top, we almost forget living our lives. Instead of humans, we become robots who are programmed to win the race. We become almost incapable of appreciating how beautiful our life is. All we can do is complain about how hard life is.
                </p>
                <p>
                  This kind of situation puts us in a terrible dilemma from which we want to get rid of immediately. WOW LIFE helps you acquire the knowledge needed to build up more of mental &amp; spiritual strength to handle and overcome these situations properly, achieving the science of self-control, the art of developing a pure mind, mental peace in adverse situations, and proper relationships.
                </p>
              </motion.div>

              {/* Highlights of the Program */}
              <motion.div className={styles.card} variants={fadeInUp}>
                <h3 className={styles.subHeading}>Highlights of the Program</h3>
                <ul className={styles.list}>
                  <li>
                    <CheckIcon className={styles.checkIcon} />
                    <span><strong>Spiritual Rejuvenation:</strong> A dedicated meditation session (Static &amp; Dynamic) for spiritual cleansing and rejuvenation.</span>
                  </li>
                  <li>
                    <CheckIcon className={styles.checkIcon} />
                    <span><strong>Life Balance &amp; Right Attitude:</strong> Cultivate emotional maturity, stress management, and healthy relationships.</span>
                  </li>
                  <li>
                    <CheckIcon className={styles.checkIcon} />
                    <span><strong>Physical Rejuvenation:</strong> Learn communication, healthy habits, body gestures, postures, and personality development.</span>
                  </li>
                  <li>
                    <CheckIcon className={styles.checkIcon} />
                    <span><strong>Mental Rejuvenation:</strong> Re-examine thoughts, thought patterns, memory files, prejudice, stereotypes, and feelings.</span>
                  </li>
                  <li>
                    <CheckIcon className={styles.checkIcon} />
                    <span><strong>Intellectual Rejuvenation:</strong> Refine intellect, reasoning, problem-solving, and decision-making capabilities.</span>
                  </li>
                  <li>
                    <CheckIcon className={styles.checkIcon} />
                    <span><strong>Emotional Rejuvenation:</strong> Focus on emotional expression, stress release, and building high emotional intelligence.</span>
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
                  <span className={styles.cardStatusLabel}>Program Details</span>
                  <div className={styles.cardStatus}>
                    <span>Forthcoming</span>
                  </div>
                  
                  <div className={styles.feeDetails}>
                    <div className={styles.feeItem}>
                      <span className={styles.feeLabel}>Duration</span>
                      <span className={styles.feeValue}>3 Nights / 4 Days</span>
                    </div>
                    <div className={styles.feeItem}>
                      <span className={styles.feeLabel}>Retreat Fee</span>
                      <span className={styles.feeValue}>₹15,000/-</span>
                    </div>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <p className={styles.statusDesc}>
                    Take a day to reflect on how beautiful life is and say &ldquo;WOW LIFE, you are beautiful&rdquo;. Inquire now to secure your spot for the next retreat batch.
                  </p>

                  <Link 
                    href="/contact?subject=Inquiry: WOW Life Workshop"
                    className={styles.inquiryBtn}
                  >
                    Enquire Now
                    <ArrowRightIcon />
                  </Link>

                  <div className={styles.contactDesk}>
                    <span>Still Have Questions?</span>
                    <a href="tel:02026131921" className={styles.phoneLink}>
                      <PhoneIcon className={styles.phoneIcon} />
                      020-26131921
                    </a>
                    <a href="tel:+919822600521" className={styles.phoneLinkSub}>
                      Support Mobile: +91 9822600521
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className={styles.gallerySection}>
        <div className={styles.container}>
          <h2>Retreat Highlights</h2>
          <p className={styles.galleryLead}>Visual glimpses of the rejuvenative, high-energy sessions at our past WOW Life programs.</p>
          <div className={styles.galleryGrid}>
            {['1.jpg', '2.jpg', '4.jpg', '5.jpg'].map((img, i) => (
              <div key={i} className={styles.galleryItem}>
                <Image 
                  src={`/events/wow-life/${img}`} 
                  alt={`WOW Life session highlight ${i+1}`}
                  fill
                  className={styles.galleryImg}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter backTo="/events/wow-life#" />
    </main>
  );
}
