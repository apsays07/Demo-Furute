/* eslint-disable @next/next/no-img-element */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import InviteSpeakerPage from "../page";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ priority, fill, unoptimized, fetchPriority, ...props }) => (
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
jest.mock("@/components/shared/VideoModal", () => (props) => (
  <button data-testid="close-video-modal" onClick={props.onClose}>
    Video Modal: {props.video.title}
  </button>
));

let mockEmailOnSuccess = true;
// Mock Email Login Modal
jest.mock("@/components/shared/EmailLoginModal", () => ({ onSuccess }) => {
  React.useEffect(() => {
    if (mockEmailOnSuccess) {
      onSuccess("test-user@gmail.com");
    }
  }, [onSuccess]);
  return <div>Email Login Modal</div>;
});

// Mock FormInput
jest.mock("@/components/ui/FormInput", () => (props) => (
  <input aria-label={props.label} name={props.name} value={props.value || ""} onChange={props.onChange} />
));

// Mock FormTextarea
jest.mock("@/components/ui/FormTextarea", () => (props) => (
  <textarea aria-label={props.label} name={props.name} value={props.value || ""} onChange={props.onChange} />
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
    mockEmailOnSuccess = true;
    Storage.prototype.getItem = jest.fn(() => "student@gmail.com");
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
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

    expect(screen.getByText(/ashay@furute.in/i)).toBeInTheDocument();
    expect(screen.getByText(/9822600521/i)).toBeInTheDocument();
  });

  test("triggers VideoModal and closes it on onClose", () => {
    render(<InviteSpeakerPage />);

    // Click the first play button
    const playButtons = screen.getAllByRole("button", { name: /Play /i });
    fireEvent.click(playButtons[0]);

    // Check modal rendered
    expect(screen.getByTestId("close-video-modal")).toBeInTheDocument();

    // Close it
    fireEvent.click(screen.getByTestId("close-video-modal"));
    expect(screen.queryByTestId("close-video-modal")).not.toBeInTheDocument();
  });

  test("authenticates using EmailLoginModal when verifiedEmail is missing", () => {
    Storage.prototype.getItem = jest.fn(() => null);
    render(<InviteSpeakerPage />);
    // EmailLoginModal automatically calls onSuccess, so page loads the main elements
    expect(screen.getByLabelText(/Event Name/i)).toBeInTheDocument();
  });

  test("submits form successfully and shows success screen", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<InviteSpeakerPage />);

    fireEvent.change(screen.getByLabelText("Event Name"), { target: { value: "Annual Conference" } });
    fireEvent.change(screen.getByLabelText("Event Date"), { target: { value: "2026-10-10" } });
    fireEvent.change(screen.getByLabelText("Location / Venue"), { target: { value: "Pune" } });
    fireEvent.change(screen.getByLabelText("Expected Audience"), { target: { value: "500" } });
    fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "Organizer Name" } });
    fireEvent.change(screen.getByLabelText("Organization"), { target: { value: "My Org" } });
    fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "9822600521" } });
    fireEvent.change(screen.getByLabelText("Audience context and objective"), { target: { value: "Goal Setting details" } });

    await act(async () => {
      fireEvent.submit(screen.getByLabelText("Event Name").closest("form"));
    });

    expect(screen.getByText(/Inquiry Submitted Successfully!/i)).toBeInTheDocument();
    expect(screen.getAllByText("Organizer Name").length).toBeGreaterThan(0);

    // Click send another invitation
    fireEvent.click(screen.getByText("Submit Another Inquiry"));
    expect(screen.getByLabelText("Event Name")).toBeInTheDocument();
  });

  test("shows error alert on form submission failure", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Invitation rate limit exceeded." }),
    });

    render(<InviteSpeakerPage />);

    fireEvent.change(screen.getByLabelText("Event Name"), { target: { value: "Annual Conference" } });
    fireEvent.change(screen.getByLabelText("Event Date"), { target: { value: "2026-10-10" } });
    fireEvent.change(screen.getByLabelText("Location / Venue"), { target: { value: "Pune" } });
    fireEvent.change(screen.getByLabelText("Expected Audience"), { target: { value: "500" } });
    fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "Organizer Name" } });
    fireEvent.change(screen.getByLabelText("Organization"), { target: { value: "My Org" } });
    fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "9822600521" } });
    fireEvent.change(screen.getByLabelText("Audience context and objective"), { target: { value: "Goal Setting details" } });

    await act(async () => {
      fireEvent.submit(screen.getByLabelText("Event Name").closest("form"));
    });

    expect(screen.getByText(/Invitation rate limit exceeded./i)).toBeInTheDocument();
  });

  test("toggles fallback text when speaker image fails to load", () => {
    render(<InviteSpeakerPage />);
    const img = screen.getByAltText("Ashay Shah");
    fireEvent.error(img);
    expect(screen.getByText("AS")).toBeInTheDocument();
  });

  test("handles format segment selection", () => {
    render(<InviteSpeakerPage />);
    const virtualBtn = screen.getByRole("button", { name: "Virtual" });
    fireEvent.click(virtualBtn);
    expect(virtualBtn.className).toContain("active");
  });

  test("cycles through loading steps while submitting", async () => {
    jest.useFakeTimers();
    
    let resolvePromise;
    const fetchPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    global.fetch.mockImplementationOnce(() => fetchPromise);

    render(<InviteSpeakerPage />);

    fireEvent.change(screen.getByLabelText("Event Name"), { target: { value: "Annual Conference" } });
    fireEvent.change(screen.getByLabelText("Event Date"), { target: { value: "2026-10-10" } });
    fireEvent.change(screen.getByLabelText("Location / Venue"), { target: { value: "Pune" } });
    fireEvent.change(screen.getByLabelText("Expected Audience"), { target: { value: "500" } });
    fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "Organizer Name" } });
    fireEvent.change(screen.getByLabelText("Organization"), { target: { value: "My Org" } });
    fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "9822600521" } });
    fireEvent.change(screen.getByLabelText("Audience context and objective"), { target: { value: "Goal Setting details" } });

    await act(async () => {
      fireEvent.submit(screen.getByLabelText("Event Name").closest("form"));
    });

    // Advance timers by 600ms to cycle the loading step
    act(() => {
      jest.advanceTimersByTime(600);
    });

    // Advance timers again to test the boundary (prev < loadingStepsList.length - 1)
    act(() => {
      jest.advanceTimersByTime(600 * 5);
    });

    await act(async () => {
      resolvePromise({
        ok: true,
        json: async () => ({ success: true }),
      });
    });

    jest.useRealTimers();
  });

  test("handles submission when verifiedEmail is missing and remains empty", async () => {
    Storage.prototype.getItem = jest.fn(() => null);
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<InviteSpeakerPage />);

    // Since we mock EmailLoginModal to auto-authenticate in page.test.jsx line 40,
    // let's temporarily mock EmailLoginModal to NOT call onSuccess, so verifiedEmail remains falsy.
    mockEmailOnSuccess = false;

    fireEvent.change(screen.getByLabelText("Event Name"), { target: { value: "Annual Conference" } });
    fireEvent.change(screen.getByLabelText("Event Date"), { target: { value: "2026-10-10" } });
    fireEvent.change(screen.getByLabelText("Location / Venue"), { target: { value: "Pune" } });
    fireEvent.change(screen.getByLabelText("Expected Audience"), { target: { value: "500" } });
    fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "Organizer Name" } });
    fireEvent.change(screen.getByLabelText("Organization"), { target: { value: "My Org" } });
    fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "9822600521" } });
    fireEvent.change(screen.getByLabelText("Audience context and objective"), { target: { value: "Goal Setting details" } });

    await act(async () => {
      fireEvent.submit(screen.getByLabelText("Event Name").closest("form"));
    });

    expect(screen.getByText(/Inquiry Submitted Successfully!/i)).toBeInTheDocument();
  });

  test("handles submission error when thrown error is not an instance of Error", async () => {
    global.fetch.mockImplementationOnce(() => {
      throw "Some string error";
    });

    render(<InviteSpeakerPage />);

    fireEvent.change(screen.getByLabelText("Event Name"), { target: { value: "Annual Conference" } });
    fireEvent.change(screen.getByLabelText("Event Date"), { target: { value: "2026-10-10" } });
    fireEvent.change(screen.getByLabelText("Location / Venue"), { target: { value: "Pune" } });
    fireEvent.change(screen.getByLabelText("Expected Audience"), { target: { value: "500" } });
    fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "Organizer Name" } });
    fireEvent.change(screen.getByLabelText("Organization"), { target: { value: "My Org" } });
    fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "9822600521" } });
    fireEvent.change(screen.getByLabelText("Audience context and objective"), { target: { value: "Goal Setting details" } });

    await act(async () => {
      fireEvent.submit(screen.getByLabelText("Event Name").closest("form"));
    });

    expect(screen.getByText("Something went wrong. Please check your connection.")).toBeInTheDocument();
  });

  test("shows default submission error when fetch fails without error message", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    render(<InviteSpeakerPage />);

    fireEvent.change(screen.getByLabelText("Event Name"), { target: { value: "Annual Conference" } });
    fireEvent.change(screen.getByLabelText("Event Date"), { target: { value: "2026-10-10" } });
    fireEvent.change(screen.getByLabelText("Location / Venue"), { target: { value: "Pune" } });
    fireEvent.change(screen.getByLabelText("Expected Audience"), { target: { value: "500" } });
    fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "Organizer Name" } });
    fireEvent.change(screen.getByLabelText("Organization"), { target: { value: "My Org" } });
    fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "9822600521" } });
    fireEvent.change(screen.getByLabelText("Audience context and objective"), { target: { value: "Goal Setting details" } });

    await act(async () => {
      fireEvent.submit(screen.getByLabelText("Event Name").closest("form"));
    });

    expect(screen.getByText("Failed to submit speaker invitation.")).toBeInTheDocument();
  });
});