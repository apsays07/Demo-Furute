/* eslint-disable @next/next/no-img-element */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import VideoSection from "../home/VideoSection";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ priority, fill, unoptimized, ...props }) => (
    <img {...props} alt={props.alt || ""} />
  ),
}));

// Mock VideoModal to verify it opens and closes
jest.mock("@/components/shared/VideoModal", () => ({ video, onClose }) => (
  <div data-testid="video-modal">
    <span>Modal: {video.title}</span>
    <button onClick={onClose}>Close Modal</button>
  </div>
));

describe("VideoSection Component", () => {
  it("renders exactly 4 videos from featuredVideos when input videos list is empty", () => {
    render(<VideoSection videos={[]} />);

    expect(screen.getByText("Featured Talk")).toBeInTheDocument();
    expect(screen.getByText("Business Learning Session")).toBeInTheDocument();
    expect(screen.getByText("Growth Insight")).toBeInTheDocument();
    expect(screen.getByText("Mentoring Moment")).toBeInTheDocument();

    const videoCards = screen.getAllByRole("button", { name: /Play /i });
    expect(videoCards).toHaveLength(4);
  });

  it("handles database videos and parses their YouTube URLs correctly", () => {
    const mockDBVideos = [
      {
        _id: "db-vid-1",
        title: "DB Video 1",
        youtubeUrl: "https://youtu.be/abc-123_XYZ",
        thumbnail: "custom-thumb.jpg",
        featured: true,
        visible: true,
      },
      {
        _id: "db-vid-2",
        title: "DB Video 2",
        youtubeUrl: "https://www.youtube.com/watch?v=11char_video",
        thumbnail: "",
        featured: true,
        visible: true,
      },
      {
        _id: "db-vid-3",
        title: "DB Video 3",
        youtubeUrl: "https://www.youtube.com/embed/embedVideo1",
        thumbnail: "",
        featured: true,
        visible: true,
      },
      {
        _id: "db-vid-4",
        title: "DB Video 4",
        youtubeUrl: "https://www.youtube.com/shorts/shortsVideo",
        thumbnail: "",
        featured: true,
        visible: true,
      },
    ];

    render(<VideoSection videos={mockDBVideos} />);

    expect(screen.getAllByText("DB Video 1")[0]).toBeInTheDocument();
    expect(screen.getAllByText("DB Video 2")[0]).toBeInTheDocument();
    expect(screen.getAllByText("DB Video 3")[0]).toBeInTheDocument();
    expect(screen.getAllByText("DB Video 4")[0]).toBeInTheDocument();
  });

  it("backfills with featuredVideos when database videos list is shorter than 4", () => {
    const mockDBVideos = [
      {
        _id: "db-vid-1",
        title: "DB Video 1",
        youtubeUrl: "https://youtu.be/abc-123_XYZ", // custom id
        thumbnail: "custom-thumb.jpg",
        featured: true,
        visible: true,
      },
    ];

    render(<VideoSection videos={mockDBVideos} />);

    // Should render DB Video 1, and backfill 3 from featuredVideos
    expect(screen.getAllByText("DB Video 1")[0]).toBeInTheDocument();
    expect(screen.getByText("Featured Talk")).toBeInTheDocument();
    expect(screen.getByText("Business Learning Session")).toBeInTheDocument();
    expect(screen.getByText("Growth Insight")).toBeInTheDocument();
    // Mentoring Moment should not be rendered because limit is 4
    expect(screen.queryByText("Mentoring Moment")).not.toBeInTheDocument();
  });

  it("handles fallback to youtubeUrl when matching fails", () => {
    const mockDBVideos = [
      {
        _id: "db-vid-1",
        title: "Unmatched Url",
        youtubeUrl: "not_a_valid_youtube_url",
        thumbnail: "",
        featured: true,
        visible: true,
      },
    ];

    render(<VideoSection videos={mockDBVideos} />);
    expect(screen.getAllByText("Unmatched Url")[0]).toBeInTheDocument();
  });

  it("opens modal when clicking a video card and closes it when onClose is triggered", () => {
    render(<VideoSection videos={[]} />);

    const cardButton = screen.getAllByRole("button", { name: /Play /i })[0];
    fireEvent.click(cardButton);

    // Verify modal is open
    expect(screen.getByTestId("video-modal")).toBeInTheDocument();
    expect(screen.getByText("Modal: Featured Talk")).toBeInTheDocument();

    // Close the modal
    const closeButton = screen.getByRole("button", { name: "Close Modal" });
    fireEvent.click(closeButton);

    // Verify modal is closed
    expect(screen.queryByTestId("video-modal")).not.toBeInTheDocument();
  });

  it("skips duplicate videoIds when parsing DB videos", () => {
    const mockDBVideos = [
      {
        _id: "db-vid-1",
        title: "Unique Title 1",
        youtubeUrl: "https://youtu.be/abc-123_XYZ",
        thumbnail: "custom-thumb.jpg",
        featured: true,
        visible: true,
      },
      {
        _id: "db-vid-2",
        title: "Duplicate Title",
        youtubeUrl: "https://youtu.be/abc-123_XYZ", // duplicate video ID
        thumbnail: "custom-thumb2.jpg",
        featured: true,
        visible: true,
      },
    ];

    render(<VideoSection videos={mockDBVideos} />);

    expect(screen.getAllByText("Unique Title 1")[0]).toBeInTheDocument();
    expect(screen.queryByText("Duplicate Title")).not.toBeInTheDocument();
  });

  it("skips backfilling featuredVideos if their videoId is already present in DB videos", () => {
    const mockDBVideos = [
      {
        _id: "db-vid-1",
        title: "Featured Video Override",
        youtubeUrl: "https://youtu.be/i-Qe4F17hKc", // "i-Qe4F17hKc" is the first featuredVideo videoId
        thumbnail: "custom-thumb.jpg",
        featured: true,
        visible: true,
      },
    ];

    render(<VideoSection videos={mockDBVideos} />);

    // Since the first featuredVideo ("i-Qe4F17hKc") was already added as "Featured Video Override",
    // the backfill should skip it and add the next ones: "Business Learning Session", "Growth Insight", "Mentoring Moment"
    expect(screen.getAllByText("Featured Video Override")[0]).toBeInTheDocument();
    expect(screen.queryByText("Featured Talk")).not.toBeInTheDocument();
    expect(screen.getByText("Business Learning Session")).toBeInTheDocument();
    expect(screen.getByText("Growth Insight")).toBeInTheDocument();
    expect(screen.getByText("Mentoring Moment")).toBeInTheDocument();
  });
});
