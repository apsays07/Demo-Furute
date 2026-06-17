import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../layout/Navbar";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ priority, fill, ...props }) => (
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
});