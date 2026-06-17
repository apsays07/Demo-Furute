import React from "react";
import { render, screen } from "@testing-library/react";
import InviteSpeakerPage from "../page";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ priority, fill, ...props }) => (
    <img {...props} alt={props.alt || ""} />
  ),
}));

// Mock next/link
jest.mock("next/link", () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children }) => <div>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock Footer
jest.mock("@/components/layout/SiteFooter", () => () => (
  <div>Footer</div>
));

// Mock Video Modal
jest.mock("@/components/shared/VideoModal", () => () => (
  <div>Video Modal</div>
));

// Mock Email Login Modal
jest.mock("@/components/shared/EmailLoginModal", () => ({ onSuccess }) => (
  <button onClick={() => onSuccess("student@gmail.com")}>
    Email Login
  </button>
));

// Mock FormInput
jest.mock("@/components/ui/FormInput", () => (props) => (
  <input aria-label={props.label} />
));

// Mock FormTextarea
jest.mock("@/components/ui/FormTextarea", () => (props) => (
  <textarea aria-label={props.label} />
));

// Mock utility
jest.mock("@/lib/utils", () => ({
  cn: (...classes) => classes.filter(Boolean).join(" "),
}));

// Mock Icons
jest.mock("@/components/ui/Icons", () => ({
  ArrowLeftIcon: () => <span>←</span>,
  ArrowRightIcon: () => <span>→</span>,
  PlayIcon: () => <span>▶</span>,
  CheckIcon: () => <span>✓</span>,
  TargetIcon: () => <span>Target</span>,
  UsersIcon: () => <span>Users</span>,
  TrendingUpIcon: () => <span>Growth</span>,
  ZapIcon: () => <span>Zap</span>,
  CalendarIcon: () => <span>Calendar</span>,
  MapPinIcon: () => <span>Map</span>,
  UserIcon: () => <span>User</span>,
  BuildingIcon: () => <span>Building</span>,
  MailIcon: () => <span>Mail</span>,
  PhoneIcon: () => <span>Phone</span>,
  MessageSquareIcon: () => <span>Message</span>,
}));

describe("Invite Speaker Page", () => {
  beforeEach(() => {
    Storage.prototype.getItem = jest.fn(() => "student@gmail.com");
  });

  test("renders hero heading", () => {
    render(<InviteSpeakerPage />);

    expect(
      screen.getByText(/Invite Ashay Shah as a speaker/i)
    ).toBeInTheDocument();
  });

  test("renders navigation links", () => {
    render(<InviteSpeakerPage />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Topics")).toBeInTheDocument();
    expect(screen.getByText("Videos")).toBeInTheDocument();
    expect(screen.getByText("Invite Now")).toBeInTheDocument();
  });

  test("renders speaking topics", () => {
    render(<InviteSpeakerPage />);

    expect(
      screen.getByText(/Passion Without Priority Is Powerless/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Leadership, Ownership, And Team Accountability/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Business Clarity In A Changing Market/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Mindset, Confidence, And Breakthrough/i)
    ).toBeInTheDocument();
  });

  test("renders organizer form", () => {
    render(<InviteSpeakerPage />);

    expect(screen.getByLabelText(/Event Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Event Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location \/ Venue/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Expected Audience/i)).toBeInTheDocument();
  });

  test("renders organizer details", () => {
    render(<InviteSpeakerPage />);

    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Organization/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
  });

  test("renders speaking brief textarea", () => {
    render(<InviteSpeakerPage />);

    expect(
      screen.getByLabelText(/Audience context and objective/i)
    ).toBeInTheDocument();
  });

  test("renders submit button", () => {
    render(<InviteSpeakerPage />);

    expect(
      screen.getByRole("button", {
        name: /Submit Inquiry/i,
      })
    ).toBeInTheDocument();
  });

  test("renders contact information", () => {
    render(<InviteSpeakerPage />);

    expect(screen.getByText(/info@furute.in/i)).toBeInTheDocument();
    expect(screen.getByText(/9822600521/i)).toBeInTheDocument();
  });
});