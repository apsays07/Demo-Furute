import styles from "./WhatWeDoSection.module.css";

export default function WhatWeDoSection() {
  return (
    <section className={styles["what-we-do"]} id="about-us">
      <div className={styles["what-we-do-inner"]}>
        <div className={styles["what-we-do-heading"]}>
          <p className={styles["section-eyebrow"]}>What We Do</p>
          <h2>Clear guidance for focused business growth.</h2>
        </div>
        <div className={styles["what-we-do-content"]}>
          <p className={styles["lead-text"]}>
            Furute helps entrepreneurs and professionals build clarity,
            confidence, and direction through practical business training and
            life coaching.
          </p>
          <p>
            Founded by Ashay Shah, Furute has trained more than 8,000 people
            through business programs, counseling, and holistic development.
          </p>
        </div>
      </div>
    </section>
  );
}
