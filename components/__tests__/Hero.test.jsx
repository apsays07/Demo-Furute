import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../../app/page";

// Mock Navbar
jest.mock("@/components/Navbar", () => () => <nav>Navbar</nav>);

// Mock Footer
jest.mock("@/components/SiteFooter", () => () => <footer>Footer</footer>);

// Mock CSS Module
jest.mock("../../app/page.module.css", () => ({}));

describe("Home Page", () => {
  test("renders hero heading", () => {
    render(<Home />);

    expect(
      screen.getByText(/Passion Without/i)
    ).toBeInTheDocument();
  });

  test("renders What We Do section", () => {
    render(<Home />);

    expect(
      screen.getByText("What We Do")
    ).toBeInTheDocument();
  });

  test("renders Programs section", () => {
    render(<Home />);

    expect(
      screen.getByText("Our Programs And Services Overview")
    ).toBeInTheDocument();
  });

  test("renders Meet Ashay Shah section", () => {
    render(<Home />);

    expect(
      screen.getByText("Meet Ashay Shah")
    ).toBeInTheDocument();
  });

  test("renders Testimonials heading", () => {
    render(<Home />);

    expect(
      screen.getByText("Stories from people who turned learning into growth.")
    ).toBeInTheDocument();
  });
});