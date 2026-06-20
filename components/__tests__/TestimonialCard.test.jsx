/* eslint-disable @next/next/no-img-element */
import React from "react";
import { render, screen } from "@testing-library/react";
import TestimonialCard from "../shared/TestimonialCard";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ priority, fill, unoptimized, fetchPriority, ...props }) => (
    <img {...props} alt={props.alt || ""} />
  ),
}));

// Mock initials util
jest.mock("@/lib/utils", () => ({
  initials: (name) => `INIT:${name}`,
}));

describe("TestimonialCard", () => {
  it("renders basic testimonial details with default teal accent", () => {
    const { container } = render(
      <TestimonialCard name="Alice" role="Developer" review="Great work!" />
    );

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Developer")).toBeInTheDocument();
    expect(screen.getByText("Great work!")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("accent-teal");
  });

  it("renders with gold accent", () => {
    const { container } = render(
      <TestimonialCard
        name="Alice"
        role="Developer"
        review="Great work!"
        accent="gold"
      />
    );
    expect(container.firstChild).toHaveClass("accent-gold");
  });

  it("renders with blue accent", () => {
    const { container } = render(
      <TestimonialCard
        name="Alice"
        role="Developer"
        review="Great work!"
        accent="blue"
      />
    );
    expect(container.firstChild).toHaveClass("accent-blue");
  });

  it("renders image if provided", () => {
    render(
      <TestimonialCard
        name="Alice"
        role="Developer"
        review="Great work!"
        image="/alice.png"
      />
    );

    const img = screen.getByAltText("Alice");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/alice.png");
  });

  it("renders initials when image is not provided", () => {
    render(
      <TestimonialCard
        name="Alice"
        role="Developer"
        review="Great work!"
      />
    );

    expect(screen.getByText("INIT:Alice")).toBeInTheDocument();
  });

  it("renders company when provided and it differs from role", () => {
    render(
      <TestimonialCard
        name="Alice"
        role="Developer"
        review="Great work!"
        company="Tech Corp"
      />
    );

    expect(screen.getByText("Developer · Tech Corp")).toBeInTheDocument();
  });

  it("does not render company when it matches role", () => {
    render(
      <TestimonialCard
        name="Alice"
        role="Developer"
        review="Great work!"
        company="Developer"
      />
    );

    expect(screen.getByText("Developer")).toBeInTheDocument();
    expect(screen.queryByText(/·/)).not.toBeInTheDocument();
  });
});
