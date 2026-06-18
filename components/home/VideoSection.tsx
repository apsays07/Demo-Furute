"use client";

import { useState, useMemo } from "react";
import { DBVideo } from "@/lib/home";
import styles from "./VideoSection.module.css";
import VideoCard from "@/components/shared/VideoCard";
import VideoModal from "@/components/shared/VideoModal";

const featuredVideos = [
  {
    title: "Featured Talk",
    label: "Watch Video 01",
    videoId: "i-Qe4F17hKc",
  },
  {
    title: "Business Learning Session",
    label: "Watch Video 02",
    videoId: "Dp65MGhze3I",
  },
  {
    title: "Growth Insight",
    label: "Watch Video 03",
    videoId: "2ofM34EwKJo",
  },
  {
    title: "Mentoring Moment",
    label: "Watch Video 04",
    videoId: "S9fjt9HVf6Q",
  },
];

const localThumbnails: Record<string, string> = {
  "i-Qe4F17hKc": "/videos/video-1.webp",
  "Dp65MGhze3I": "/videos/video-2.webp",
  "2ofM34EwKJo": "/videos/video-3.webp",
  "S9fjt9HVf6Q": "/videos/video-4.webp",
};

interface VideoSectionProps {
  videos: DBVideo[];
}

type Video = {
  videoId: string;
  title: string;
  label: string;
  thumbnail: string;
};

export default function VideoSection({ videos }: VideoSectionProps) {
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  const videoList = useMemo(() => {
    const list: Video[] = [];
    const addedIds = new Set<string>();

    // 1. Add DB videos (newest first, already sorted by DB)
    for (const v of videos) {
      const videoId = v.youtubeUrl.match(
        /(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/
      )?.[1] ?? v.youtubeUrl;
      if (videoId && !addedIds.has(videoId)) {
        addedIds.add(videoId);
        list.push({
          videoId,
          title: v.title,
          label: v.title,
          thumbnail: v.thumbnail || localThumbnails[videoId] || "/videos/video-1.webp",
        });
      }
    }

    // 2. Backfill from static featuredVideos to always display exactly 4 videos
    if (list.length < 4) {
      for (const fv of featuredVideos) {
        if (list.length >= 4) break;
        if (!addedIds.has(fv.videoId)) {
          addedIds.add(fv.videoId);
          list.push({
            videoId: fv.videoId,
            title: fv.title,
            label: fv.label,
            thumbnail: localThumbnails[fv.videoId] || "/videos/video-1.webp",
          });
        }
      }
    }

    return list.slice(0, 4);
  }, [videos]);

  return (
    <section id="events" className={styles["video-section"]} aria-label="Featured videos">
      <div className={styles["video-section-inner"]}>
        <div className={styles["video-heading"]}>
          <p className={styles["section-eyebrow"]}>Featured Videos</p>
          <h2>Watch insights, talks, and learning moments from Furute.</h2>
        </div>

        <div className={styles["video-grid"]}>
          {videoList.map((video) => (
            <VideoCard
              key={video.videoId}
              title={video.title}
              label={video.label}
              videoId={video.videoId}
              thumbnail={video.thumbnail}
              onClick={() => setActiveVideo(video)}
            />
          ))}
        </div>

        <div className={styles["video-more-action"]}>
          <a
            href="https://www.youtube.com/@ashayshah"
            target="_blank"
            rel="noopener noreferrer"
          >
            View More Videos
          </a>
        </div>
      </div>

      {activeVideo ? (
        <VideoModal
          video={activeVideo}
          onClose={() => setActiveVideo(null)}
          styles={styles}
        />
      ) : null}
    </section>
  );
}
