"use client";

import { useEffect, useState } from "react";
import { CheckCircle, ExternalLink, X } from "lucide-react";

interface SaveSuccessBannerProps {
  /** Controls visibility — set to true after a successful save */
  show: boolean;
  /** Called when user dismisses the banner */
  onDismiss: () => void;
  /** The website path where the changes can be seen */
  previewPath: string;
  /** Custom message e.g. "Testimonial saved!" */
  message?: string;
  /** Auto-dismiss after ms (default 6000) */
  autoDismissMs?: number;
}

export default function SaveSuccessBanner({
  show,
  onDismiss,
  previewPath,
  message = "Changes saved!",
  autoDismissMs = 6000,
}: SaveSuccessBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      const showTimer = setTimeout(() => {
        setVisible(true);
      }, 0);
      const dismissTimer = setTimeout(() => {
        setVisible(false);
        onDismiss();
      }, autoDismissMs);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(dismissTimer);
      };
    }
  }, [show, autoDismissMs, onDismiss]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[200] animate-slideUp">
      <div className="flex items-center gap-3 px-4 py-3 bg-white border border-green-200 rounded-2xl shadow-xl shadow-green-100/50 max-w-sm">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-4 h-4 text-green-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800">{message}</p>
          <a
            href={previewPath}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-teal font-bold hover:underline mt-0.5"
          >
            View changes on website
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <button
          onClick={() => { setVisible(false); onDismiss(); }}
          className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 flex-shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <style jsx global>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .animate-slideUp {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}
