"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Eye, X, RefreshCw } from "lucide-react";

interface WebsitePreviewProps {
  /** The public website path to preview e.g. "/testimonials" */
  path: string;
  /** Label shown on the button e.g. "View Testimonials on Website" */
  label?: string;
  /** Anchor hash e.g. "#testimonials" for homepage sections */
  hash?: string;
}

export default function WebsitePreview({ path, label, hash = "" }: WebsitePreviewProps) {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState(0);
  const [origin, setOrigin] = useState("");

  // Resolve origin client-side so we get the actual port (3000, 3001, etc.)
  useEffect(() => {
    const timer = setTimeout(() => {
      setOrigin(window.location.origin);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const fullUrl = `${path}${hash}`;
  const iframeUrl = `${origin}${fullUrl}`;

  return (
    <>
      {/* Trigger Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#087f8c]/35 bg-[#087f8c]/5 text-[#087f8c] text-xs font-bold hover:bg-[#087f8c]/10 hover:scale-[1.02] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer shadow-sm"
        >
          <Eye className="w-3.5 h-3.5" />
          {label || "Preview on Website"}
        </button>
        <a
          href={fullUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-500 text-xs font-bold hover:bg-slate-50 hover:text-slate-700 hover:scale-[1.02] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-sm"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Open
        </a>
      </div>

      {/* Slide-out Preview Panel */}
      {open && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="relative ml-auto w-full max-w-3xl h-full bg-white shadow-2xl flex flex-col animate-slideIn">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-slate-400 font-mono truncate">
                  {origin}{fullUrl}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setKey((k) => k + 1)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
                  title="Reload preview"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <a
                  href={fullUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* iframe */}
            {origin && (
              <iframe
                key={key}
                src={iframeUrl}
                className="flex-1 w-full border-0"
                title="Website Preview"
              />
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .animate-slideIn {
          animation: slideIn 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  );
}
