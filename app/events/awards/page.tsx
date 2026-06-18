"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import SiteFooter from "@/components/layout/SiteFooter";
import { ArrowLeftIcon, TrophyIcon, SparklesIcon, ZapIcon, TrendingUpIcon, UsersIcon, TargetIcon } from "@/components/ui/Icons";
import styles from "./awards.module.css";

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

interface Winner {
  name: string;
  detail: string;
  image?: string;
}

interface AwardCategory {
  title: string;
  icon: React.ReactNode;
  winners: Winner[];
}

export default function AwardsPage() {
  const categories: AwardCategory[] = [
    {
      title: "Rising Stars",
      icon: <SparklesIcon />,
      winners: [
        { name: "Pankaj Chouhan", detail: "Interior & Landscape Designer", image: "Pankay-Chouhan__1490873319_182.70.99.16.jpg" },
        { name: "Chandan Naik", detail: "Sales, Service & Consultant in Agricultural Products", image: "Chandan-Naik.jpg" },
        { name: "Lucky Surana", detail: "Industrialist & Educationist", image: "lucky.jpg" },
        { name: "Viraj Parmar", detail: "Construction Services & Software", image: "Viraj-Parmar.jpg" },
        { name: "Nihar Jagtap", detail: "Interior Designer", image: "Nihar-Jagtap.jpg" },
        { name: "Rahul Ramsina", detail: "CCTV Security Systems Integrator", image: "Rahul-Ramsina.jpg" },
        { name: "Dilip Raka", detail: "Industrial RO Components", image: "Dilip-Raka.jpg" },
        { name: "Pankaj Navlakha", detail: "Construction & Land Developer", image: "Pankaj-Navlakha.jpg" },
        { name: "Kalpesh Shah", detail: "CCTV Security & Cab Service", image: "Kalpesh-Shah.jpg" },
        { name: "Anjali Parmar", detail: "German Coaching Classes", image: "Anjali-Parmar.jpg" },
      ],
    },
    {
      title: "Fastest Growing Entrepreneur",
      icon: <TrendingUpIcon />,
      winners: [
        { name: "Manish Kalantri", detail: "Corporate vendor / supplier", image: "Manish-Kalantri.jpg" },
      ],
    },
    {
      title: "Horizontal Growth",
      icon: <TargetIcon />,
      winners: [
        { name: "Kamlesh Parmar", detail: "Construction, Cloth Retail, Manufacturing, Bakery, Hotel", image: "Kamlesh-Parmar.jpg" },
      ],
    },
    {
      title: "Making a Difference",
      icon: <ZapIcon />,
      winners: [
        { name: "Sohan Oswal", detail: "Fragrance Stick Manufacturers", image: "Sohan-Oswal.jpg" },
      ],
    },
    {
      title: "Enterprising Entrepreneurs",
      icon: <UsersIcon />,
      winners: [
        { name: "Akshat Oswal", detail: "Entrepreneurship & Growth", image: "Akshat-Oswal.jpg" },
        { name: "Prasad Gundecha", detail: "Home Automation", image: "Prasad-Gundecha.jpg" },
      ],
    },
    {
      title: "Brand Creator",
      icon: <SparklesIcon />,
      winners: [
        { name: "Kalpesh Kavediya", detail: "Meet Kitchen Appliances", image: "Kalpesh-Kavediya.jpg" },
      ],
    },
    {
      title: "Vertical Growth",
      icon: <TrendingUpIcon />,
      winners: [
        { name: "Pritam Salunke", detail: "Readymade Garment and Shoe Shops", image: "Pritam-Salunke.jpg" },
      ],
    },
    {
      title: "Achiever of the Year",
      icon: <TrophyIcon />,
      winners: [
        { name: "Mansukh Sonigra", detail: "Distributor of Home & Kitchen Appliances", image: "Mansukh-Sonigra.jpg" },
        { name: "Manoj Shah", detail: "Interior Infrastructural Solution, Creative Natural Stone Maker", image: "Manoj-Shah.jpg" },
      ],
    },
    {
      title: "Mr. Visionary",
      icon: <TargetIcon />,
      winners: [
        { name: "Madhav Nargunde", detail: "Distribution of Automotive Components", image: "Madhav-Nargunde.jpg" },
      ],
    },
    {
      title: "Balanced Growth",
      icon: <UsersIcon />,
      winners: [
        { name: "Akshay Gadkari", detail: "Construction & Interior", image: "Akshay-Gadkari.jpg" },
      ],
    },
    {
      title: "Startups Of The Year",
      icon: <ZapIcon />,
      winners: [
        { name: "Tejas Shah", detail: "Social Media Optimizer", image: "Tejas-Shah.jpg" },
        { name: "Bhavesh Shah", detail: "Wholesale Stationery Distributor", image: "Bhavesh-Shah.jpg" },
      ],
    },
    {
      title: "Bounce Back Award",
      icon: <TrophyIcon />,
      winners: [
        { name: "Avant Parmar", detail: "Mobile Repairing", image: "Avant-Parmar.jpg" },
        { name: "Sumeet Desarda", detail: "Architectural & Structural Fabrication", image: "Sumeet-Desarda.jpg" },
      ],
    },
  ];

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
          <span className={`${styles.badge} ${styles.badgeAwards}`}>Awards</span>
          <p className={styles.eyebrow}>Honoring Outstanding Results</p>
        </div>
        <h1>Furute Awards 2017</h1>
        <p className={styles.lead}>
          Celebrating entrepreneurship, consistency, resilience, and outstanding business growth. 
          Recognizing the standout leaders who turned coaching insights into massive growth.
        </p>
      </motion.section>

      {/* Awards Content Section */}
      <section className={styles.contentSection}>
        <div className={styles.container}>
          
          {/* Top Award Featured Card */}
          <motion.div 
            className={styles.topAwardWrapper}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className={styles.topAwardCard}>
              <div className={styles.trophyWrap}>
                <TrophyIcon className={styles.trophyIconLarge} />
              </div>
              <div className={styles.topAwardImageWrap}>
                <Image 
                  src="/events/awards/Rohit-Pasalkar.jpg" 
                  alt="Rohit Pasalkar" 
                  fill 
                  className={styles.topAwardImage}
                />
              </div>
              <div className={styles.topAwardInfo}>
                <span className={styles.topAwardCategory}>Top Honor</span>
                <h2>Furutein Of The Year</h2>
                <p>Rohit Pasalkar (Interior Designer)</p>
              </div>
            </div>
          </motion.div>

          {/* Grid of other categories */}
          <motion.div 
            className={styles.categoriesGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={staggerContainer}
          >
            {categories.map((category, index) => (
              <motion.div
                key={index}
                className={styles.categoryCard}
                variants={fadeInUp}
              >
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryBadgeIcon}>
                    {category.icon}
                  </div>
                  <h3>{category.title}</h3>
                  <span className={styles.categoryCount}>
                    {category.winners.length} {category.winners.length === 1 ? "Winner" : "Winners"}
                  </span>
                </div>

                <div className={styles.winnersList}>
                  {category.winners.map((winner, idx) => (
                    <div key={idx} className={styles.winnerItem}>
                      {winner.image && (
                        <div className={styles.winnerAvatar}>
                          <Image
                            src={`/events/awards/${winner.image}`}
                            alt={winner.name}
                            fill
                            className={styles.winnerAvatarImg}
                          />
                        </div>
                      )}
                      <div className={styles.winnerMeta}>
                        <span className={styles.winnerName}>{winner.name}</span>
                        <span className={styles.winnerDetail}>{winner.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* Footer */}
      <SiteFooter backTo="/events/awards#" />
    </main>
  );
}
