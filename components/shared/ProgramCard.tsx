"use client";

import Image from "next/image";
import styles from "./ProgramCard.module.css";

interface ProgramCardProps {
  title: string;
  text: string;
  theme: string;
}

export default function ProgramCard({ title, text, theme }: ProgramCardProps) {
  const themeClass = styles[`theme-${theme}`] || "";

  return (
    <article
      className={`${styles["program-card"]} ${themeClass}`}
      tabIndex={0}
    >
      <div className={styles["program-visual"]} aria-hidden="true">
        <Image
          src={`/programs/${theme}.webp`}
          alt=""
          width={140}
          height={140}
          className={styles["program-image"]}
        />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}
