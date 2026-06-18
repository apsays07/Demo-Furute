import Image from "next/image";
import Link from "next/link";
import { MicIcon, ArrowRightIcon as ArrowIcon } from "@/components/ui/Icons";
import styles from "./MentorSection.module.css";

const mentorImage = "/ashay-shah.webp";

function cx(...names: Array<string | false | undefined>) {
  return names
    .filter(Boolean)
    .map((name) => styles[name as string])
    .join(" ");
}

export default function MentorSection() {
  return (
    <section className={styles["mentor-section"]} id="services">
      <div className={styles["mentor-section-inner"]}>
        <div className={styles["mentor-copy"]}>
          <p className={styles["section-eyebrow"]}>Meet The Mentor</p>
          <h2>Meet Ashay Shah</h2>
          <p>
            <strong>Ashay Shah</strong> helps people see their dreams with
            clarity and turn them into practical action, even when limitations
            feel heavy.
          </p>
          <p>
            He is a charismatic leader, phenomenal speaker, life coach, and
            mentor who has been invited as a keynote speaker for educational
            and industrial organizations. His work focuses on{" "}
            <strong>business training</strong>, mentoring, and direct,
            no-nonsense guidance.
          </p>
          <Link className={styles["mentor-cta"]} href="/invite">
            <span className={styles["mentor-cta-icon"]} aria-hidden="true">
              <MicIcon />
            </span>
            <span>Invite Me As A Speaker</span>
            <ArrowIcon className={styles["mentor-cta-arrow"]} />
          </Link>
        </div>

        <figure
          className={cx("mentor-portrait")}
          aria-label="Ashay Shah"
        >
          <Image
            src={mentorImage}
            alt="Ashay Shah"
            width={390}
            height={430}
            loading="lazy"
            sizes="390px"
            quality={70}
          />
          <div className={styles["mentor-portrait-fallback"]} aria-hidden="true">
            <span>AS</span>
          </div>
        </figure>
      </div>
    </section>
  );
}
