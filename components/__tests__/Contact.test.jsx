import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ContactUsPage from "../../app/contact/page";

// Mock Next.js Link
jest.mock("next/link", () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: () => null,
  }),
}));

// Mock Navbar
jest.mock("@/components/layout/Navbar", () => () => <nav>Navbar</nav>);

// Mock Footer
jest.mock("@/components/layout/SiteFooter", () => () => <footer>Footer</footer>);

// Mock CSS Module
jest.mock("../../app/contact/contact.module.css", () => ({}));

describe("Contact Page", () => {
  test("renders page heading", () => {
    render(<ContactUsPage />);

    expect(
      screen.getByText("Let's build clearer direction together.")
    ).toBeInTheDocument();
  });

  test("renders Send a Message heading", () => {
    render(<ContactUsPage />);

    expect(
      screen.getByText("Send a Message")
    ).toBeInTheDocument();
  });

  test("renders Full Name input", () => {
    render(<ContactUsPage />);

    expect(
      screen.getByLabelText(/Full Name/i)
    ).toBeInTheDocument();
  });

  test("renders Email input", () => {
    render(<ContactUsPage />);

    expect(
      screen.getByLabelText(/Email Address/i)
    ).toBeInTheDocument();
  });

  test("renders Phone input", () => {
    render(<ContactUsPage />);

    expect(
      screen.getByLabelText(/Phone Number/i)
    ).toBeInTheDocument();
  });

  test("renders Subject dropdown", () => {
    render(<ContactUsPage />);

    expect(
      screen.getByLabelText(/What are you looking for/i)
    ).toBeInTheDocument();
  });

  test("renders Message textarea", () => {
    render(<ContactUsPage />);

    expect(
      screen.getByLabelText(/Your Message/i)
    ).toBeInTheDocument();
  });

  test("renders Submit button", () => {
    render(<ContactUsPage />);

    expect(
      screen.getByRole("button", { name: /Send Message/i })
    ).toBeInTheDocument();
  });

  test("renders FAQ heading", () => {
    render(<ContactUsPage />);

    expect(
      screen.getByText("Frequently Asked Questions")
    ).toBeInTheDocument();
  });
});