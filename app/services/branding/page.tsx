"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import SiteFooter from "@/components/layout/SiteFooter";
import { ArrowLeftIcon, ArrowRightIcon, PhoneIcon, CheckIcon } from "@/components/ui/Icons";
import styles from "./branding.module.css";

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

export default function BrandingPage() {
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
          subject: "Branding Service Inquiry",
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
    "Consult importance of branding",
    "Large and small business branding",
    "How to create an effective brand",
    "How to choose a brand name and logo",
    "How to create a favorable brand image",
    "Understanding brand value",
    "Increasing brand equity",
    "Branding and marketing strategy",
    "How to leverage your brand",
    "Brand consistency management",
    "Corporate rebranding services"
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
            src="/services/branding.jpg" 
            alt="Branding background"
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
            <span className={`${styles.badge} ${styles.badgeGold}`}>Services</span>
            <p className={styles.eyebrowLight}>Identity & Strategy</p>
          </div>
          <h1 className={styles.heroTitleLight}>Branding</h1>
          <p className={styles.leadLight}>
            Because your brand says it all. Align your identity, message, and market presence 
            to stand out from competitors and build long-term value.
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
                <h2>Why is Branding Critical?</h2>
                <p>
                  Your brand is what distinguishes you from your competitors. It is what helps a customer recognize and recall you, and thus it is of utmost importance for all sizes of organizations. Having the right brand image takes you a long way, and that is why Furute caters branding services to help you create the right brand image.
                </p>
                <p>
                  Most branding agencies and firms focus solely on brand design (visuals). At Furute, we believe a branding agency should be able to consult for branding and also assist in marketing it. Furute creates a structured flow to create a complete branding strategy in a simplified and formatted system.
                </p>
              </motion.div>

              {/* Offerings Section */}
              <motion.div className={styles.card} variants={fadeInUp}>
                <h3 className={styles.subHeading}>What We Offer</h3>
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
                  <p>Submit your details to discuss a customized branding strategy with Ashay Shah.</p>
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
      <SiteFooter backTo="/services/branding#" />
    </main>
  );
}
