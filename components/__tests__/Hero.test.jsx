import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../../app/page";

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        success: true,
        data: [],
      }),
  })
);

// Mock Navbar
jest.mock("@/components/layout/Navbar", () => () => <nav>Navbar</nav>);

// Mock Footer
jest.mock("@/components/layout/SiteFooter", () => () => (
  <footer>Footer</footer>
));

// Mock LazySection to render children immediately
jest.mock("@/components/shared/LazySection", () => {
  return function MockLazySection({ children }) {
    return <>{children}</>;
  };
});

// Mock CSS Module
jest.mock("../../app/page.module.css", () => ({}));

describe("Home Page", () => {
  test("renders hero heading", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(
        screen.getByText(/Passion Without/i)
      ).toBeInTheDocument();
    });
  });

  test("renders What We Do section", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(
        screen.getByText("What We Do")
      ).toBeInTheDocument();
    });
  });

  test("renders Programs section", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(
        screen.getByText("Our Programs And Services Overview")
      ).toBeInTheDocument();
    });
  });

  test("renders Meet Ashay Shah section", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(
        screen.getByText("Meet Ashay Shah")
      ).toBeInTheDocument();
    });
  });

  test("renders Testimonials heading", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Stories from people who turned learning into growth."
        )
      ).toBeInTheDocument();
    });
  });
});