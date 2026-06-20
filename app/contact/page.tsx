"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import SiteFooter from "@/components/layout/SiteFooter";
import FormInput from "@/components/ui/FormInput";
import FormTextarea from "@/components/ui/FormTextarea";
import FormSelect from "@/components/ui/FormSelect";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  ChevronDownIcon,
  FacebookIcon,
  XIcon,
  LinkedInIcon,
  YouTubeIcon,
  UserIcon,
  BuildingIcon,
  BookOpenIcon,
  MessageSquareIcon,
} from "@/components/ui/Icons";
import styles from "./contact.module.css";
import EmailLoginModal from "@/components/shared/EmailLoginModal";

// -------------------------------------------------------------
// TYPES & DATA DEFINITIONS
// -------------------------------------------------------------

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

const validSubjects = [
  "General Inquiry",
  "Business Mentoring",
  "Life Coaching",
  "Organization Training",
  "Branding & Consultancy",
  "Other",
];

function getInitialSubject(subjectParam: string | null) {
  if (!subjectParam) {
    return "General Inquiry";
  }

  const decodedSubject = decodeURIComponent(subjectParam);
  return validSubjects.includes(decodedSubject)
    ? decodedSubject
    : "General Inquiry";
}

// -------------------------------------------------------------
// FRAMER MOTION ANIMATION VARIANTS
// -------------------------------------------------------------

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }
  }
};

const loadingStepsList = [
  "Validating your inquiry details...",
  "Establishing secure server connection...",
  "Writing to database...",
  "Sending email notification to Ashay's team...",
];

function ContactForm() {
  const searchParams = useSearchParams();
  const subjectParam = searchParams.get("subject");
  const initialSubject = getInitialSubject(subjectParam);

  const [mounted, setMounted] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);

  // 1. FORM STATE MANAGEMENT
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    subject: initialSubject,
    message: "",
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
    email: "",
    subject: "",
  });

  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingStepsList.length - 1 ? prev + 1 : prev));
      }, 700);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

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
    setLoadingStep(0);
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
        email: verifiedEmail || "",
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

      {/* Unified Global Navbar */}
      <Navbar />

      {/* Back button and page intro */}
      <motion.section 
        className={styles.hero}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
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
      </motion.section>

      {/* Trust Stats Banner (Restored!) */}
      <motion.section 
        className={styles["trust-banner"]}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeInUp}
      >
        <div className={styles["trust-banner-inner"]}>
          <div className={styles["trust-stat"]}>
            <strong>8,000+</strong>
            <span>Leaders Trained</span>
          </div>
          <div className={styles["trust-stat"]}>
            <strong>20+ Years</strong>
            <span>Mentoring Experience</span>
          </div>
          <div className={styles["trust-stat"]}>
            <strong>Pune Hub</strong>
            <span>Swargate Office</span>
          </div>
          <div className={styles["trust-stat"]}>
            <strong>24 Hours</strong>
            <span>Inquiry Response</span>
          </div>
        </div>
      </motion.section>

      {/* 3-Column Quick Contact Grid */}
      <motion.section 
        className={styles["quick-contact-section"]}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
      >
        <div className={styles["quick-grid"]}>
          {/* Card: Email */}
          <motion.a 
            href="mailto:ashay@furute.in" 
            className={styles["quick-card"]}
            variants={fadeInUp}
          >
            <div className={styles["quick-icon-wrap"]} aria-hidden="true">
              <MailIcon />
            </div>
            <h3>Email Us</h3>
            <span className={styles["quick-value"]}>ashay@furute.in</span>
            <p>Send an inquiry anytime; we reply within 24 hours.</p>
          </motion.a>

          {/* Card: Phone */}
          <motion.a 
            href="tel:+919822600521" 
            className={styles["quick-card"]}
            variants={fadeInUp}
          >
            <div className={styles["quick-icon-wrap"]} aria-hidden="true">
              <PhoneIcon />
            </div>
            <h3>Call Us</h3>
            <span className={styles["quick-value"]}>+91 9822600521</span>
            <p>Mon - Sat: 10:00 AM - 7:00 PM IST</p>
          </motion.a>

          {/* Card: Address */}
          <motion.a 
            href="https://maps.google.com/?q=Mitra+Mandal+Colony+Swargate+Pune" 
            target="_blank" 
            rel="noreferrer" 
            className={styles["quick-card"]}
            variants={fadeInUp}
          >
            <div className={styles["quick-icon-wrap"]} aria-hidden="true">
              <MapPinIcon />
            </div>
            <h3>Visit Us</h3>
            <span className={styles["quick-value"]}>Swargate, Pune</span>
            <p>3rd Floor, Ujjivan Bank, Mitra Mandal Colony, Swargate</p>
          </motion.a>
        </div>
      </motion.section>

      {/* Balanced Split Section: Info/Map on Left, Form on Right */}
      <section className={styles["content-section"]}>
        {/* Left Column: Office Hours, Interactive Google Map & Social Links */}
        <motion.div 
          className={styles["interactive-column"]}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={slideInLeft}
        >
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
        </motion.div>

        {/* Right Column: Database-connected Glassmorphism Inquiry Form */}
        <motion.div 
          className={styles["form-container"]}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={slideInRight}
        >
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
                    <FormInput
                      label="Full Name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={updateField}
                      required
                      placeholder="e.g. Ashay Shah"
                      icon={UserIcon}
                      styles={styles}
                    />

                    <FormInput
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={updateField}
                      required
                      placeholder="e.g. name@example.com"
                      icon={MailIcon}
                      styles={styles}
                    />

                    <FormInput
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={updateField}
                      required
                      placeholder="e.g. 9822600521"
                      icon={PhoneIcon}
                      styles={styles}
                    />

                    <FormInput
                      label="Organization (Optional)"
                      name="organization"
                      value={formData.organization}
                      onChange={updateField}
                      placeholder="e.g. Company or Institution"
                      icon={BuildingIcon}
                      styles={styles}
                    />
                  </div>

                  <FormSelect
                    label="What are you looking for?"
                    name="subject"
                    value={formData.subject}
                    onChange={updateField}
                    required
                    options={validSubjects}
                    icon={BookOpenIcon}
                    styles={styles}
                    style={{ marginTop: "20px" }}
                  />

                  <FormTextarea
                    label="Your Message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={updateField}
                    required
                    placeholder="Tell us about what you want to achieve, how we can help, or any details about your organization."
                    icon={MessageSquareIcon}
                    styles={styles}
                    style={{ marginTop: "20px" }}
                  />

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
                      <strong>Detail Review</strong>
                      <span>Our operations team will review your requirement details.</span>
                    </div>
                  </div>
                  <div className={styles["success-timeline-item"]}>
                    <div className={styles["success-timeline-icon"]}>3</div>
                    <div className={styles["success-timeline-text"]}>
                      <strong>Discovery Call</strong>
                      <span>We will contact you via phone/email within 24 hours.</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles["success-btn"]}
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Process Section (Timeline Restored!) */}
      <motion.section 
        className={styles["process-section"]}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
      >
        <div className={styles["process-inner"]}>
          <p className={styles.eyebrow}>Our Process</p>
          <h2>What Happens Next?</h2>
          <p className={styles["process-lead"]}>
            Here is the step-by-step journey of how we connect, co-create your growth plan, and begin coaching.
          </p>

          <div className={styles["timeline-grid"]}>
            <motion.div className={styles["timeline-item"]} variants={fadeInUp}>
              <div className={styles["timeline-badge"]}>
                <span>1</span>
              </div>
              <div className={styles["timeline-content"]}>
                <h3>Submit Inquiry</h3>
                <p>Fill out the form with details on what coaching topics you are interested in.</p>
              </div>
            </motion.div>

            <motion.div className={styles["timeline-item"]} variants={fadeInUp}>
              <div className={styles["timeline-badge"]}>
                <span>2</span>
              </div>
              <div className={styles["timeline-content"]}>
                <h3>Discovery Call</h3>
                <p>We connect with you within 24 hours to schedule a brief discovery discussion.</p>
              </div>
            </motion.div>

            <motion.div className={styles["timeline-item"]} variants={fadeInUp}>
              <div className={styles["timeline-badge"]}>
                <span>3</span>
              </div>
              <div className={styles["timeline-content"]}>
                <h3>Tailored Roadmap</h3>
                <p>Get a customized plan or program recommendations aligned with your goals.</p>
              </div>
            </motion.div>

            <motion.div className={styles["timeline-item"]} variants={fadeInUp}>
              <div className={styles["timeline-badge"]}>
                <span>4</span>
              </div>
              <div className={styles["timeline-content"]}>
                <h3>Begin Mentoring</h3>
                <p>Start your coaching sessions with Ashay Shah and launch your path forward.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Modern interactive FAQ Accordion matching Home Page design elements */}
      <motion.section 
        className={styles["faq-section"]}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeInUp}
      >
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
      </motion.section>

      <SiteFooter backTo="/contact#" />
    </main>
    </>
  );
}

export default function ContactUsPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: "grid",
        placeItems: "center",
        minHeight: "100vh",
        background: "#f7fbff",
        color: "#101b35",
        fontFamily: "sans-serif"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "40px",
            height: "40px",
            border: "3px solid rgba(8, 127, 140, 0.2)",
            borderTopColor: "#087f8c",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px"
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ fontWeight: 600 }}>Loading inquiry form...</p>
        </div>
      </div>
    }>
      <ContactForm />
    </Suspense>
  );
}


