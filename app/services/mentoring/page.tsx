"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import SiteFooter from "@/components/layout/SiteFooter";
import { ArrowLeftIcon, ArrowRightIcon, PhoneIcon, CheckIcon } from "@/components/ui/Icons";
import styles from "./mentoring.module.css";

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
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  }
};

export default function MentoringPage() {
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profession: "",
    referral: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          subject: "Mentoring Service Inquiry",
          message: `Business/Profession: ${formData.profession}\nReferral Source: ${formData.referral}`,
        }),
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setFormData({ name: "", email: "", phone: "", profession: "", referral: "" });
      }
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const offerings = [
    "Self discovery",
    "Building self confidence, self esteem & self efficacy",
    "Learn your strengths & limitations",
    "Improving strengths",
    "Creating work-life balance",
    "Understanding desires & realities",
    "Focus and Priority",
    "Emotional Intelligence",
    "Intellectual growth",
    "Spiritual cleansing",
    "Stress management",
    "Health management",
    "Time management",
    "Business growth",
    "Social growth",
    "Self growth",
    "Self Actualization",
    "Reenergizing yourself"
  ];

  return (
    <main className={styles.page}>
      {/* Background blobs for premium depth */}
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />

      {/* Global Navbar */}
      <Navbar />

      {/* Hero Section with Big Background Image */}
      <motion.section 
        className={styles.heroBanner}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className={styles.heroBg}>
          <Image 
            src="/services/mentoring.webp" 
            alt="Mentoring background"
            fill
            priority
            quality={90}
            className={styles.heroBgImg}
          />
          <div className={styles.heroOverlay} />
        </div>

        <div className={styles.heroInner}>
          <Link href="/#services" className={styles["back-link-light"]}>
            <ArrowLeftIcon />
            Back to services
          </Link>
          <div className={styles.headerRow}>
            <span className={`${styles.badge} ${styles.badgeCoral}`}>Services</span>
            <p className={styles.eyebrowLight}>1-on-1 Guidance</p>
          </div>
          <h1 className={styles.heroTitleLight}>Mentoring</h1>
          <p className={styles.leadLight}>
            We are always there for you. Rediscover yourself, clarify your goals, and guide 
            your professional and personal journey with trusted mentorship.
          </p>
        </div>
      </motion.section>

      {/* Main Content Info Grid */}
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
              {/* Core Description Card */}
              <motion.div className={styles.card} variants={fadeInUp}>
                <h2>Why is Mentoring Critical?</h2>
                <p>
                  No matter how successful or unsuccessful we are in our lives, there comes a moment when we think we have lost ourselves. At such a point, we need a guru, a mentor, a coach, a friend who will help us to find and redeem ourselves.
                </p>
                <p>
                  We provide mentoring services to everyone who needs to rediscover themselves, be it a CEO of an MNC, a professional, a small entrepreneur or a confused youth. It is a program that guides you mentally, emotionally as well as spiritually whenever you need it.
                </p>
              </motion.div>

              {/* Offerings Section */}
              <motion.div className={styles.card} variants={fadeInUp}>
                <h3 className={styles.subHeading}>What It Offers</h3>
                <div className={styles.offeringsGrid}>
                  {offerings.map((item, index) => (
                    <div className={styles.offeringCard} key={index}>
                      <div className={styles.checkIconWrap}>
                        <CheckIcon className={styles.checkIcon} />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

            </motion.div>

            {/* Right Column - Sticky Inquiry Form */}
            <div className={styles.stickyCol}>
              <motion.div 
                className={styles.inquiryCard}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className={styles.cardHeader}>
                  <h3>Enquire Now</h3>
                  <p>Submit your details to discuss a customized mentoring strategy with Ashay Shah.</p>
                </div>

                <div className={styles.cardBody}>
                  <AnimatePresence mode="wait">
                    {!submitSuccess ? (
                      <motion.form 
                        onSubmit={handleSubmit}
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key="form"
                      >
                        <div className={styles.formGroup}>
                          <label htmlFor="name">Your Name *</label>
                          <input 
                            type="text" 
                            id="name"
                            required
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="email">Your Email *</label>
                          <input 
                            type="email" 
                            id="email"
                            required
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="phone">Phone No *</label>
                          <input 
                            type="tel" 
                            id="phone"
                            required
                            placeholder="9822600521"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="profession">Business / Profession *</label>
                          <input 
                            type="text" 
                            id="profession"
                            required
                            placeholder="Marketing Lead / Consultant"
                            value={formData.profession}
                            onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="referral">How did you learn about us?</label>
                          <input 
                            type="text" 
                            id="referral"
                            placeholder="Google, Social Media, Friend"
                            value={formData.referral}
                            onChange={(e) => setFormData({ ...formData, referral: e.target.value })}
                          />
                        </div>

                        <button 
                          type="submit" 
                          disabled={isSubmitting}
                          className={styles.submitBtn}
                        >
                          {isSubmitting ? "Sending..." : "Send Inquiry"}
                          <ArrowRightIcon />
                        </button>
                      </motion.form>
                    ) : (
                      <motion.div 
                        className={styles.successBlock}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key="success"
                      >
                        <div className={styles.successIconWrap}>
                          <CheckIcon className={styles.successIcon} />
                        </div>
                        <h4>Thank You!</h4>
                        <p>Your inquiry was submitted successfully. We will get back to you shortly.</p>
                        <button 
                          onClick={() => setSubmitSuccess(false)}
                          className={styles.resetBtn}
                        >
                          Send Another Message
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className={styles.contactDesk}>
                    <span>Still Have Questions?</span>
                    <a href="tel:+919822600521" className={styles.phoneLink}>
                      <PhoneIcon className={styles.phoneIcon} />
                      +91 9822600521
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

      {/* Footer */}
      <SiteFooter backTo="/services/mentoring#" />
    </main>
  );
}
