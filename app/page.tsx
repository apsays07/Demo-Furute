"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import styles from "./page.module.css";

const programs = [
  {
    title: "Insights",
    text: "Practical market and self-awareness inputs that help you see the next decision with clarity.",
    theme: "insights",
  },
  {
    title: "Organization Training",
    text: "Structured learning sessions for teams to improve communication, ownership, and execution.",
    theme: "training",
  },
  {
    title: "Goal Setting",
    text: "Focused frameworks to turn ambition into measurable milestones and daily action.",
    theme: "goals",
  },
  {
    title: "Branding",
    text: "Guidance to shape a sharper identity, stronger message, and more memorable market presence.",
    theme: "branding",
  },
  {
    title: "Consultancy",
    text: "Business mentoring that helps diagnose challenges and build practical growth plans.",
    theme: "consultancy",
  },
  {
    title: "Breakthrough",
    text: "Mindset and strategy work for moving past stuck points with renewed confidence.",
    theme: "breakthrough",
  },
  {
    title: "Sarathi",
    text: "Personal guidance and support for important transitions, decisions, and direction.",
    theme: "sarathi",
  },
  {
    title: "Beyond The Classroom",
    text: "Experiential learning that connects concepts with real business and life situations.",
    theme: "classroom",
  },
  {
    title: "Mentoring",
    text: "One-on-one support to strengthen thinking, leadership habits, and long-term growth.",
    theme: "mentoring",
  },
];

const mentorImage = "/ashay-shah.png";

const impactStats = [
  {
    value: 8264,
    label: "Leaders Trained",
    icon: ChartIcon,
  },
  {
    value: 19852,
    label: "Counselling",
    icon: BasketIcon,
  },
  {
    value: 11852,
    label: "Lives Touched",
    icon: MapIcon,
  },
  {
    value: 5537,
    label: "Days MAD (Making A Difference)",
    icon: TagIcon,
  },
];

const testimonials = [
  {
    name: "Lucky Surana",
    role: "Industrialist & Educationist",
    review:
      "The program transformed my mindset. Emotional maturity, consistency, and a positive approach helped me grow personally and professionally.",
  },
  {
    name: "Avant Parmar",
    role: "Mobile Business Owner",
    review:
      "I started with a small mobile repair shop and implemented the lessons learned. My business turnover increased by 25% within a year.",
  },
  {
    name: "Akshat Oswal",
    role: "Co-Founder, Tech Innovance",
    review:
      "I learned team building and smart investment strategies that helped my business grow significantly and strengthen our brand.",
  },
  {
    name: "Khushboo Salunke",
    role: "Director, Unique Interior",
    review:
      "My outlook on life completely changed. I became more positive and confidently started my own interior design firm.",
  },
  {
    name: "Rohit Pasalkar",
    role: "Owner, Shree Designs",
    review:
      "The program helped me understand myself better and improve my business approach. My turnover eventually doubled.",
  },
  {
    name: "Maithili Jadhav",
    role: "Business Owner",
    review:
      "I learned networking and business strategies that resulted in nearly 30% growth within a year.",
  },
];

const featuredVideos = [
  {
    title: "Featured Talk",
    label: "Watch Video 01",
    videoId: "i-Qe4F17hKc",
  },
  {
    title: "Business Learning Session",
    label: "Watch Video 02",
    videoId: "Dp65MGhze3I",
  },
  {
    title: "Growth Insight",
    label: "Watch Video 03",
    videoId: "2ofM34EwKJo",
  },
  {
    title: "Mentoring Moment",
    label: "Watch Video 04",
    videoId: "S9fjt9HVf6Q",
  },
];

type Video = (typeof featuredVideos)[number];
type IconProps = { className?: string };

function cx(...names: Array<string | false | undefined>) {
  return names
    .filter(Boolean)
    .map((name) => styles[name as string])
    .join(" ");
}

function initials(value: string) {
  return value
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2);
}

function SvgIcon({
  className,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function ArrowIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </SvgIcon>
  );
}

function ChartIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="m7 15 4-4 3 3 5-7" />
    </SvgIcon>
  );
}

function BasketIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M6 9h12l-1 10H7L6 9Z" />
      <path d="M9 9a3 3 0 0 1 6 0" />
    </SvgIcon>
  );
}

function MapIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="m9 18-5 2V6l5-2 6 2 5-2v14l-5 2-6-2Z" />
      <path d="M9 4v14" />
      <path d="M15 6v14" />
    </SvgIcon>
  );
}

function MicIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 3a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
      <path d="M12 18v3" />
    </SvgIcon>
  );
}

function PlayIcon(props: IconProps) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7L8 5Z" />
    </svg>
  );
}

function TagIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M20 10 12 2H4v8l8 8 8-8Z" />
      <path d="M7.5 6.5h.01" />
    </SvgIcon>
  );
}

function CloseIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </SvgIcon>
  );
}

function ImpactStat({
  value,
  label,
  icon: Icon,
}: {
  value: number;
  label: string;
  icon: (props: IconProps) => React.ReactNode;
}) {
  return (
    <article className={styles["impact-stat"]}>
      <span className={styles["impact-stat-icon-wrap"]} aria-hidden="true">
        <Icon className={styles["impact-stat-icon"]} />
      </span>
      <strong
        className={styles["impact-stat-number"]}
        aria-label={`${value.toLocaleString()} ${label}`}
      >
        <span>{value.toLocaleString()}</span>
      </strong>
      <span className={styles["impact-stat-label"]}>{label}</span>
    </article>
  );
}

export default function Home() {
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [mentorMissing, setMentorMissing] = useState(false);

  return (
    <main className={styles["home-page"]} id="home">
      <Navbar />

      <section className={styles["hero-section"]} aria-label="Furute leadership event">
        <div className={styles["hero-overlay"]}>
          <h1>
            Passion Without
            <br />
            Priority Is Powerless...
          </h1>
        </div>
      </section>

      <section className={styles["proof-strip"]} aria-label="Furute highlights">
        <div>
          <span>8,000+</span>
          <p>entrepreneurs and professionals trained</p>
        </div>
        <div>
          <span>20 Years</span>
          <p>of business trend and market insight</p>
        </div>
        <div>
          <span>Pune</span>
          <p>based coaching with practical local relevance</p>
        </div>
      </section>

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

      <section className={styles["programs-overview"]} id="programs">
        <div className={styles["programs-overview-inner"]}>
          <p className={styles["section-eyebrow"]}>Programs And Services</p>
          <h2>Our Programs And Services Overview</h2>

          <div className={styles["program-grid"]}>
            {programs.map((program) => (
              <article
                className={cx("program-card", `program-card-${program.theme}`)}
                key={program.title}
                tabIndex={0}
              >
                <div className={styles["program-visual"]} aria-hidden="true">
                  <span className={styles["program-symbol"]}>
                    {initials(program.title)}
                  </span>
                </div>
                <h3>{program.title}</h3>
                <p>{program.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

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
            <a className={styles["mentor-cta"]} href="/invite">
              <span className={styles["mentor-cta-icon"]} aria-hidden="true">
                <MicIcon />
              </span>
              <span>Invite Me As A Speaker</span>
              <ArrowIcon className={styles["mentor-cta-arrow"]} />
            </a>
          </div>

          <figure
            className={cx(
              "mentor-portrait",
              mentorMissing && "mentor-portrait-missing",
            )}
            aria-label="Ashay Shah"
          >
            {!mentorMissing ? (
              <img
                src={mentorImage}
                alt="Ashay Shah"
                onError={() => setMentorMissing(true)}
              />
            ) : null}
            <div className={styles["mentor-portrait-fallback"]} aria-hidden="true">
              <span>AS</span>
            </div>
          </figure>
        </div>
      </section>

      <section className={styles["impact-stats-section"]} aria-label="Furute impact">
        <div className={styles["impact-stats-grid"]}>
          {impactStats.map((stat) => (
            <ImpactStat
              key={stat.label}
              value={stat.value}
              label={stat.label}
              icon={stat.icon}
            />
          ))}
        </div>
      </section>

      <section
        className={styles["testimonials-section"]}
        id="testimonials"
        aria-label="Client testimonials"
      >
        <div className={styles["testimonials-inner"]}>
          <div className={styles["testimonials-heading"]}>
            <p className={styles["section-eyebrow"]}>Testimonials</p>
            <h2>Stories from people who turned learning into growth.</h2>
          </div>

          <div className={styles["testimonials-grid"]}>
            {testimonials.map((testimonial) => (
              <article className={styles["testimonial-card"]} key={testimonial.name}>
                <span className={styles["testimonial-quote-mark"]} aria-hidden="true">
                  &quot;
                </span>
                <p className={styles["testimonial-review"]}>{testimonial.review}</p>
                <div className={styles["testimonial-author"]}>
                  <span className={styles["testimonial-avatar"]} aria-hidden="true">
                    {initials(testimonial.name)}
                  </span>
                  <div>
                    <h3>{testimonial.name}</h3>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles["video-section"]} id="events" aria-label="Featured videos">
        <div className={styles["video-section-inner"]}>
          <div className={styles["video-heading"]}>
            <p className={styles["section-eyebrow"]}>Featured Videos</p>
            <h2>Watch insights, talks, and learning moments from Furute.</h2>
          </div>

          <div className={styles["video-grid"]}>
            {featuredVideos.map((video) => (
              <button
                type="button"
                className={styles["video-card"]}
                key={video.videoId}
                onClick={() => setActiveVideo(video)}
                aria-label={`Play ${video.title}`}
              >
                <span className={styles["video-thumb-wrap"]}>
                  <img
                    src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                    alt=""
                    loading="lazy"
                  />
                  <span className={styles["video-play"]} aria-hidden="true">
                    <PlayIcon />
                  </span>
                </span>
                <span className={styles["video-card-content"]}>
                  <span>{video.label}</span>
                  <strong>{video.title}</strong>
                </span>
              </button>
            ))}
          </div>

          <div className={styles["video-more-action"]}>
            <a
              href="https://www.youtube.com/ashayshah"
              target="_blank"
              rel="noreferrer"
            >
              View More Testimonials
            </a>
          </div>
        </div>
      </section>

      <SiteFooter backTo="#home" />

      {activeVideo ? (
        <div
          className={styles["video-modal"]}
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.title}
        >
          <button
            type="button"
            className={styles["video-modal-backdrop"]}
            aria-label="Close video"
            onClick={() => setActiveVideo(null)}
          />
          <div className={styles["video-modal-panel"]}>
            <div className={styles["video-modal-header"]}>
              <div>
                <span>{activeVideo.label}</span>
                <h2>{activeVideo.title}</h2>
              </div>
              <button
                type="button"
                className={styles["video-modal-close"]}
                aria-label="Close video"
                onClick={() => setActiveVideo(null)}
              >
                <CloseIcon />
              </button>
            </div>
            <div className={styles["video-embed-wrap"]}>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.videoId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
