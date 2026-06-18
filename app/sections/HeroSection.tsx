import Image from "next/image";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={styles["hero-section"]} aria-label="Furute leadership event">
      <Image
        src="/hero-image.webp"
        alt="Future Ready Training"
        fill
        priority
        fetchPriority="high"
        sizes="(max-width:768px) 100vw, 50vw"
        quality={75}
        className={styles["hero-bg-img"]}
      />
      <div className={styles["hero-overlay"]}>
        <h1>
          Passion Without
          <br />
          Priority Is Powerless...
        </h1>
      </div>
    </section>
  );
}
