import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ContactUsPage from "../../app/contact/page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: jest.fn(() => null),
  }),
}));

// Mock next/link
jest.mock("next/link", () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children }) => <div>{children}</div>,
    section: ({ children }) => <section>{children}</section>,
    a: ({ children, href }) => <a href={href}>{children}</a>,
  },
}));

// Mock Navbar
jest.mock("@/components/layout/Navbar", () => () => (
  <nav>Navbar</nav>
));

// Mock Footer
jest.mock("@/components/layout/SiteFooter", () => () => (
  <footer>Footer</footer>
));

// Mock Form Components
jest.mock("@/components/ui/FormInput", () => (props) => (
  <input aria-label={props.label} />
));

jest.mock("@/components/ui/FormTextarea", () => (props) => (
  <textarea aria-label={props.label} />
));

jest.mock("@/components/ui/FormSelect", () => (props) => (
  <select aria-label={props.label}></select>
));

// Mock CSS
jest.mock("../../app/contact/contact.module.css", () => ({}));

describe("Contact Page", () => {
  test("renders successfully", () => {
    render(<ContactUsPage />);

    expect(screen.getByText(/Get In Touch/i)).toBeInTheDocument();
  });
});