"use client";

import Image from "next/image";
import { PlayIcon } from "@/components/ui/Icons";
import styles from "./VideoCard.module.css";

interface VideoCardProps {
  title: string;
  label: string;
  videoId: string;
  thumbnail: string;
  onClick: () => void;
}

export default function VideoCard({
  title,
  label,
  videoId: _videoId,
  thumbnail,
  onClick,
}: VideoCardProps) {
  return (
    <button
      type="button"
      className={styles["video-card"]}
      onClick={onClick}
      aria-label={`Play ${title}`}
    >
      <span className={styles["video-thumb-wrap"]}>
        <Image
          src={thumbnail}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <span className={styles["video-play"]} aria-hidden="true">
          <PlayIcon />
        </span>
      </span>
      <span className={styles["video-card-content"]}>
        <span>{label}</span>
        <strong>{title}</strong>
      </span>
    </button>
  );
}
