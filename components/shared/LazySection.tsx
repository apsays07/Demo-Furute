"use client";

import { useEffect, useRef, useState } from "react";

interface LazySectionProps {
  children: React.ReactNode;
  minHeight?: string;
  id?: string;
  className?: string;
}

export default function LazySection({
  children,
  minHeight = "250px",
  id,
  className,
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Same initial state on server and client
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Safety fallback: force visibility after 800ms
    const fallbackTimer = setTimeout(() => {
      setIsVisible(true);
    }, 800);

    // Bounding rect check on mount
    const rect = element.getBoundingClientRect();
    const inViewport = rect.top < (window.innerHeight || document.documentElement.clientHeight) && rect.bottom > 0;
    if (inViewport) {
      setIsVisible(true);
      clearTimeout(fallbackTimer);
      return;
    }

    // Fallback for browsers without IntersectionObserver
    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      clearTimeout(fallbackTimer);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
          clearTimeout(fallbackTimer);
          observer.disconnect();
        }
      },
      {
        rootMargin: "250px",
        threshold: 0,
      }
    );

    observer.observe(element);

    return () => {
      clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      className={className}
      style={{
        minHeight: isVisible ? undefined : minHeight,
      }}
    >
      {isVisible ? children : null}
    </div>
  );
}