import React from "react";
import { render, screen } from "@testing-library/react";
import TestimonialsSection from "../home/TestimonialsSection";

// Mock TestimonialCard
jest.mock("@/components/shared/TestimonialCard", () => (props) => (
  <div data-testid="testimonial-card">
    {props.name} - {props.role} - {props.review}
  </div>
));

describe("TestimonialsSection", () => {
  const mockTestimonials = [
    {
      _id: "1",
      name: "Alice",
      designation: "Developer",
      company: "Company A",
      review: "Excellent!",
      rating: 5,
    },
  ];

  it("renders mock testimonials when provided", () => {
    render(<TestimonialsSection testimonials={mockTestimonials} />);

    expect(screen.getByText("Stories from people who turned learning into growth.")).toBeInTheDocument();
    expect(screen.getByText("Alice - Developer - Excellent!")).toBeInTheDocument();
  });

  it("renders static fallback testimonials when testimonials array is empty", () => {
    render(<TestimonialsSection testimonials={[]} />);

    const cards = screen.getAllByTestId("testimonial-card");
    expect(cards.length).toBeGreaterThan(0);
  });
});
