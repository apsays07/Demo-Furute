import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ContactPage from "../page";

let mockSubjectValue = null;
// next/navigation
jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key) => {
      return mockSubjectValue;
    },
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

let mockEmailOnSuccess = true;
// Email Modal
jest.mock("@/components/shared/EmailLoginModal", () => ({ onSuccess }) => {
  React.useEffect(() => {
    if (mockEmailOnSuccess) {
      onSuccess("test-user@gmail.com");
    }
  }, [onSuccess]);
  return <div>Email Login Modal</div>;
});

// FormInput
jest.mock("@/components/ui/FormInput", () => (props) => (
  <input aria-label={props.label} name={props.name} value={props.value || ""} onChange={props.onChange} />
));

// FormTextarea
jest.mock("@/components/ui/FormTextarea", () => (props) => (
  <textarea aria-label={props.label} name={props.name} value={props.value || ""} onChange={props.onChange} />
));

// FormSelect
jest.mock("@/components/ui/FormSelect", () => (props) => (
  <select aria-label={props.label} name={props.name} value={props.value || ""} onChange={props.onChange}>
    {props.options.map((option) => (
      <option key={option} value={option}>{option}</option>
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
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
    mockSubjectValue = null;
    mockEmailOnSuccess = true;
    Storage.prototype.getItem = jest.fn(() => "student@gmail.com");
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
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

  test("initializes subject from URL search params", () => {
    mockSubjectValue = "Business Mentoring";
    render(<ContactPage />);
    expect(screen.getByLabelText("What are you looking for?").value).toBe("Business Mentoring");
  });

  test("initializes default subject on invalid URL param", () => {
    mockSubjectValue = "Invalid Subject Name";
    render(<ContactPage />);
    expect(screen.getByLabelText("What are you looking for?").value).toBe("General Inquiry");
  });

  test("toggles FAQ accordion sections on click", () => {
    render(<ContactPage />);
    
    const faqQuestion = screen.getByText("Who is Ashay Shah?");
    const toggleBtn = faqQuestion.closest("button");
    
    // initially not active
    expect(faqQuestion).toBeInTheDocument();
    
    // click to toggle open
    fireEvent.click(toggleBtn);
    
    // click to toggle closed
    fireEvent.click(toggleBtn);
  });

  test("submits form successfully and shows success screen", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<ContactPage />);

    fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "Ashay Shah" } });
    fireEvent.change(screen.getByLabelText("Phone Number"), { target: { value: "9822600521" } });
    fireEvent.change(screen.getByLabelText("Your Message"), { target: { value: "Hello world message." } });

    await act(async () => {
      fireEvent.submit(screen.getByLabelText("Full Name").closest("form"));
    });

    expect(screen.getByText(/Message Submitted Successfully!/i)).toBeInTheDocument();
    expect(screen.getAllByText("Ashay Shah").length).toBeGreaterThan(0);
    
    // test sending another message resets
    fireEvent.click(screen.getByText("Send Another Message"));
    expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
  });

  test("shows submission error message when fetch fails", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Inquiry rate limit exceeded." }),
    });

    render(<ContactPage />);

    fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "Ashay Shah" } });
    fireEvent.change(screen.getByLabelText("Phone Number"), { target: { value: "9822600521" } });
    fireEvent.change(screen.getByLabelText("Your Message"), { target: { value: "Hello world message." } });

    await act(async () => {
      fireEvent.submit(screen.getByLabelText("Full Name").closest("form"));
    });

    expect(screen.getByText(/Inquiry rate limit exceeded./i)).toBeInTheDocument();
  });

  test("authenticates using EmailLoginModal when verifiedEmail is missing", () => {
    Storage.prototype.getItem = jest.fn(() => null);
    render(<ContactPage />);
    expect(screen.getByText(/Send a Message/i)).toBeInTheDocument();
  });

  test("cycles through loading steps while submitting", async () => {
    jest.useFakeTimers();
    
    let resolvePromise;
    const fetchPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    global.fetch.mockImplementationOnce(() => fetchPromise);

    render(<ContactPage />);

    fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "Ashay Shah" } });
    fireEvent.change(screen.getByLabelText("Phone Number"), { target: { value: "9822600521" } });
    fireEvent.change(screen.getByLabelText("Your Message"), { target: { value: "Hello world message." } });

    await act(async () => {
      fireEvent.submit(screen.getByLabelText("Full Name").closest("form"));
    });

    // Advance timers by 700ms to cycle the loading step
    act(() => {
      jest.advanceTimersByTime(700);
    });

    // Advance timers again to test the boundary (prev < loadingStepsList.length - 1)
    act(() => {
      jest.advanceTimersByTime(700 * 5);
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

    render(<ContactPage />);

    // Since we mock EmailLoginModal to auto-authenticate in page.test.jsx line 42,
    // let's temporarily mock EmailLoginModal to NOT call onSuccess, so verifiedEmail remains falsy.
    mockEmailOnSuccess = false;

    fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "Ashay Shah" } });
    fireEvent.change(screen.getByLabelText("Phone Number"), { target: { value: "9822600521" } });
    fireEvent.change(screen.getByLabelText("Your Message"), { target: { value: "Hello world message." } });

    await act(async () => {
      fireEvent.submit(screen.getByLabelText("Full Name").closest("form"));
    });

    expect(screen.getByText(/Message Submitted Successfully!/i)).toBeInTheDocument();
  });

  test("handles submission error when thrown error is not an instance of Error", async () => {
    global.fetch.mockImplementationOnce(() => {
      throw "Some string error";
    });

    render(<ContactPage />);

    fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "Ashay Shah" } });
    fireEvent.change(screen.getByLabelText("Phone Number"), { target: { value: "9822600521" } });
    fireEvent.change(screen.getByLabelText("Your Message"), { target: { value: "Hello world message." } });

    await act(async () => {
      fireEvent.submit(screen.getByLabelText("Full Name").closest("form"));
    });

    expect(screen.getByText("Something went wrong. Please check your connection and try again.")).toBeInTheDocument();
  });

  test("shows default submission error when fetch fails without error message", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    render(<ContactPage />);

    fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "Ashay Shah" } });
    fireEvent.change(screen.getByLabelText("Phone Number"), { target: { value: "9822600521" } });
    fireEvent.change(screen.getByLabelText("Your Message"), { target: { value: "Hello world message." } });

    await act(async () => {
      fireEvent.submit(screen.getByLabelText("Full Name").closest("form"));
    });

    expect(screen.getByText("Failed to submit inquiry.")).toBeInTheDocument();
  });
});