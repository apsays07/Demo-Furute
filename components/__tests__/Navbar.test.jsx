import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "../layout/Navbar";

// Mock Next.js Link
jest.mock("next/link", () => {
  return ({ children, href }) => (
    <a href={href}>{children}</a>
  );
});

// Mock CSS Module
jest.mock("../layout/Navbar.module.css", () => ({}));

describe("Navbar Component", () => {

  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1200,
    });
  });

  test("renders navbar", () => {
    render(<Navbar />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  test("renders logo", () => {
    render(<Navbar />);
    expect(screen.getByAltText("Furute Logo")).toBeInTheDocument();
  });

  test("renders Home menu", () => {
    render(<Navbar />);
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  test("renders About Us menu", () => {
    render(<Navbar />);
    expect(screen.getByText("About Us")).toBeInTheDocument();
  });

  test("renders Programs menu", () => {
    render(<Navbar />);
    expect(screen.getByText("Programs")).toBeInTheDocument();
  });

  test("renders Contact Us menu", () => {
    render(<Navbar />);
    expect(screen.getByText("Contact Us")).toBeInTheDocument();
  });

  test("renders hamburger button", () => {
    render(<Navbar />);
    expect(
      screen.getByLabelText("Toggle navigation menu")
    ).toBeInTheDocument();
  });

});