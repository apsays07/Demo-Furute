import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EmailLoginModal from "../shared/EmailLoginModal";

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  UserPlus: () => <div>UserPlusIcon</div>,
  ChevronRight: () => <div>ChevronRightIcon</div>,
}));

describe("EmailLoginModal", () => {
  const onSuccess = jest.fn();

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("renders choose account screen", () => {
    render(<EmailLoginModal onSuccess={onSuccess} />);

    expect(screen.getByText("Choose an account")).toBeInTheDocument();
    expect(screen.getByText("Ashay Shah")).toBeInTheDocument();
    expect(screen.getByText("Guest User")).toBeInTheDocument();
  });

  test("selects Ashay account", () => {
    render(<EmailLoginModal onSuccess={onSuccess} />);

    fireEvent.click(screen.getByText("Ashay Shah"));

    expect(localStorage.getItem("guest_verified_email")).toBe(
      "ashayshah@gmail.com"
    );

    expect(onSuccess).toHaveBeenCalledWith("ashayshah@gmail.com");
  });

  test("selects Guest account", () => {
    render(<EmailLoginModal onSuccess={onSuccess} />);

    fireEvent.click(screen.getByText("Guest User"));

    expect(localStorage.getItem("guest_verified_email")).toBe(
      "guest.user@gmail.com"
    );

    expect(onSuccess).toHaveBeenCalledWith("guest.user@gmail.com");
  });

  test("switches to custom email form", () => {
    render(<EmailLoginModal onSuccess={onSuccess} />);

    fireEvent.click(screen.getByText("Use another account"));

    expect(
      screen.getByPlaceholderText("Email or phone")
    ).toBeInTheDocument();

    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  test("allows typing in email input", () => {
    render(<EmailLoginModal onSuccess={onSuccess} />);

    fireEvent.click(screen.getByText("Use another account"));

    const input = screen.getByPlaceholderText("Email or phone");

    fireEvent.change(input, {
      target: {
        value: "abc",
      },
    });

    expect(input.value).toBe("abc");
  });

  test("accepts valid custom email", () => {
    render(<EmailLoginModal onSuccess={onSuccess} />);

    fireEvent.click(screen.getByText("Use another account"));

    fireEvent.change(screen.getByPlaceholderText("Email or phone"), {
      target: {
        value: "student@gmail.com",
      },
    });

    fireEvent.click(screen.getByText("Next"));

    expect(localStorage.getItem("guest_verified_email")).toBe(
      "student@gmail.com"
    );

    expect(onSuccess).toHaveBeenCalledWith("student@gmail.com");
  });

  test("goes back to account selection", () => {
    render(<EmailLoginModal onSuccess={onSuccess} />);

    fireEvent.click(screen.getByText("Use another account"));

    fireEvent.click(screen.getByText("Back to accounts"));

    expect(screen.getByText("Choose an account")).toBeInTheDocument();
  });
});