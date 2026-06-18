
import Image from "next/image";
import { initials } from "@/lib/utils";
import styles from "./TestimonialCard.module.css";

interface TestimonialCardProps {
  name: string;
  role: string;
  review: string;
  accent?: "teal" | "gold" | "blue";
  image?: string;
  rating?: number; // kept in interface for API compat but not displayed
  company?: string;
}

export default function TestimonialCard({
  name,
  role,
  review,
  accent = "teal",
  image,
  company,
}: TestimonialCardProps) {
  const accentClass =
    accent === "gold"
      ? styles["accent-gold"]
      : accent === "blue"
        ? styles["accent-blue"]
        : styles["accent-teal"];

  return (
    <article className={`${styles["testimonial-card"]} ${accentClass}`}>
      <span className={styles["testimonial-quote-mark"]} aria-hidden="true">
        &quot;
      </span>

      <p className={styles["testimonial-review"]}>{review}</p>

      <div className={styles["testimonial-author"]}>
        {/* Avatar: photo if available, else initials */}
        <span className={styles["testimonial-avatar"]} aria-hidden="true">
          {image ? (
            <Image
              src={image}
              alt={name}
              width={44}
              height={44}
              loading="lazy"
              sizes="44px"
              quality={75}
              className={styles["testimonial-avatar-img"]}
            />
          ) : (
            initials(name)
          )}
        </span>
        <div>
          <h3>{name}</h3>
          <p>
            {role}
            {company && company !== role && ` · ${company}`}
          </p>
        </div>
      </div>
    </article>
  );
}
