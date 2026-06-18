"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./ShareButton.module.css";

const shareLinks = [
  {
    name: "WhatsApp",
    color: "#25D366",
    getUrl: (url: string, title: string) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-1.746-.873-2.888-1.561-4.035-3.541-.305-.526.305-.489.873-1.629.099-.198.05-.371-.05-.52-.099-.149-.644-1.561-.892-2.135-.247-.575-.51-.479-.706-.479-.198 0-.495-.024-.792-.024-.297 0-.792.099-1.213.475-.42.378-1.611 1.534-1.611 3.74 0 2.205 1.683 4.236 1.882 4.515.198.298 2.69 4.236 6.673 5.726 3.337 1.245 3.337.83 4.04.748.703-.082 2.196-.937 2.518-1.851.317-.913.317-1.694.222-1.851-.099-.149-.297-.232-.595-.382z"/>
        <path d="M12.004 2C6.486 2 2 6.487 2 12.005c0 1.957.575 3.84 1.658 5.473L2 22l4.658-1.622a9.96 9.96 0 005.346 1.532c5.518 0 10.004-4.488 10.004-10.006C22.008 6.486 17.522 2 12.004 2zm0 18.184a8.16 8.16 0 01-4.158-1.13l-.298-.18-3.084 1.075 1.083-3.026-.198-.31a8.156 8.156 0 01-1.255-4.61c0-4.51 3.668-8.178 8.178-8.178 4.51 0 8.178 3.668 8.178 8.178 0 4.51-3.668 8.18-8.178 8.18z"/>
      </svg>
    ),
  },
  {
    name: "Facebook",
    color: "#1877F2",
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12.07C22 6.51 17.52 2 12 2S2 6.51 2 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.5-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22c4.78-.75 8.44-4.91 8.44-9.93z"/>
      </svg>
    ),
  },
  {
    name: "Instagram",
    color: "#E1306C",
    getUrl: () => `https://www.instagram.com/`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.637.415 1.363.465 2.428.05 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.05-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.637-.415-1.363-.465-2.428C2.01 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.065.218-1.79.465-2.428a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.637-.247 1.363-.415 2.428-.465C8.944 2.01 9.283 2 12 2zm0 1.802c-2.67 0-2.987.01-4.04.058-.976.045-1.505.207-1.858.344-.467.182-.8.399-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.053-.058 1.37-.058 4.041 0 2.67.01 2.987.058 4.04.045.976.207 1.505.344 1.858.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058 2.67 0 2.987-.01 4.04-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.399 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.054.058-1.37.058-4.041 0-2.67-.01-2.987-.058-4.04-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.097 3.097 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.054-.048-1.37-.058-4.041-.058zm0 4.595a5.603 5.603 0 110 11.206 5.603 5.603 0 010-11.206zm0 1.802a3.801 3.801 0 100 7.602 3.801 3.801 0 000-7.602zm6.406-2.305a1.34 1.34 0 11-2.68 0 1.34 1.34 0 012.68 0z"/>
      </svg>
    ),
  },
  {
    name: "X",
    color: "#000000",
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    color: "#0A66C2",
    getUrl: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 110-4.124 2.062 2.062 0 010 4.124zM7.114 20.452H3.558V9h3.556v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
];

export default function ShareButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.share) {
      setCanNativeShare(true);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: document.title || "Furute",
        url: window.location.href,
      });
    } catch (err) {
      // user cancelled or error — no action needed
    }
  };

  const handleShare = (getUrl: (url: string, title: string) => string) => {
    const currentUrl = window.location.href;
    const title = document.title || "Furute";
    window.open(getUrl(currentUrl, title), "_blank", "noopener,noreferrer,width=600,height=500");
    setIsOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
    setTimeout(() => setIsOpen(false), 600);
  };

  // Calculate fan/half-circle positions
  const totalIcons = shareLinks.length + 1; // +1 for copy link
  const radius = 100;

  return (
    <div className={styles.shareWrapper} ref={containerRef}>
      <button
        className={`${styles.shareTrigger} ${isOpen ? styles.shareTriggerActive : ""}`}
        onClick={() => (canNativeShare ? handleNativeShare() : setIsOpen(!isOpen))}
        aria-label="Share this page"
        aria-expanded={isOpen}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      </button>

      <div className={`${styles.fanMenu} ${isOpen ? styles.fanMenuOpen : ""}`}>
        {shareLinks.map((item, index) => {
          // Half circle on the right side, spread from top to bottom
          const angle = (index / (totalIcons - 1)) * 140 - 70;
          const rad = (angle * Math.PI) / 180;
          const x = radius * Math.cos(rad);
          const y = radius * Math.sin(rad);

          return (
            <button
              key={item.name}
              className={styles.fanItem}
              style={{
                transform: isOpen
                  ? `translate(${x}px, ${y}px)`
                  : "translate(0, 0)",
                transitionDelay: isOpen ? `${index * 0.03}s` : "0s",
                background: item.color,
              }}
              onClick={() => handleShare(item.getUrl)}
              aria-label={`Share on ${item.name}`}
              title={item.name}
            >
              {item.icon}
            </button>
          );
        })}

        {/* Copy link button — placed at the end of the fan */}
        <button
          className={styles.fanItem}
          style={{
            transform: isOpen
              ? `translate(${radius * Math.cos(((shareLinks.length / (totalIcons - 1)) * 180 - 90) * Math.PI / 180)}px, ${radius * Math.sin(((shareLinks.length / (totalIcons - 1)) * 180 - 90) * Math.PI / 180)}px)`
              : "translate(0, 0)",
            transitionDelay: isOpen ? `${shareLinks.length * 0.03}s` : "0s",
            background: "#555",
          }}
          onClick={handleCopyLink}
          aria-label="Copy link"
          title="Copy link"
        >
          {copied ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 007.07 0l1.93-1.93a5 5 0 00-7.07-7.07L10.5 5.5" />
              <path d="M14 11a5 5 0 00-7.07 0L5 12.93a5 5 0 007.07 7.07L13.5 18.5" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}