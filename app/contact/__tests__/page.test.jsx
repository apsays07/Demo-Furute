import React from "react";
import { render, screen } from "@testing-library/react";
import ContactPage from "../page";

// next/navigation
jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: () => null,
  }),
}));

// next/link
jest.mock("next/link", () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

// framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    section: ({ children }) => <section>{children}</section>,
    div: ({ children }) => <div>{children}</div>,
    a: ({ children, href }) => <a href={href}>{children}</a>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Navbar
jest.mock("@/components/layout/Navbar", () => () => (
  <div>Navbar</div>
));

// Footer
jest.mock("@/components/layout/SiteFooter", () => () => (
  <div>Footer</div>
));

// Email Modal
jest.mock("@/components/shared/EmailLoginModal", () => () => (
  <div>Email Login Modal</div>
));

// FormInput
jest.mock("@/components/ui/FormInput", () => (props) => (
  <input aria-label={props.label} />
));

// FormTextarea
jest.mock("@/components/ui/FormTextarea", () => (props) => (
  <textarea aria-label={props.label} />
));

// FormSelect
jest.mock("@/components/ui/FormSelect", () => (props) => (
  <select aria-label={props.label}>
    {props.options.map((option) => (
      <option key={option}>{option}</option>
    ))}
  </select>
));

// Icons
jest.mock("@/components/ui/Icons", () => ({
  ArrowLeftIcon: () => <span>←</span>,
  ArrowRightIcon: () => <span>→</span>,
  CheckIcon: () => <span>✓</span>,
  MailIcon: () => <span>Mail</span>,
  PhoneIcon: () => <span>Phone</span>,
  MapPinIcon: () => <span>Map</span>,
  ClockIcon: () => <span>Clock</span>,
  ChevronDownIcon: () => <span>▼</span>,
  FacebookIcon: () => <span>FB</span>,
  XIcon: () => <span>X</span>,
  LinkedInIcon: () => <span>IN</span>,
  YouTubeIcon: () => <span>YT</span>,
  UserIcon: () => <span>User</span>,
  BuildingIcon: () => <span>Building</span>,
  BookOpenIcon: () => <span>Book</span>,
  MessageSquareIcon: () => <span>Message</span>,
}));

describe("Contact Page", () => {
  beforeEach(() => {
    Storage.prototype.getItem = jest.fn(() => "student@gmail.com");
  });

  test("renders hero heading", () => {
    render(<ContactPage />);

    expect(
      screen.getByText(/Let's build clearer direction together/i)
    ).toBeInTheDocument();
  });

  test("renders Send Message section", () => {
    render(<ContactPage />);

    expect(
      screen.getByText(/Send a Message/i)
    ).toBeInTheDocument();
  });

  test("renders Office Timings", () => {
    render(<ContactPage />);

    expect(
      screen.getByText(/Office Timings/i)
    ).toBeInTheDocument();
  });

  test("renders FAQ heading", () => {
    render(<ContactPage />);

    expect(
      screen.getByText(/Frequently Asked Questions/i)
    ).toBeInTheDocument();
  });

  test("renders trust banner", () => {
    render(<ContactPage />);

    expect(screen.getByText("8,000+")).toBeInTheDocument();
    expect(screen.getByText("Leaders Trained")).toBeInTheDocument();

    expect(screen.getByText("20+ Years")).toBeInTheDocument();
    expect(screen.getByText("Mentoring Experience")).toBeInTheDocument();

    expect(screen.getByText("Pune Hub")).toBeInTheDocument();
    expect(screen.getByText("Swargate Office")).toBeInTheDocument();

    expect(screen.getByText("Inquiry Response")).toBeInTheDocument();
  });

  test("renders form fields", () => {
    render(<ContactPage />);

    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();

    expect(
      screen.getByLabelText(/Your Message/i)
    ).toBeInTheDocument();
  });
});