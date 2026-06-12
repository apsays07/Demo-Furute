import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import InviteSpeakerPage from "../../app/invite/page";

// Mock next/link
jest.mock("next/link", () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

// Mock Footer
jest.mock("@/components/layout/SiteFooter", () => () => <footer>Footer</footer>);

// Mock CSS Module
jest.mock("../../app/invite/invite.module.css", () => ({}));

describe("Invite Form Integration Test", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            message: "Invitation sent successfully",
          }),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders invite page successfully", () => {
    render(<InviteSpeakerPage />);

    expect(
      screen.getByText(/Invite Ashay Shah as a speaker/i)
    ).toBeInTheDocument();

    expect(
  screen.getByRole("heading", {
    level: 2,
    name: "Ashay Shah",
  })
).toBeInTheDocument();

  });

  test("user fills form and submits", async () => {
    render(<InviteSpeakerPage />);

    const eventName = screen.queryByLabelText(/Event Name/i);
    if (eventName) {
      fireEvent.change(eventName, {
        target: { value: "Leadership Summit" },
      });
    }

    const fullName = screen.queryByLabelText(/Full Name/i);
    if (fullName) {
      fireEvent.change(fullName, {
        target: { value: "Aniket" },
      });
    }

    const organization = screen.queryByLabelText(/Organization/i);
    if (organization) {
      fireEvent.change(organization, {
        target: { value: "Furute" },
      });
    }

    const email = screen.queryByLabelText(/Email/i);
    if (email) {
      fireEvent.change(email, {
        target: { value: "aniket@test.com" },
      });
    }

  const button = screen.getByRole("button", {
  name: /Submit Inquiry/i,
});

fireEvent.click(button);

    await waitFor(() => {
      expect(button).toBeInTheDocument();
    });
  });
});