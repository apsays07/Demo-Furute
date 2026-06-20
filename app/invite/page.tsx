"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SiteFooter from "@/components/layout/SiteFooter";
import VideoModal from "@/components/shared/VideoModal";
import { cn as cx } from "@/lib/utils";
import FormInput from "@/components/ui/FormInput";
import FormTextarea from "@/components/ui/FormTextarea";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PlayIcon,
  CheckIcon,
  TargetIcon,
  UsersIcon,
  TrendingUpIcon,
  ZapIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  BuildingIcon,
  MailIcon,
  PhoneIcon,
  MessageSquareIcon,
} from "@/components/ui/Icons";
import styles from "./invite.module.css";
import EmailLoginModal from "@/components/shared/EmailLoginModal";

// -------------------------------------------------------------
// TYPES & DATA DEFINITIONS
// -------------------------------------------------------------

type Video = {
  title: string;
  videoId: string;
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

const localInviteThumbnails: Record<string, string> = {
  "BCkejLzRk_Y": "/videos/invite-1.webp",
  "ZEZiYQJClzw": "/videos/invite-2.webp",
  "wM1VmwrR_Vg": "/videos/invite-3.webp",
};

const loadingStepsList = [
  "Checking Ashay's calendar availability...",
  "Validating event venue and date...",
  "Establishing secure server connection...",
  "Saving speaker invitation to database...",
  "Sending email notification to Ashay's office...",
];

export default function InviteSpeakerPage() {
  const [mounted, setMounted] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const savedEmail = localStorage.getItem("guest_verified_email");
    if (savedEmail) {
      setVerifiedEmail(savedEmail);
      setFormData((prev) => ({ ...prev, email: savedEmail }));
    }
  }, []);

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

  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingStepsList.length - 1 ? prev + 1 : prev));
      }, 600);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

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
    setLoadingStep(0);

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
        email: verifiedEmail || "",
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
    <>
      {mounted && !verifiedEmail && (
        <EmailLoginModal
          onSuccess={(email) => {
            setVerifiedEmail(email);
            setFormData((prev) => ({ ...prev, email }));
          }}
        />
      )}
      <main className={styles.page}>
      {/* Visual Ambient Background Elements */}
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />
      <div className={styles.blob3} aria-hidden="true" />

      <header className={styles.header}>
        <Link href="/" className={styles.logo} aria-label="Go to Furute home">
          <Image src="/lion-logo.png" alt="Furute" width={138} height={68} priority />
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
              <Image
                src="/ashay-shah.webp"
                alt="Ashay Shah"
                width={390}
                height={430}
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
                <Image
                  src={localInviteThumbnails[video.videoId] || "/videos/invite-1.webp"}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
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
            <a href="mailto:ashay@furute.in">ashay@furute.in</a>
            <a href="tel:+919822600521">9822600521</a>
          </div>

          {/* Stepper Timeline */}
          <div className={styles["stepper-timeline"]}>
            <div className={styles["step-item"]}>
              <div className={styles["step-number-wrap"]}>
                <span className={styles["step-number"]}>1</span>
                <div className={styles["step-line"]} />
              </div>
              <div className={styles["step-info"]}>
                <h4>Submit Request</h4>
                <p>Provide your event details in the form to check schedule compatibility.</p>
              </div>
            </div>
            <div className={styles["step-item"]}>
              <div className={styles["step-number-wrap"]}>
                <span className={styles["step-number"]}>2</span>
                <div className={styles["step-line"]} />
              </div>
              <div className={styles["step-info"]}>
                <h4>Review</h4>
                <p>Our team reviews details & contacts you for clarification.</p>
              </div>
            </div>
            <div className={styles["step-item"]}>
              <div className={styles["step-number-wrap"]}>
                <span className={styles["step-number"]}>3</span>
                <div className={styles["step-line"]} />
              </div>
              <div className={styles["step-info"]}>
                <h4>Meeting</h4>
                <p>A brief alignment call to finalize topic & session flow.</p>
              </div>
            </div>
            <div className={styles["step-item"]}>
              <div className={styles["step-number-wrap"]}>
                <span className={styles["step-number"]}>4</span>
              </div>
              <div className={styles["step-info"]}>
                <h4>Confirmation</h4>
                <p>Signed agreement & dates officially booked in Ashay&apos;s calendar.</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles["form-card"]}>
          {/* Glassmorphic Loading Overlay */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={styles["loading-overlay"]}
              >
                <div className={styles["loading-content"]}>
                  <div className={styles["loading-spinner-container"]}>
                    <div className={styles["pulse-ring"]} />
                    <div className={styles["pulse-ring-inner"]} />
                    <MailIcon className={styles["loading-icon"]} />
                  </div>
                  <h3 className={styles["loading-title"]}>Submitting inquiry...</h3>
                  <p className={styles["loading-message"]}>
                    {loadingStepsList[loadingStep]}
                  </p>
                  
                  <div className={styles["progress-bar"]}>
                    <motion.div
                      className={styles["progress-fill"]}
                      initial={{ width: "0%" }}
                      animate={{ width: `${((loadingStep + 1) / loadingStepsList.length) * 100}%` }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  </div>
                  
                  <div className={styles["loading-step-indicators"]}>
                    {loadingStepsList.map((_, index) => (
                      <div
                        key={index}
                        className={`${styles["step-dot"]} ${
                          index <= loadingStep ? styles["step-dot-active"] : ""
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
                    styles={styles}
                  />
                  <FormInput
                    label="Event Date"
                    name="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={updateField}
                    required
                    icon={CalendarIcon}
                    styles={styles}
                  />
                  <FormInput
                    label="Location / Venue"
                    name="eventLocation"
                    value={formData.eventLocation}
                    onChange={updateField}
                    placeholder="Pune, Maharashtra or virtual"
                    required
                    icon={MapPinIcon}
                    styles={styles}
                  />
                  <FormInput
                    label="Expected Audience"
                    name="audienceSize"
                    type="number"
                    value={formData.audienceSize}
                    onChange={updateField}
                    placeholder="150"
                    icon={UsersIcon}
                    styles={styles}
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
                    styles={styles}
                  />
                  <FormInput
                    label="Organization"
                    name="organization"
                    value={formData.organization}
                    onChange={updateField}
                    placeholder="Company or institution"
                    required
                    icon={BuildingIcon}
                    styles={styles}
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
                    styles={styles}
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
                    styles={styles}
                  />
                </div>
              </fieldset>

              <fieldset disabled={isLoading} style={{ border: "none", padding: 0, marginTop: "24px" }}>
                <legend className={styles.legend}>Speaking Brief</legend>
                <FormTextarea
                  label="Audience context and objective"
                  name="brief"
                  rows={5}
                  value={formData.brief}
                  onChange={updateField}
                  placeholder="Tell us about the audience, event theme, session duration, and what outcome you want."
                  icon={MessageSquareIcon}
                  styles={styles}
                />
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
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={styles.success}
              role="alert"
            >
              <div className={styles["success-icon-wrap"]} aria-hidden="true">
                <CheckIcon />
              </div>
              <h3>Inquiry Submitted Successfully!</h3>
              <p>
                Thank you, <strong>{successData.fullName}</strong>. The Furute
                team will review your speaking invitation for{" "}
                <strong>{successData.eventName}</strong> and contact you at{" "}
                <strong>{successData.email}</strong> shortly.
              </p>

              <div className={styles["success-details"]}>
                <div className={styles["success-details-row"]}>
                  <span>Event Name</span>
                  <span>{successData.eventName}</span>
                </div>
                <div className={styles["success-details-row"]}>
                  <span>Organizer</span>
                  <span>{successData.fullName}</span>
                </div>
                <div className={styles["success-details-row"]}>
                  <span>Status</span>
                  <span style={{ color: "#087f8c" }}>Recorded in Database</span>
                </div>
              </div>

              <div className={styles["success-timeline"]}>
                <h4>What happens next?</h4>
                <div className={styles["success-timeline-item"]}>
                  <div className={styles["success-timeline-icon"]}>1</div>
                  <div className={styles["success-timeline-text"]}>
                    <strong>Confirmation Sent</strong>
                    <span>A verification email has been delivered to {successData.email}.</span>
                  </div>
                </div>
                <div className={styles["success-timeline-item"]}>
                  <div className={styles["success-timeline-icon"]}>2</div>
                  <div className={styles["success-timeline-text"]}>
                    <strong>Calendar Check</strong>
                    <span>Ashay&apos;s team verifies schedule feasibility for the date.</span>
                  </div>
                </div>
                <div className={styles["success-timeline-item"]}>
                  <div className={styles["success-timeline-icon"]}>3</div>
                  <div className={styles["success-timeline-text"]}>
                    <strong>Speaking Proposal</strong>
                    <span>We will send a speaker proposal & quotation within 24-48 hours.</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className={styles["primary-btn"]}
                style={{ border: "none", cursor: "pointer" }}
                onClick={() => setSubmitted(false)}
              >
                Submit Another Inquiry
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <SiteFooter backTo="#" />

      {activeVideo ? (
        <VideoModal
          video={activeVideo}
          onClose={() => setActiveVideo(null)}
          styles={styles}
        />
      ) : null}
    </main>
    </>
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