"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import SiteFooter from "@/components/layout/SiteFooter";
import VideoModal from "@/components/shared/VideoModal";
import TestimonialCard from "@/components/shared/TestimonialCard";
import ProgramCard from "@/components/shared/ProgramCard";
import VideoCard from "@/components/shared/VideoCard";

import { testimonials as staticTestimonials } from "@/lib/testimonials";
import {
  ChartIcon,
  BasketIcon,
  MapIcon,
  TagIcon,
  MicIcon,
  ArrowRightIcon as ArrowIcon,
} from "@/components/ui/Icons";
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

const mentorImage = "/ashay-shah.webp";

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


function cx(...names: Array<string | false | undefined>) {
  return names
    .filter(Boolean)
    .map((name) => styles[name as string])
    .join(" ");
}

function ImpactStat({
  value,
  label,
  icon: Icon,
}: {
  value: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
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

const localThumbnails: Record<string, string> = {
  "i-Qe4F17hKc": "/videos/video-1.webp",
  "Dp65MGhze3I": "/videos/video-2.webp",
  "2ofM34EwKJo": "/videos/video-3.webp",
  "S9fjt9HVf6Q": "/videos/video-4.webp",
};

interface DBTestimonial {
  _id: string;
  name: string;
  designation: string;
  company: string;
  review: string;
  image?: string;
  rating: number;
}

interface DBVideo {
  _id: string;
  title: string;
  youtubeUrl: string;
  thumbnail?: string;
  featured: boolean;
  visible: boolean;
}

export default function Home() {
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [mentorMissing, setMentorMissing] = useState(false);
  const [dbTestimonials, setDbTestimonials] = useState<DBTestimonial[]>([]);
  const [testimonialsLoaded, setTestimonialsLoaded] = useState(false);
  const [dbVideos, setDbVideos] = useState<DBVideo[]>([]);

  // Fetch testimonials (prioritizing featured, backfilling up to 6)
  useEffect(() => {
    fetch("/api/testimonials?limit=6")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.length > 0) {
          setDbTestimonials(json.data);
        }
      })
      .catch(() => {})
      .finally(() => setTestimonialsLoaded(true));
  }, []);

  // Fetch featured videos from DB (up to 4 — newest first)
  useEffect(() => {
    fetch("/api/videos?featured=true&limit=4")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.length > 0) setDbVideos(json.data);
      })
      .catch(() => {});
  }, []);

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

      <section id="programs" className={styles["programs-overview"]} aria-label="Programs And Services">
        <div className={styles["programs-overview-inner"]}>
          <p className={styles["section-eyebrow"]}>Programs And Services</p>
          <h2>Our Programs And Services Overview</h2>

          <div className={styles["program-grid"]}>
            {programs.map((program) => (
              <ProgramCard
                key={program.title}
                title={program.title}
                text={program.text}
                theme={program.theme}
              />
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
              <Image
                src={mentorImage}
                alt="Ashay Shah"
                width={390}
                height={430}
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
        id="testimonials"
        className={styles["testimonials-section"]}
        aria-label="Client testimonials"
      >
        <div className={styles["testimonials-inner"]}>
          <div className={styles["testimonials-heading"]}>
            <p className={styles["section-eyebrow"]}>Testimonials</p>
            <h2>Stories from people who turned learning into growth.</h2>
          </div>

          <div className={styles["testimonials-grid"]}>
            {(dbTestimonials.length > 0
              ? dbTestimonials
              : testimonialsLoaded
                ? staticTestimonials.slice(0, 6).map((t) => ({
                    _id: t.name,
                    name: t.name,
                    designation: t.role,
                    company: "",
                    review: t.review,
                    rating: 5,
                  }))
                : staticTestimonials.slice(0, 6).map((t) => ({
                    _id: t.name,
                    name: t.name,
                    designation: t.role,
                    company: "",
                    review: t.review,
                    rating: 5,
                  }))
            ).map((testimonial, idx) => {
              const accent = idx % 3 === 1 ? "gold" : idx % 3 === 2 ? "blue" : "teal";
              return (
                <TestimonialCard
                  key={testimonial._id}
                  name={testimonial.name}
                  role={testimonial.designation}
                  company={testimonial.company}
                  review={testimonial.review}
                  image={(testimonial as DBTestimonial).image}
                  rating={testimonial.rating}
                  accent={accent}
                />
              );
            })}
          </div>

          <div className={styles["testimonials-toggle"]}>
            <a
              href="/testimonials"
              className={styles["testimonials-toggle-btn"]}
            >
              Show All Reviews
            </a>
          </div>
        </div>
      </section>

      <section id="events" className={styles["video-section"]} aria-label="Featured videos">
        <div className={styles["video-section-inner"]}>
          <div className={styles["video-heading"]}>
            <p className={styles["section-eyebrow"]}>Featured Videos</p>
            <h2>Watch insights, talks, and learning moments from Furute.</h2>
          </div>

          <div className={styles["video-grid"]}>
            {(() => {
              const list: { videoId: string; title: string; label: string; thumbnail: string }[] = [];
              const addedIds = new Set<string>();

              // 1. Add DB videos (newest first, already sorted by DB)
              for (const v of dbVideos) {
                const videoId = v.youtubeUrl.match(
                  /(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/
                )?.[1] ?? v.youtubeUrl;
                if (videoId && !addedIds.has(videoId)) {
                  addedIds.add(videoId);
                  list.push({
                    videoId,
                    title: v.title,
                    label: v.title,
                    thumbnail: v.thumbnail || localThumbnails[videoId] || "/videos/video-1.webp",
                  });
                }
              }

              // 2. Backfill from static featuredVideos to always display exactly 4 videos
              if (list.length < 4) {
                for (const fv of featuredVideos) {
                  if (list.length >= 4) break;
                  if (!addedIds.has(fv.videoId)) {
                    addedIds.add(fv.videoId);
                    list.push({
                      videoId: fv.videoId,
                      title: fv.title,
                      label: fv.label,
                      thumbnail: localThumbnails[fv.videoId] || "/videos/video-1.webp",
                    });
                  }
                }
              }

              // Slice to guarantee exactly 4 videos
              return list.slice(0, 4);
            })().map((video) => (
              <VideoCard
                key={video.videoId}
                title={video.title}
                label={video.label}
                videoId={video.videoId}
                thumbnail={video.thumbnail}
                onClick={() => setActiveVideo(video)}
              />
            ))}
          </div>

          <div className={styles["video-more-action"]}>
            <a
              href="https://www.youtube.com/@ashayshah"
              target="_blank"
              rel="noreferrer"
            >
              View More Videos
            </a>
          </div>
        </div>
      </section>

      <SiteFooter backTo="#home" />

      {activeVideo ? (
        <VideoModal
          video={activeVideo}
          onClose={() => setActiveVideo(null)}
          styles={styles}
        />
      ) : null}
    </main>
  );
}
