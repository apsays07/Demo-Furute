import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import VideoModal from "../shared/VideoModal";

describe("VideoModal", () => {
  const video = {
    title: "Test Video Title",
    videoId: "12345",
    label: "Test Label",
  };
  const onClose = jest.fn();
  const styles = {
    "video-modal": "video-modal-class",
    "video-modal-backdrop": "backdrop-class",
    "video-modal-panel": "panel-class",
    "video-modal-header": "header-class",
    "video-modal-close": "close-class",
    "video-embed-wrap": "embed-class",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the video modal with title, label and iframe source", () => {
    render(<VideoModal video={video} onClose={onClose} styles={styles} />);

    expect(screen.getByText("Test Video Title")).toBeInTheDocument();
    expect(screen.getByText("Test Label")).toBeInTheDocument();

    const iframe = screen.getByTitle("Test Video Title");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/12345?autoplay=1&rel=0"
    );
  });

  it("triggers onClose when backdrop is clicked", () => {
    render(<VideoModal video={video} onClose={onClose} styles={styles} />);

    // backdrop button
    const backdropBtn = screen.getByLabelText("Close video", { selector: ".backdrop-class" });
    fireEvent.click(backdropBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it("triggers onClose when close button is clicked", () => {
    render(<VideoModal video={video} onClose={onClose} styles={styles} />);

    // close button inside header
    const closeBtn = screen.getByLabelText("Close video", { selector: ".close-class" });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
