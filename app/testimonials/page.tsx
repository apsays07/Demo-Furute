import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import SiteFooter from "@/components/layout/SiteFooter";
import TestimonialCard from "@/components/shared/TestimonialCard";
import styles from "./testimonials.module.css";
import { connectToDatabase } from "@/lib/mongodb";
import TestimonialModel from "@/models/Testimonial";
import { testimonials as staticTestimonials } from "@/lib/testimonials";

interface DBTestimonial {
  _id: string;
  name: string;
  designation: string;
  company: string;
  review: string;
  image?: string;
  rating: number;
  featured: boolean;
  visible: boolean;
}

// Fetch testimonials DIRECTLY from MongoDB — no API round-trip needed
async function getTestimonials(): Promise<DBTestimonial[]> {
  try {
    await connectToDatabase();
    const docs = await TestimonialModel.find({ visible: true })
      .sort({ featured: -1, createdAt: -1 })
      .limit(100)
      .lean();
    // lean() returns plain objects — cast to our type
    return docs as unknown as DBTestimonial[];
  } catch (err) {
    console.error("Failed to load testimonials:", err);
    return [];
  }
}

export const revalidate = 60; // Re-fetch from DB every 60 seconds

export default async function TestimonialsPage() {
  const dbTestimonials = await getTestimonials();
  
  const testimonials = dbTestimonials.length > 0
    ? dbTestimonials
    : staticTestimonials.map((t, idx) => ({
        _id: `static-${idx}`,
        name: t.name,
        designation: t.role,
        company: "",
        review: t.review,
        rating: 5,
        featured: false,
        visible: true,
        image: undefined as string | undefined,
      }));

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles["testimonials-section"]}>
        <div className={styles["testimonials-inner"]}>
          <header className={styles["testimonials-heading"]}>
            <span className={styles["section-eyebrow"]}>Testimonials</span>
            <h1>Success Stories</h1>
            <p>
              Discover how insights, priority planning, and growth mindset
              transformed businesses and personal trajectories.
            </p>
            {testimonials.length > 0 && (
              <p className={styles["testimonial-count"]}>
                {testimonials.length} reviews from our community
              </p>
            )}
          </header>

          {testimonials.length > 0 ? (
            <div className={styles["testimonials-grid"]}>
              {testimonials.map((testimonial, idx) => {
                const accent =
                  idx % 3 === 1 ? "gold" : idx % 3 === 2 ? "blue" : "teal";
                return (
                  <TestimonialCard
                    key={String(testimonial._id)}
                    name={testimonial.name}
                    role={testimonial.designation}
                    company={testimonial.company}
                    review={testimonial.review}
                    image={testimonial.image}
                    rating={testimonial.rating}
                    accent={accent}
                  />
                );
              })}
            </div>
          ) : (
            <div className={styles["no-testimonials"]}>
              <p>No testimonials found.</p>
            </div>
          )}

          <div className={styles["back-to-home"]}>
            <Link href="/" className={styles["back-btn"]}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter backTo="#home" />
    </div>
  );
}
