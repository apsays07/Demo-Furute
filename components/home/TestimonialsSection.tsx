import Link from "next/link";
import TestimonialCard from "@/components/shared/TestimonialCard";
import { testimonials as staticTestimonials } from "@/lib/testimonials";
import { DBTestimonial } from "@/lib/home";
import styles from "./TestimonialsSection.module.css";

interface TestimonialsSectionProps {
  testimonials: DBTestimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const testimonialsList = testimonials.length > 0
    ? testimonials
    : staticTestimonials.slice(0, 6).map((t) => ({
        _id: t.name,
        name: t.name,
        designation: t.role,
        company: "",
        review: t.review,
        rating: 5,
        image: undefined,
      }));

  return (
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
          {testimonialsList.map((testimonial, idx) => {
            const accent = idx % 3 === 1 ? "gold" : idx % 3 === 2 ? "blue" : "teal";
            return (
              <TestimonialCard
                key={testimonial._id}
                name={testimonial.name}
                role={testimonial.designation}
                company={testimonial.company}
                review={testimonial.review}
                image={testimonial.image ?? undefined}
                rating={testimonial.rating}
                accent={accent}
              />
            );
          })}
        </div>

        <div className={styles["testimonials-toggle"]}>
          <Link
            href="/testimonials"
            className={styles["testimonials-toggle-btn"]}
          >
            Show All Reviews
          </Link>
        </div>
      </div>
    </section>
  );
}
