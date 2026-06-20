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

  test("shows validation error on invalid custom email", () => {
    render(<EmailLoginModal onSuccess={onSuccess} />);
    fireEvent.click(screen.getByText("Use another account"));
    const input = screen.getByPlaceholderText("Email or phone");
    fireEvent.change(input, {
      target: { value: "invalid-email" },
    });
    const form = input.closest("form");
    fireEvent.submit(form);
    expect(screen.getByText("Enter a valid email address")).toBeInTheDocument();
  });

  test("loads official Google GSI client when client ID is provided", () => {
    const originalEnv = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = "mock-client-id";

    // Setup window.google mockup
    const mockInitialize = jest.fn();
    const mockRenderButton = jest.fn();
    const mockPrompt = jest.fn();
    window.google = {
      accounts: {
        id: {
          initialize: mockInitialize,
          renderButton: mockRenderButton,
          prompt: mockPrompt,
        },
      },
    };

    // Render component
    render(<EmailLoginModal onSuccess={onSuccess} />);

    // Since window.google exists immediately, initGsi should be called:
    expect(mockInitialize).toHaveBeenCalled();
    expect(mockPrompt).toHaveBeenCalled();

    // Clean up
    delete window.google;
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = originalEnv;
  });

  test("handles script loading when window.google does not exist immediately", () => {
    const originalEnv = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = "mock-client-id";

    const scriptListeners = {};
    const mockScriptElement = document.createElement("script");
    Object.defineProperty(mockScriptElement, "onload", {
      set(cb) {
        scriptListeners["load"] = cb;
      },
      configurable: true,
    });

    const originalCreateElement = document.createElement.bind(document);
    const spy = jest.spyOn(document, "createElement").mockImplementation((tagName) => {
      if (tagName === "script") {
        return mockScriptElement;
      }
      return originalCreateElement(tagName);
    });

    const appendSpy = jest.spyOn(document.body, "appendChild").mockImplementation(() => {
      return mockScriptElement;
    });

    try {
      render(<EmailLoginModal onSuccess={onSuccess} />);

      expect(document.createElement).toHaveBeenCalledWith("script");
      expect(mockScriptElement.src).toBe("https://accounts.google.com/gsi/client");

      const mockInitialize = jest.fn();
      window.google = {
        accounts: {
          id: {
            initialize: mockInitialize,
            renderButton: jest.fn(),
            prompt: jest.fn(),
          },
        },
      };

      if (scriptListeners["load"]) {
        scriptListeners["load"]();
      }
      expect(mockInitialize).toHaveBeenCalled();
    } finally {
      delete window.google;
      spy.mockRestore();
      appendSpy.mockRestore();
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = originalEnv;
    }
  });

  test("triggers success callback when GSI credential callback is called", () => {
    const originalEnv = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = "mock-client-id";

    let gsiCallback;
    window.google = {
      accounts: {
        id: {
          initialize: jest.fn((options) => {
            gsiCallback = options.callback;
          }),
          renderButton: jest.fn(),
          prompt: jest.fn(),
        },
      },
    };

    try {
      render(<EmailLoginModal onSuccess={onSuccess} />);

      const payload = JSON.stringify({ email: "google-user@gmail.com" });
      const base64Payload = Buffer.from(payload).toString("base64");
      const mockCredential = `header.${base64Payload}.signature`;

      if (gsiCallback) {
        gsiCallback({ credential: mockCredential });
      }

      expect(localStorage.getItem("guest_verified_email")).toBe("google-user@gmail.com");
      expect(onSuccess).toHaveBeenCalledWith("google-user@gmail.com");
    } finally {
      delete window.google;
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = originalEnv;
    }
  });

  test("handles GSI credential token decode failure gracefully", () => {
    const originalEnv = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = "mock-client-id";
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    let gsiCallback;
    window.google = {
      accounts: {
        id: {
          initialize: jest.fn((options) => {
            gsiCallback = options.callback;
          }),
          renderButton: jest.fn(),
          prompt: jest.fn(),
        },
      },
    };

    try {
      render(<EmailLoginModal onSuccess={onSuccess} />);

      if (gsiCallback) {
        gsiCallback({ credential: "header.invalid_base64_payload.signature" });
      }

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "GSI token decode failed:",
        expect.any(Error)
      );
    } finally {
      delete window.google;
      consoleErrorSpy.mockRestore();
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = originalEnv;
    }
  });

  test("does not trigger onSuccess if GSI credential has no payload parts", () => {
    const originalEnv = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = "mock-client-id";

    let gsiCallback;
    window.google = {
      accounts: {
        id: {
          initialize: jest.fn((options) => {
            gsiCallback = options.callback;
          }),
          renderButton: jest.fn(),
          prompt: jest.fn(),
        },
      },
    };

    try {
      render(<EmailLoginModal onSuccess={onSuccess} />);

      if (gsiCallback) {
        gsiCallback({ credential: "noparts" });
      }

      expect(onSuccess).not.toHaveBeenCalled();
    } finally {
      delete window.google;
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = originalEnv;
    }
  });

  test("does not trigger onSuccess if GSI payload lacks email", () => {
    const originalEnv = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = "mock-client-id";

    let gsiCallback;
    window.google = {
      accounts: {
        id: {
          initialize: jest.fn((options) => {
            gsiCallback = options.callback;
          }),
          renderButton: jest.fn(),
          prompt: jest.fn(),
        },
      },
    };

    try {
      render(<EmailLoginModal onSuccess={onSuccess} />);

      const payload = JSON.stringify({ name: "Bob" });
      const base64Payload = Buffer.from(payload).toString("base64");
      const mockCredential = `header.${base64Payload}.signature`;

      if (gsiCallback) {
        gsiCallback({ credential: mockCredential });
      }

      expect(onSuccess).not.toHaveBeenCalled();
    } finally {
      delete window.google;
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = originalEnv;
    }
  });

  test("skips GSI initialization if script loads but window.google remains undefined", () => {
    const originalEnv = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = "mock-client-id";

    const scriptListeners = {};
    const mockScriptElement = document.createElement("script");
    Object.defineProperty(mockScriptElement, "onload", {
      set(cb) {
        scriptListeners["load"] = cb;
      },
      configurable: true,
    });

    const originalCreateElement = document.createElement.bind(document);
    const spy = jest.spyOn(document, "createElement").mockImplementation((tagName) => {
      if (tagName === "script") return mockScriptElement;
      return originalCreateElement(tagName);
    });

    const appendSpy = jest.spyOn(document.body, "appendChild").mockImplementation(() => {
      return mockScriptElement;
    });

    try {
      render(<EmailLoginModal onSuccess={onSuccess} />);

      if (scriptListeners["load"]) {
        scriptListeners["load"]();
      }
      expect(onSuccess).not.toHaveBeenCalled();
    } finally {
      spy.mockRestore();
      appendSpy.mockRestore();
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = originalEnv;
    }
  });
});