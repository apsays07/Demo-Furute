import React from "react";
import { CloseIcon } from "@/components/ui/Icons";

interface Video {
  title: string;
  videoId: string;
  label?: string;
}

interface VideoModalProps {
  video: Video;
  onClose: () => void;
  styles: Record<string, string>;
}

export default function VideoModal({ video, onClose, styles }: VideoModalProps) {
  return (
    <div
      className={styles["video-modal"]}
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
    >
      <button
        type="button"
        className={styles["video-modal-backdrop"]}
        aria-label="Close video"
        onClick={onClose}
      />
      <div className={styles["video-modal-panel"]}>
        <div className={styles["video-modal-header"]}>
          <div>
            {video.label && <span>{video.label}</span>}
            <h2>{video.title}</h2>
          </div>
          <button
            type="button"
            className={styles["video-modal-close"]}
            aria-label="Close video"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>
        <div className={styles["video-embed-wrap"]}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </div>
  );
}
