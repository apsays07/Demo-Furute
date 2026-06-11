"use client";

import { useState } from "react";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import styles from "./invite.module.css";

// -------------------------------------------------------------
// TYPES & DATA DEFINITIONS
// -------------------------------------------------------------

type Video = {
  title: string;
  videoId: string;
};

type IconProps = {
  className?: string;
};

const topics = [
  {
    title: "Passion Without Priority Is Powerless",
    text: "A practical keynote on focus, discipline, and converting ambition into daily execution.",
    icon: TargetIcon,
  },
  {
    title: "Leadership, Ownership, And Team Accountability",
    text: "For teams that need stronger communication, decision-making, and responsibility at every level.",
    icon: UsersIcon,
  },
  {
    title: "Business Clarity In A Changing Market",
    text: "A grounded session for entrepreneurs and professionals who need sharper direction and growth thinking.",
    icon: TrendingUpIcon,
  },
  {
    title: "Mindset, Confidence, And Breakthrough",
    text: "A motivating but practical talk on emotional maturity, self-belief, and moving beyond stuck points.",
    icon: ZapIcon,
  },
];

const videos: Video[] = [
  {
    title: "Speaking Session",
    videoId: "BCkejLzRk_Y",
  },
  {
    title: "Audience Interaction",
    videoId: "ZEZiYQJClzw",
  },
  {
    title: "Mentoring Insight",
    videoId: "wM1VmwrR_Vg",
  },
];

export default function InviteSpeakerPage() {
  // 1. FORM STATE MANAGEMENT
  const [formData, setFormData] = useState({
    fullName: "",
    organization: "",
    email: "",
    phone: "",
    eventName: "",
    eventDate: "",
    eventLocation: "",
    audienceSize: "",
    eventFormat: "In-person",
    brief: "",
  });

  // 2. ADDITIONAL STATE FOR DATABASE INTEGRATION
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Snapshot of submitted data to render in the success screen after form resets
  const [successData, setSuccessData] = useState({
    fullName: "",
    eventName: "",
    email: "",
  });

  const [imageMissing, setImageMissing] = useState(false);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  // Helper to update state fields on input change
  const updateField = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  // 3. ASYNC HANDLESUBMIT FOR DATABASE CONNECTION
  const submitInquiry = async (event: React.FormEvent) => {
    event.preventDefault();

    // Print "FORM SUBMITTED" first thing in handleSubmit (submitInquiry)
    console.log("FORM SUBMITTED");

    setIsLoading(true);
    setError(null);

    try {
      // POST the full form data to the MongoDB API route
      const response = await fetch("/api/speaker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit speaker invitation.");
      }

      // Record a snapshot of the submitted data for the success message screen
      setSuccessData({
        fullName: formData.fullName,
        eventName: formData.eventName,
        email: formData.email,
      });

      // Show success screen
      setSubmitted(true);

      // RESET FORM after successful submission
      setFormData({
        fullName: "",
        organization: "",
        email: "",
        phone: "",
        eventName: "",
        eventDate: "",
        eventLocation: "",
        audienceSize: "",
        eventFormat: "In-person",
        brief: "",
      });
    } catch (err: unknown) {
      console.error("Submission failed:", err);
      const errMsg = err instanceof Error ? err.message : "Something went wrong. Please check your connection.";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      {/* Visual Ambient Background Elements */}
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />
      <div className={styles.blob3} aria-hidden="true" />

      <header className={styles.header}>
        <Link href="/" className={styles.logo} aria-label="Go to Furute home">
          <img src="/furute-logo.png" alt="Furute" />
        </Link>

        <nav className={styles.nav} aria-label="Invite page navigation">
          <Link href="/">Home</Link>
          <a href="#topics">Topics</a>
          <a href="#videos">Videos</a>
          <a href="#invite-form">Invite Now</a>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles["hero-copy"]}>
          <Link href="/" className={styles["back-link"]}>
            <ArrowLeftIcon />
            Back to home
          </Link>

          <p className={styles.eyebrow}>Invite Ashay Shah</p>
          <h1>Invite Ashay Shah as a speaker.</h1>
          <p className={styles.lead}>
            Practical talks for business owners, leadership teams, students,
            and growth-focused audiences.
          </p>

          <div className={styles["hero-actions"]}>
            <a className={styles["primary-btn"]} href="#invite-form">
              Invite Ashay As A Speaker
              <ArrowRightIcon />
            </a>
          </div>
        </div>

        <aside className={styles["speaker-card"]} aria-label="Ashay Shah profile">
          <div className={styles["portrait-wrap"]}>
            {!imageMissing ? (
              <img
                src="/ashay-shah.png"
                alt="Ashay Shah"
                onError={() => setImageMissing(true)}
              />
            ) : (
              <span>AS</span>
            )}
          </div>
          <div className={styles["speaker-meta"]}>
            <span>Founder, Furute</span>
            <h2>Ashay Shah</h2>
            <p>Business Mentor | Life Coach | Keynote Speaker</p>
          </div>
        </aside>
      </section>

      <section className={styles.topics} id="topics">
        <SectionHeading
          eyebrow="Speaking Topics"
          title="Keynote and workshop themes"
          text="Focused sessions on clarity, leadership, business growth, and mindset."
        />

        <div className={styles["topics-grid"]}>
          {topics.map((topic) => (
            <article className={styles["topic-card"]} key={topic.title}>
              <div className={styles["topic-icon-wrap"]} aria-hidden="true">
                <topic.icon />
              </div>
              <h3>{topic.title}</h3>
              <p>{topic.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.videos} id="videos">
        <SectionHeading
          eyebrow="Watch Ashay Speak"
          title="Speaking moments from real sessions"
          text="A quick preview of Ashay Shah's presence, delivery, and audience connection."
        />

        <div className={styles["video-grid"]}>
          {videos.map((video) => (
            <button
              type="button"
              className={styles["video-card"]}
              key={video.videoId}
              onClick={() => setActiveVideo(video)}
              aria-label={`Play ${video.title}`}
            >
              <span className={styles["video-frame"]}>
                <img
                  src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                  alt=""
                  loading="lazy"
                />
                <span className={styles["play-badge"]} aria-hidden="true">
                  <PlayIcon />
                </span>
              </span>
              <h3>{video.title}</h3>
            </button>
          ))}
        </div>
      </section>

      <section className={styles["form-section"]} id="invite-form">
        <div className={styles["form-aside"]}>
          <p className={styles.eyebrow}>Speaker Inquiry</p>
          <h2>Send your invitation details.</h2>
          <p>
            Share the event context and the Furute team will respond with the
            next steps.
          </p>

          <div className={styles["contact-card"]}>
            <span>Prefer direct contact?</span>
            <a href="mailto:info@furute.in">info@furute.in</a>
            <a href="tel:+919822600521">9822600521</a>
          </div>
        </div>

        <div className={styles["form-card"]}>
          {/* Error Message Display */}
          {error && (
            <div
              style={{
                color: "#f87171",
                borderColor: "rgba(239, 68, 68, 0.2)",
                backgroundColor: "rgba(220, 38, 38, 0.15)",
                borderWidth: "1px",
                borderStyle: "solid",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "24px",
                fontSize: "14px",
                fontWeight: "500",
              }}
              role="alert"
            >
              <strong>Submission Error:</strong> {error}
            </div>
          )}

          {!submitted ? (
            <form onSubmit={submitInquiry}>
              <fieldset disabled={isLoading} style={{ border: "none", padding: 0, margin: 0 }}>
                <legend style={{ display: "none" }}>Event Information</legend>
                <div className={styles["form-grid"]}>
                  <FormInput
                    label="Event Name"
                    name="eventName"
                    value={formData.eventName}
                    onChange={updateField}
                    placeholder="Annual leadership summit"
                    required
                    icon={TargetIcon}
                  />
                  <FormInput
                    label="Event Date"
                    name="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={updateField}
                    required
                    icon={CalendarIcon}
                  />
                  <FormInput
                    label="Location / Venue"
                    name="eventLocation"
                    value={formData.eventLocation}
                    onChange={updateField}
                    placeholder="Pune, Maharashtra or virtual"
                    required
                    icon={MapPinIcon}
                  />
                  <FormInput
                    label="Expected Audience"
                    name="audienceSize"
                    type="number"
                    value={formData.audienceSize}
                    onChange={updateField}
                    placeholder="150"
                    icon={UsersIcon}
                  />
                </div>

                <div className={styles["field-group"]}>
                  <label>Event Format</label>
                  <div className={styles["segmented-control"]}>
                    {["In-person", "Virtual", "Hybrid"].map((format) => (
                      <button
                        type="button"
                        key={format}
                        className={cx(
                          styles.segment,
                          formData.eventFormat === format && styles.active
                        )}
                        onClick={() =>
                          setFormData((current) => ({
                            ...current,
                            eventFormat: format,
                          }))
                        }
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                </div>
              </fieldset>

              <fieldset disabled={isLoading} style={{ border: "none", padding: 0, marginTop: "24px" }}>
                <legend className={styles.legend}>Organizer Details</legend>
                <div className={styles["form-grid"]}>
                  <FormInput
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={updateField}
                    placeholder="Your name"
                    required
                    icon={UserIcon}
                  />
                  <FormInput
                    label="Organization"
                    name="organization"
                    value={formData.organization}
                    onChange={updateField}
                    placeholder="Company or institution"
                    required
                    icon={BuildingIcon}
                  />
                  <FormInput
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={updateField}
                    placeholder="name@example.com"
                    required
                    icon={MailIcon}
                  />
                  <FormInput
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={updateField}
                    placeholder="9822600521"
                    required
                    icon={PhoneIcon}
                  />
                </div>
              </fieldset>

              <fieldset disabled={isLoading} style={{ border: "none", padding: 0, marginTop: "24px" }}>
                <legend className={styles.legend}>Speaking Brief</legend>
                <div className={styles["field-group"]}>
                  <label htmlFor="brief">Audience context and objective</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon} style={{ top: "16px", transform: "none" }} aria-hidden="true">
                      <MessageSquareIcon />
                    </span>
                    <textarea
                      id="brief"
                      name="brief"
                      rows={5}
                      value={formData.brief}
                      onChange={updateField}
                      className={styles.textareaWithIcon}
                      placeholder="Tell us about the audience, event theme, session duration, and what outcome you want."
                    />
                  </div>
                </div>
              </fieldset>

              <button
                type="submit"
                className={styles["submit-btn"]}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className={styles["loader-spinner"]} aria-hidden="true" />
                ) : (
                  <>
                    Submit Inquiry
                    <ArrowRightIcon />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className={styles.success} role="alert">
              <div className={styles["success-icon-wrap"]} aria-hidden="true">
                <CheckIcon />
              </div>
              <h3>Inquiry submitted.</h3>
              <p>
                Thank you, <strong>{successData.fullName}</strong>. The Furute
                team will review your invitation for{" "}
                <strong>{successData.eventName}</strong> and contact you at{" "}
                <strong>{successData.email}</strong>.
              </p>
              <button
                type="button"
                className={styles["primary-btn"]}
                onClick={() => setSubmitted(false)}
              >
                Submit Another Inquiry
              </button>
            </div>
          )}
        </div>
      </section>

      <SiteFooter backTo="#" />

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
              <h2>{activeVideo.title}</h2>
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

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className={styles["section-heading"]}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function FormInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  icon: Icon,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  icon?: React.ComponentType<any>;
}) {
  return (
    <div className={styles["field-group"]}>
      <label htmlFor={name}>
        {label}
        {required ? " *" : ""}
      </label>
      <div className={styles.inputWrapper}>
        {Icon && (
          <span className={styles.inputIcon} aria-hidden="true">
            <Icon />
          </span>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          required={required}
          onChange={onChange}
          className={Icon ? styles.inputWithIcon : styles.input}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

function cx(...names: Array<string | false | undefined>) {
  return names.filter(Boolean).join(" ");
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

function ArrowLeftIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="m15 18-6-6 6-6" />
    </SvgIcon>
  );
}

function ArrowRightIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </SvgIcon>
  );
}

function PlayIcon(props: IconProps) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 5v14l11-7L8 5Z" />
    </svg>
  );
}

function CheckIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M20 6 9 17l-5-5" />
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

function TargetIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </SvgIcon>
  );
}

function UsersIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </SvgIcon>
  );
}

function TrendingUpIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </SvgIcon>
  );
}

function ZapIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </SvgIcon>
  );
}

function CalendarIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </SvgIcon>
  );
}

function MapPinIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </SvgIcon>
  );
}

function UserIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </SvgIcon>
  );
}

function BuildingIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="9" y1="22" x2="9" y2="16" />
      <line x1="15" y1="22" x2="15" y2="16" />
      <line x1="9" y1="16" x2="15" y2="16" />
      <path d="M8 6h2v2H8V6zm0 4h2v2H8v-2zm8-4h2v2h-2V6zm0 4h2v2h-2v-2z" />
    </SvgIcon>
  );
}

function MailIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </SvgIcon>
  );
}

function PhoneIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </SvgIcon>
  );
}

function MessageSquareIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </SvgIcon>
  );
}