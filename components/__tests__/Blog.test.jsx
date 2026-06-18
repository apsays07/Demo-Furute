
import { render, screen } from "@testing-library/react";
import BlogPage from "@/app/blog/page";

// Mock next/image since it needs special handling in tests
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

describe("Blog Listing Page", () => {
  it("renders the blog page heading", () => {
    render(<BlogPage />);
    expect(
      screen.getByRole("heading", { name: /our blog/i })
    ).toBeInTheDocument();
  });

  it("renders all 11 blog post cards", () => {
    render(<BlogPage />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBe(11);
  });

  it("renders a known blog post title", () => {
    render(<BlogPage />);
    expect(screen.getByText("Simplicity")).toBeInTheDocument();
  });

  it("renders the category badges", () => {
    render(<BlogPage />);
    expect(screen.getAllByText("Business").length).toBeGreaterThan(0);
  });
});
