"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import SiteFooter from "@/components/layout/SiteFooter";
import { ArrowLeftIcon, ArrowRightIcon, PhoneIcon, ClockIcon, CheckIcon, CalendarIcon } from "@/components/ui/Icons";
import styles from "./mudrush.module.css";

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

export default function MudrushPage() {
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
          <span className={`${styles.badge} ${styles.badgeOutbound}`}>Outbound camp</span>
          <p className={styles.eyebrow}>Team Bonding & Adventure</p>
        </div>
        <h1>MUD ATTACK (MudRush)</h1>
        <p className={styles.lead}>
          Experience the ultimate fun, courage, and enthusiasm fest. A unique outbound team-building 
          and physical endurance event built to bring out the child in you!
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
                <h2>Experience The Thrill</h2>
                <p>
                  Experience the magnificent views of the Sinhagad valley as you rush through the woods overcoming challenging and fun obstacles with your friends. Bring back the child in you as you play in mud with the innocent carefree attitude. Dance your heart out at the Zumba and DJ session.
                </p>
                <p>
                  Mud Rush is powered by Furute, which teaches you to face obstacles and overcome challenges to create experiences for a lifetime!
                </p>
              </motion.div>

              {/* Inclusions & Activities Grid */}
              <motion.div className={styles.twoColGrid} variants={fadeInUp}>
                <div className={styles.card}>
                  <h3 className={styles.subHeading}>What's Included</h3>
                  <ul className={styles.list}>
                    <li>
                      <CheckIcon className={styles.checkIcon} />
                      <span>Mud Rush Event Pass</span>
                    </li>
                    <li>
                      <CheckIcon className={styles.checkIcon} />
                      <span>Obstacle Course & Adventure Challenges</span>
                    </li>
                    <li>
                      <CheckIcon className={styles.checkIcon} />
                      <span>DJ & Zumba Dancing Session</span>
                    </li>
                    <li>
                      <CheckIcon className={styles.checkIcon} />
                      <span>Lunch and High Tea (Pure Veg included in fees)</span>
                    </li>
                  </ul>
                </div>

                <div className={styles.card}>
                  <h3 className={styles.subHeading}>Activities</h3>
                  <ul className={styles.list}>
                    <li>
                      <CheckIcon className={styles.checkIcon} />
                      <span>The Mud Obstacle Course</span>
                    </li>
                    <li>
                      <CheckIcon className={styles.checkIcon} />
                      <span>Outdoor Zumba</span>
                    </li>
                    <li>
                      <CheckIcon className={styles.checkIcon} />
                      <span>DJ Live Session</span>
                    </li>
                    <li>
                      <CheckIcon className={styles.checkIcon} />
                      <span>Fun Sports & Group Activities</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Logistical Info */}
              <motion.div className={styles.card} variants={fadeInUp}>
                <h3 className={styles.subHeading}>Travel & Clothing Guidelines</h3>
                
                <div className={styles.guideBlock}>
                  <h4>Transport & Stay</h4>
                  <p>
                    Paid transportation by prior booking will be arranged from specific pick up points across the city, depending upon the requests from particular areas (Swargate, Nal Stop, University Circle, Kalyani Nagar, etc.). Stay facility is available on request (Paid).
                  </p>
                </div>

                <div className={styles.guideBlock}>
                  <h4>Clothing Recommendations</h4>
                  <p>
                    Prefer synthetic sports clothing (full body coverage). Wear appropriate sports shoes with good grip. Carry extra slip-ons / shoes to wear post-event as the first pair will get completely wet and muddy.
                  </p>
                </div>

                <div className={styles.guideBlock}>
                  <h4>Things to Carry</h4>
                  <ul className={styles.dotList}>
                    <li>Extra clothing (at least 2 pairs) & towels</li>
                    <li>Toiletries & water bottle</li>
                    <li>Sack and plastic bags to keep stuff and wet clothes</li>
                    <li>Umbrella/raincoat (in case of rain)</li>
                    <li>Personal essential medicines</li>
                  </ul>
                  <p className={styles.noteText}>
                    <strong>Important:</strong> Avoid carrying valuables, jewelry, and unnecessary heavy items.
                  </p>
                </div>
              </motion.div>

              {/* Policies Accordion Stack */}
              <motion.div className={styles.card} variants={fadeInUp}>
                <h3 className={styles.subHeading}>Policies & Terms</h3>
                
                <div className={styles.policyItem}>
                  <h5>Cancellation Policy</h5>
                  <ul className={styles.dotListSmall}>
                    <li>15+ days before the event: No cancellation fees.</li>
                    <li>7-15 days before the event: 25% booking fee charged.</li>
                    <li>3-6 days before the event: 50% booking fee charged.</li>
                    <li>0-2 days before the event: 100% cancellation fee.</li>
                    <li>In case of extreme weather/govt restrictions, alternate activities will be arranged, but no refunds will be issued.</li>
                  </ul>
                </div>

                <div className={styles.policyItem}>
                  <h5>Refund & Confirmation Policy</h5>
                  <p>
                    The applicable refund amount will be processed within 10 business days. Customers receive a confirmation voucher via email within 24 hours of successful booking. If preferred slots are unavailable, an alternate schedule will be arranged, or a full refund will be processed.
                  </p>
                </div>
              </motion.div>

            </motion.div>

            {/* Right Column - Sticky Booking Card */}
            <div className={styles.stickyCol}>
              <motion.div 
                className={styles.bookingCard}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.cardPriceLabel}>Registration Fees</span>
                  <div className={styles.cardPrice}>
                    <span>INR 1,200</span>
                    <small>/ person</small>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.priceDetail}>
                    <div className={styles.detailRow}>
                      <span>Adults & Kids (8+ yrs)</span>
                      <strong>INR 1,200</strong>
                    </div>
                    <div className={styles.detailRow}>
                      <span>Kids (below 8 yrs)</span>
                      <strong>INR 400</strong>
                    </div>
                  </div>

                  <div className={styles.promoBox}>
                    <h5>Special Offers:</h5>
                    <ul>
                      <li>
                        <strong>Group Discount:</strong> 10+ members get 10% OFF extra!
                      </li>
                      <li>
                        <strong>Students Cashback:</strong> INR 100 cashback (College ID mandatory).
                      </li>
                      <li>
                        <strong>Student Special Discount:</strong> INR 200 Cash Back on valid student cards.
                      </li>
                    </ul>
                  </div>

                  <Link 
                    href="/contact?subject=Mud Attack Booking Inquiry"
                    className={styles.bookBtn}
                  >
                    Inquire & Book Now
                    <ArrowRightIcon />
                  </Link>

                  <div className={styles.contactDesk}>
                    <span>Need Help with Booking?</span>
                    <a href="tel:+919822966644" className={styles.phoneLink}>
                      <PhoneIcon className={styles.phoneIcon} />
                      +91 9822966644
                    </a>
                    <a href="tel:+919822600521" className={styles.phoneLinkSub}>
                      Support: +91 9822600521
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <motion.section 
        className={styles["gallery-section"]}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={staggerContainer}
      >
        <div className={styles.container}>
          <h2>Event Memories & Gallery</h2>
          <p className={styles.galleryLead}>Take a look at the enthusiasm, mud challenges, and smiles from our previous editions.</p>
          
          <div className={styles.galleryGrid}>
            {[
              { src: "/events/mudrush/mudrush-gallery-1.jpg", alt: "Mud Rush Team Crossing Obstacle" },
              { src: "/events/mudrush/mudrush-gallery-2.jpg", alt: "Mud Rush Group Photo" },
              { src: "/events/mudrush/mudrush-gallery-3.jpg", alt: "Participants in Mud" },
              { src: "/events/mudrush/mudrush-gallery-4.png", alt: "Mud Rush Fun Event" }
            ].map((img, idx) => (
              <motion.div 
                className={styles.galleryItem} 
                key={idx}
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Image 
                  src={img.src} 
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className={styles.galleryImg}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <SiteFooter backTo="/events/mudrush#" />
    </main>
  );
}
