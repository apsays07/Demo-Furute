/* eslint-disable @next/next/no-img-element */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../layout/Navbar";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ priority, fill, unoptimized, fetchPriority, ...props }) => (
    <img {...props} alt={props.alt || ""} />
  ),
}));

// Mock next/link
jest.mock("next/link", () => {
  return ({ children, href, onClick, className }) => (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  );
});

describe("Navbar Interaction Tests", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1200,
    });
  });

  afterEach(() => {
    window.history.pushState({}, "", "/");
  });

  test("renders logo", () => {
    render(<Navbar />);

    expect(screen.getByAltText("Furute Logo")).toBeInTheDocument();
  });

  test("renders main navigation items", () => {
    render(<Navbar />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About Us")).toBeInTheDocument();
    expect(screen.getByText("Programs")).toBeInTheDocument();
    expect(screen.getByText("Services")).toBeInTheDocument();
    expect(screen.getByText("Events")).toBeInTheDocument();
    expect(screen.getByText("Blog")).toBeInTheDocument();
    expect(screen.getByText("Testimonials")).toBeInTheDocument();
    expect(screen.getByText("Contact Us")).toBeInTheDocument();
  });

  test("renders hamburger button", () => {
    render(<Navbar />);

    expect(
      screen.getByLabelText("Toggle navigation menu")
    ).toBeInTheDocument();
  });

  test("opens mobile menu", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 500,
    });

    render(<Navbar />);

    const button = screen.getByLabelText("Toggle navigation menu");

    fireEvent.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  test("closes mobile menu", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 500,
    });

    render(<Navbar />);

    const button = screen.getByLabelText("Toggle navigation menu");

    fireEvent.click(button);
    fireEvent.click(button);

    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  test("clicks Contact Us link", () => {
    render(<Navbar />);

    fireEvent.click(screen.getByText("Contact Us"));

    expect(screen.getByText("Contact Us")).toBeInTheDocument();
  });

  test("clicks About Us link", () => {
    render(<Navbar />);

    fireEvent.click(screen.getByText("About Us"));

    expect(screen.getByText("About Us")).toBeInTheDocument();
  });

  test("clicks Blog link", () => {
    render(<Navbar />);

    fireEvent.click(screen.getByText("Blog"));

    expect(screen.getByText("Blog")).toBeInTheDocument();
  });

  test("renders Programs dropdown items", () => {
    render(<Navbar />);

    expect(screen.getByText("Training Programs")).toBeInTheDocument();
    expect(screen.getByText("Relationship Tourism")).toBeInTheDocument();
  });

  test("renders Services dropdown items", () => {
    render(<Navbar />);

    expect(screen.getByText("Branding")).toBeInTheDocument();
    expect(screen.getByText("Mentoring")).toBeInTheDocument();
    expect(screen.getByText("Consultancy")).toBeInTheDocument();
    expect(screen.getByText("Digital Marketing")).toBeInTheDocument();
  });

  test("updates active item based on window.location.pathname on mount", () => {
    const paths = [
      { path: "/contact", expected: "Contact Us" },
      { path: "/about", expected: "About Us" },
      { path: "/programs/training", expected: "Programs" },
      { path: "/services/branding", expected: "Services" },
      { path: "/events/insights", expected: "Events" },
      { path: "/testimonials", expected: "Testimonials" },
      { path: "/blog/post-slug", expected: "Blog" }
    ];

    paths.forEach(({ path, expected }) => {
      window.history.pushState({}, "", path);
      
      const { unmount } = render(<Navbar />);
      
      const activeLink = screen.getByText(expected);
      expect(activeLink).toHaveClass("active");
      
      unmount();
    });
  });

  test("updates active item based on window.location.hash on mount and hashchange event", () => {
    window.history.pushState({}, "", "/#contact-us");
    
    const { unmount } = render(<Navbar />);
    expect(screen.getByText("Contact Us")).toHaveClass("active");
    unmount();

    // Test hashchange listener
    window.history.pushState({}, "", "/#about-us");
    render(<Navbar />);
    expect(screen.getByText("About Us")).toHaveClass("active");

    window.location.hash = "#blog";
    fireEvent(window, new Event("hashchange"));
    expect(screen.getByText("Blog")).toHaveClass("active");
  });

  test("does not change active item on mount with invalid hash", () => {
    window.history.pushState({}, "", "/#non-existent-hash");
    render(<Navbar />);
    expect(screen.getByText("Home")).toHaveClass("active");
  });

  test("handles mobile clicks on Programs and Services dropdown toggles", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 500,
    });

    render(<Navbar />);

    const programsTrigger = screen.getByRole("link", { name: "Programs" });
    expect(programsTrigger).not.toHaveClass("expanded");

    fireEvent.click(programsTrigger);
    expect(programsTrigger).toHaveClass("expanded");

    const servicesTrigger = screen.getByRole("link", { name: "Services" });
    expect(servicesTrigger).not.toHaveClass("expanded");

    fireEvent.click(servicesTrigger);
    expect(servicesTrigger).toHaveClass("expanded");

    const trainingSubcatTrigger = screen.getByText("Training Programs");
    expect(trainingSubcatTrigger).not.toHaveClass("expanded");

    fireEvent.click(trainingSubcatTrigger);
    expect(trainingSubcatTrigger).toHaveClass("expanded");

    fireEvent.click(trainingSubcatTrigger);
    expect(trainingSubcatTrigger).not.toHaveClass("expanded");
  });

  test("clicking submenu links closes mobile menu", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 500,
    });

    render(<Navbar />);

    const hamburger = screen.getByLabelText("Toggle navigation menu");
    fireEvent.click(hamburger);
    expect(hamburger).toHaveAttribute("aria-expanded", "true");

    const relTourismLink = screen.getByText("Relationship Tourism");
    fireEvent.click(relTourismLink);
    expect(hamburger).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(hamburger);
    
    const insightsLink = screen.getByText("Insights");
    fireEvent.click(insightsLink);
    expect(hamburger).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(hamburger);

    const brandingLink = screen.getByText("Branding");
    fireEvent.click(brandingLink);
    expect(hamburger).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(hamburger);

    const eventsLink = screen.getByRole("link", { name: "Events" });
    fireEvent.click(eventsLink);
    expect(hamburger).toHaveAttribute("aria-expanded", "false");
  });

  test("handles desktop clicks on Programs, Services, Testimonials, and Home links", () => {
    // innerWidth defaults to 1200 in beforeEach (desktop view)
    render(<Navbar />);

    const programsTrigger = screen.getByRole("link", { name: "Programs" });
    fireEvent.click(programsTrigger);
    expect(programsTrigger).toHaveClass("active");

    const servicesTrigger = screen.getByRole("link", { name: "Services" });
    fireEvent.click(servicesTrigger);
    expect(servicesTrigger).toHaveClass("active");

    const testimonialsLink = screen.getByRole("link", { name: "Testimonials" });
    fireEvent.click(testimonialsLink);
    expect(testimonialsLink).toHaveClass("active");

    const homeLink = screen.getByRole("link", { name: "Home" });
    fireEvent.click(homeLink);
    expect(homeLink).toHaveClass("active");
  });
});