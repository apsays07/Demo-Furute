"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import styles from "./contact.module.css";

// -------------------------------------------------------------
// TYPES & DATA DEFINITIONS
// -------------------------------------------------------------

type IconProps = {
  className?: string;
};

const faqs = [
  {
    question: "Who is Ashay Shah?",
    answer:
      "Ashay Shah is the founder of Furute, a charismatic leader, life coach, and business mentor based in Pune. Over the last 20 years, he has guided more than 8,000 entrepreneurs and professionals, helping them find priority, clarity, and direction in their business and personal lives.",
  },
  {
    question: "What kind of training programs does Furute offer?",
    answer:
      "Furute offers a wide range of programs tailored for personal and business growth, including Insights (market & self-awareness), Organization Training, Goal Setting, Branding, Business Consultancy, Breakthrough coaching, Sarathi personal guidance, and experiential learning (Beyond The Classroom).",
  },
  {
    question: "Where are the in-person training sessions held?",
    answer:
      "Our main office and training hub is located at Swargate, Pune (3rd Floor, Ujjivan Small Finance Bank, Mitra Mandal Colony, Parvati, Pune, Maharashtra 411009). However, Ashay Shah is also invited to speak and host workshops globally.",
  },
  {
    question: "How can I book a one-on-one consultation?",
    answer:
      "You can book a private business mentoring or personal life coaching session by submitting the inquiry form on this page. Choose 'Business Mentoring' or 'Life Coaching' as your subject, and our team will get back to you with available slots and pricing within 24 hours.",
  },
  {
    question: "Are virtual or hybrid training options available?",
    answer:
      "Yes! While we highly recommend in-person mentoring for its deep impact, all our major programs, keynotes, and consulting sessions are available in virtual and hybrid formats to suit global teams and clients.",
  },
];

export default function ContactUsPage() {
  // 1. FORM STATE MANAGEMENT
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    subject: "General Inquiry",
    message: "",
  });

  // 2. ADDITIONAL STATE FOR DATABASE INTEGRATION
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Snapshot of submitted data to render in the success screen after form resets
  const [successData, setSuccessData] = useState({
    fullName: "",
    email: "",
    subject: "",
  });

  // FAQ state tracking
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Helper to update state fields on input change
  const updateField = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // 3. ASYNC HANDLESUBMIT FOR DATABASE CONNECTION
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    console.log("CONTACT FORM SUBMITTED");
    setIsLoading(true);
    setError(null);

    try {
      // POST the full form data to the MongoDB API route
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit inquiry.");
      }

      // Record a snapshot of the submitted data for the success message screen
      setSuccessData({
        fullName: formData.fullName,
        email: formData.email,
        subject: formData.subject,
      });

      // Show success screen
      setSubmitted(true);

      // RESET FORM after successful submission
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        organization: "",
        subject: "General Inquiry",
        message: "",
      });
    } catch (err: unknown) {
      console.error("Submission failed:", err);
      const errMsg =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please check your connection and try again.";
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

      {/* Unified Global Navbar */}
      <Navbar />

      {/* Back button and page intro */}
      <section className={styles.hero}>
        <div className={styles["hero-copy"]}>
          <Link href="/" className={styles["back-link"]}>
            <ArrowLeftIcon />
            Back to home
          </Link>

          <p className={styles.eyebrow}>Get In Touch</p>
          <h1>Let&apos;s build clearer direction together.</h1>
          <p className={styles.lead}>
            Have a question about our programs, or want to discuss coaching for
            yourself or your organization? Send us a message and our team will
            connect with you shortly.
          </p>
        </div>
      </section>

      {/* 3-Column Quick Contact Grid */}
      <section className={styles["quick-contact-section"]}>
        <div className={styles["quick-grid"]}>
          {/* Card: Email */}
          <a href="mailto:info@furute.in" className={styles["quick-card"]}>
            <div className={styles["quick-icon-wrap"]} aria-hidden="true">
              <MailIcon />
            </div>
            <h3>Email Us</h3>
            <span className={styles["quick-value"]}>info@furute.in</span>
            <p>Send an inquiry anytime; we reply within 24 hours.</p>
          </a>

          {/* Card: Phone */}
          <a href="tel:+919822600521" className={styles["quick-card"]}>
            <div className={styles["quick-icon-wrap"]} aria-hidden="true">
              <PhoneIcon />
            </div>
            <h3>Call Us</h3>
            <span className={styles["quick-value"]}>+91 9822600521</span>
            <p>Mon - Sat: 10:00 AM - 7:00 PM IST</p>
          </a>

          {/* Card: Address */}
          <a 
            href="https://maps.google.com/?q=Mitra+Mandal+Colony+Swargate+Pune" 
            target="_blank" 
            rel="noreferrer" 
            className={styles["quick-card"]}
          >
            <div className={styles["quick-icon-wrap"]} aria-hidden="true">
              <MapPinIcon />
            </div>
            <h3>Visit Us</h3>
            <span className={styles["quick-value"]}>Swargate, Pune</span>
            <p>3rd Floor, Ujjivan Bank, Mitra Mandal Colony, Swargate</p>
          </a>
        </div>
      </section>

      {/* Balanced Split Section: Form on Left, Maps/Social/Timings on Right */}
      <section className={styles["content-section"]}>
        {/* Left Column: Database-connected Glassmorphism Inquiry Form */}
        <div className={styles["form-container"]}>
          <div className={styles["form-card"]}>
            <div className={styles["form-header"]}>
              <h2>Send a Message</h2>
              <p>Fill out the form below and we will get back to you shortly.</p>
            </div>

            {/* Error Message Display */}
            {error && (
              <div className={styles["error-alert"]} role="alert">
                <strong>Submission Error:</strong> {error}
              </div>
            )}

            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <fieldset
                  disabled={isLoading}
                  style={{ border: "none", padding: 0, margin: 0 }}
                >
                  <legend style={{ display: "none" }}>Contact Form</legend>

                  <div className={styles["form-grid"]}>
                    <div className={styles["field-group"]}>
                      <label htmlFor="fullName">Full Name *</label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={updateField}
                        required
                        className={styles.input}
                        placeholder="e.g. Ashay Shah"
                      />
                    </div>

                    <div className={styles["field-group"]}>
                      <label htmlFor="email">Email Address *</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={updateField}
                        required
                        className={styles.input}
                        placeholder="e.g. name@example.com"
                      />
                    </div>

                    <div className={styles["field-group"]}>
                      <label htmlFor="phone">Phone Number *</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={updateField}
                        required
                        className={styles.input}
                        placeholder="e.g. 9822600521"
                      />
                    </div>

                    <div className={styles["field-group"]}>
                      <label htmlFor="organization">Organization (Optional)</label>
                      <input
                        id="organization"
                        name="organization"
                        type="text"
                        value={formData.organization}
                        onChange={updateField}
                        className={styles.input}
                        placeholder="e.g. Company or Institution"
                      />
                    </div>
                  </div>

                  <div className={styles["field-group"]} style={{ marginTop: "20px" }}>
                    <label htmlFor="subject">What are you looking for? *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={updateField}
                      required
                      className={styles.input}
                      style={{ appearance: "auto" }}
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Business Mentoring">Business Mentoring</option>
                      <option value="Life Coaching">Life Coaching</option>
                      <option value="Organization Training">
                        Organization Training
                      </option>
                      <option value="Branding & Consultancy">
                        Branding & Consultancy
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className={styles["field-group"]} style={{ marginTop: "20px" }}>
                    <label htmlFor="message">Your Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={updateField}
                      required
                      className={styles.input}
                      placeholder="Tell us about what you want to achieve, how we can help, or any details about your organization."
                    />
                  </div>

                  <button
                    type="submit"
                    className={styles["submit-btn"]}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className={styles["loader-spinner"]} aria-hidden="true" />
                    ) : (
                      <>
                        Send Message
                        <ArrowRightIcon />
                      </>
                    )}
                  </button>
                </fieldset>
              </form>
            ) : (
              <div className={styles.success} role="alert">
                <div className={styles["success-icon-wrap"]} aria-hidden="true">
                  <CheckIcon />
                </div>
                <h3>Message Submitted Successfully!</h3>
                <p>
                  Thank you, <strong>{successData.fullName}</strong>. Your inquiry
                  regarding <strong>{successData.subject}</strong> has been saved
                  to our database. We have sent a confirmation note to{" "}
                  <strong>{successData.email}</strong>, and our team will get back to
                  you within 24 hours.
                </p>

                <div className={styles["success-details"]}>
                  <div className={styles["success-details-row"]}>
                    <span>Submitted Name</span>
                    <span>{successData.fullName}</span>
                  </div>
                  <div className={styles["success-details-row"]}>
                    <span>Inquiry Subject</span>
                    <span>{successData.subject}</span>
                  </div>
                  <div className={styles["success-details-row"]}>
                    <span>Status</span>
                    <span style={{ color: "#31a475" }}>Recorded in Database</span>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles["success-btn"]}
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Office Hours, Interactive Google Map & Social Links */}
        <div className={styles["interactive-column"]}>
          
          {/* Card: Office Timings */}
          <div className={styles["info-card"]} style={{ padding: "20px 24px" }}>
            <div className={styles["info-icon-wrap"]} style={{ width: "44px", height: "44px" }} aria-hidden="true">
              <ClockIcon />
            </div>
            <div className={styles["info-details"]}>
              <h3 style={{ fontSize: "16px", marginBottom: "4px" }}>Office Timings</h3>
              <p className={styles["info-value"]} style={{ fontSize: "15px", marginBottom: "2px" }}>Monday - Saturday</p>
              <p className={styles["info-desc"]} style={{ fontSize: "13.5px", margin: 0 }}>10:00 AM - 7:00 PM IST (Sunday Closed)</p>
            </div>
          </div>

          {/* Social Profiles Quick Connect */}
          <div className={styles["social-card"]}>
            <h3>Connect with Ashay Shah</h3>
            <div className={styles["socials-grid"]} aria-label="Social connections">
              <a href="https://www.linkedin.com/company/furute-king-makers" target="_blank" rel="noreferrer" className={styles["social-link"]} aria-label="LinkedIn">
                <LinkedInIcon />
                <span>LinkedIn</span>
              </a>
              <a href="https://www.youtube.com/ashayshah" target="_blank" rel="noreferrer" className={styles["social-link"]} aria-label="YouTube">
                <YouTubeIcon />
                <span>YouTube</span>
              </a>
              <a href="https://www.facebook.com/furutein" target="_blank" rel="noreferrer" className={styles["social-link"]} aria-label="Facebook">
                <FacebookIcon />
                <span>Facebook</span>
              </a>
              <a href="https://x.com/Furutekingmaker" target="_blank" rel="noreferrer" className={styles["social-link"]} aria-label="X">
                <XIcon />
                <span>Twitter / X</span>
              </a>
            </div>
          </div>

          {/* Interactive Map Card */}
          <div className={styles["map-container-card"]}>
            <div className={styles["map-header"]}>
              <MapPinIcon className={styles["map-header-icon"]} />
              <div>
                <h4>Interactive Office Map</h4>
                <span>Mitra Mandal Colony, Parvati, Pune</span>
              </div>
            </div>
            <div className={styles["map-wrapper"]}>
              <iframe
                title="Furute Office Location Swargate Pune"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.7438183863486!2d73.85040187588365!3d18.495280270034458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c00fbf0c54c3%3A0xe54e6df060c5a2cd!2sMitra%20Mandal%20Colony%2C%20Parvati%20Paytha%2C%20Pune%2C%20Maharashtra%20411009!5e0!3m2!1sen!2sin!4v1716943802931!5m2!1sen!2sin"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className={styles["map-frame"]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Modern interactive FAQ Accordion matching Home Page design elements */}
      <section className={styles["faq-section"]}>
        <div className={styles["faq-inner"]}>
          <div className={styles["faq-heading"]}>
            <p className={styles.eyebrow}>FAQ</p>
            <h2>Frequently Asked Questions</h2>
            <p>
              Find immediate answers regarding Ashay Shah, mentoring programs,
              and working sessions.
            </p>
          </div>

          <div className={styles["faq-grid"]}>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`${styles["faq-item"]} ${
                  activeFaq === index ? styles["faq-active"] : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className={styles["faq-trigger"]}
                  aria-expanded={activeFaq === index ? "true" : "false"}
                >
                  <h3>{faq.question}</h3>
                  <span className={styles["faq-icon-wrap"]} aria-hidden="true">
                    <ChevronDownIcon />
                  </span>
                </button>
                <div className={styles["faq-content"]}>
                  <div className={styles["faq-content-inner"]}>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter backTo="/contact#" />
    </main>
  );
}

// -------------------------------------------------------------
// INLINE REUSABLE ICONS
// -------------------------------------------------------------

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

function CheckIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M20 6 9 17l-5-5" />
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

function MapPinIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </SvgIcon>
  );
}

function ClockIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </SvgIcon>
  );
}

function ChevronDownIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="m6 9 6 6 6-6" />
    </SvgIcon>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ width: "16px", height: "16px" }}>
      <path d="M14 8.8V7.2c0-.7.5-1.2 1.2-1.2H17V3h-2.6C11.7 3 10 4.7 10 7.4v1.4H7.5V12H10v9h3.5v-9h2.8l.5-3.2H14Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ width: "16px", height: "16px" }}>
      <path d="M13.7 10.7 20.3 3h-1.6L13 9.7 8.4 3H3l6.9 10.1L3 21h1.6l6-6.9 4.8 6.9H21l-7.3-10.3Zm-2.1 2.4-.7-1L5.3 4.2h2.3l4.5 6.4.7 1 5.9 8.3h-2.3l-4.8-6.8Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ width: "16px", height: "16px" }}>
      <path d="M6.7 8.8H3.4V21h3.3V8.8ZM5.1 3A1.9 1.9 0 1 0 5 6.8 1.9 1.9 0 0 0 5.1 3Zm8.4 5.8h-3.2V21h3.2v-6.4c0-1.7.8-2.7 2.1-2.7 1.2 0 1.8.9 1.8 2.7V21h3.2v-7.1c0-3.5-1.8-5.4-4.5-5.4-1.3 0-2.3.6-2.9 1.5h-.1l.4-1.2Z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ width: "16px", height: "16px" }}>
      <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5a3 3 0 0 0-2.1 2.1C2 9 2 12 2 12s0 3 .4 4.8a3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1C22 15 22 12 22 12s0-3-.4-4.8ZM10 15.4V8.6l5.8 3.4-5.8 3.4Z" />
    </svg>
  );
}
