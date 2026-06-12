"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import SiteFooter from "@/components/layout/SiteFooter";
import { ArrowLeftIcon, ArrowRightIcon, PhoneIcon, CheckIcon } from "@/components/ui/Icons";
import styles from "./digital-marketing.module.css";

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

export default function DigitalMarketingPage() {
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
          subject: "Digital Marketing Service Inquiry",
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

  const serviceGroups = [
    {
      title: "Search Engine Optimization (SEO)",
      description: "Achieve top search rankings through systematic audits, keyword mapping, content marketing, and authoritative backlink building.",
      items: [
        "Keywords Research",
        "On Page Factor",
        "Off Page Factor",
        "Google Ranking",
        "Competition Analysis",
        "Content Marketing",
        "Blog Post"
      ]
    },
    {
      title: "PPC Campaigns (Pay Per Click)",
      description: "Drive immediate high-intent leads and sales using structured paid search, display networks, remarketing, and precise bidding models.",
      items: [
        "Search, Display, Video, Mobile Ads",
        "Remarketing Campaigns",
        "Adwords keyword Research",
        "Ad groups & Ad Copies",
        "BID & Budget management",
        "Conversion Tracking",
        "Search Console & Analytics"
      ]
    },
    {
      title: "Social Media Marketing (SMM)",
      description: "Build brand authority, community trust, and customer loyalty by promoting your business on major networks like Facebook, LinkedIn, Twitter, and YouTube.",
      items: [
        "Social KPI analysis",
        "Facebook campaigns",
        "LinkedIn B2B targetting",
        "YouTube video reach",
        "Community management",
        "Trust & brand authority"
      ]
    },
    {
      title: "Email Marketing",
      description: "One of the most cost-effective ways of reaching and nurturing customers. We segment subscribers by demographics and behavior to deliver high-converting messages.",
      items: [
        "Audience segmentation",
        "Cost-effective outreach",
        "Automated email sequences",
        "Campaign conversion tracking"
      ]
    },
    {
      title: "Online Reputation Management (ORM)",
      description: "Restore or improve your brand's standing by replacing negative content with positive brand assets. Build absolute trust and credibility with your customers.",
      items: [
        "Brand standing restoration",
        "Negative impact elimination",
        "Credibility boosting",
        "Customer trust monitoring"
      ]
    }
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
            src="/services/digital-marketing.jpg" 
            alt="Digital Marketing background"
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
            <span className={`${styles.badge} ${styles.badgeViolet}`}>Services</span>
            <p className={styles.eyebrowLight}>Reach &amp; Revenue</p>
          </div>
          <h1 className={styles.heroTitleLight}>Digital Marketing</h1>
          <p className={styles.leadLight}>
            We don't just do good, we improve all intersections of online marketing. We aim at achieving business outcomes using critical analysis standards and targeted lead-gen campaigns.
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
                <h2>M.A.D. Digital Marketing Company in Pune</h2>
                <p>
                  Furute is a Making A Difference (M.A.D.) Digital Marketing Company in Pune. We aim at achieving the business outcomes of our clients, using every possible platform of online marketing combined with our own internal analytical standards.
                </p>
                <p>
                  We never end with doing just "good". Our dedicated team is crazy about improving all intersections of online marketing to ensure your brand stands out, attracts high-intent traffic, and drives consistent lead conversion.
                </p>
              </motion.div>

              {/* Offerings Section */}
              <motion.div className={styles.card} variants={fadeInUp}>
                <div className={styles.serviceGroupsList}>
                  {serviceGroups.map((group, groupIdx) => (
                    <div className={styles.serviceGroup} key={groupIdx}>
                      <div className={styles.serviceGroupHeader}>
                        <h3>{group.title}</h3>
                      </div>
                      <p className={styles.serviceDesc}>{group.description}</p>
                      <div className={styles.bulletPointsGrid}>
                        {group.items.map((item, idx) => (
                          <div className={styles.bulletItem} key={idx}>
                            <div className={styles.checkIconWrap}>
                              <CheckIcon className={styles.checkIcon} />
                            </div>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
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
                  <p>Submit your details to discuss a customized digital marketing campaign with Ashay Shah.</p>
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
                            placeholder="Marketing Lead / Owner"
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
      <SiteFooter backTo="/services/digital-marketing#" />
    </main>
  );
}
