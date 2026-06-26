"use client";

import React from "react";
import { Trash2, Eye, Download, X } from "lucide-react";

interface BulkActionBarProps {
  selectedCount: number;
  onClear: () => void;
  onDelete?: () => void;
  onToggleVisibility?: () => void;
  onExport?: () => void;
  exportLabel?: string;
  hasVisibility?: boolean;
}

export default function BulkActionBar({
  selectedCount,
  onClear,
  onDelete,
  onToggleVisibility,
  onExport,
  exportLabel = "Export JSON",
  hasVisibility = false,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-6 z-50 animate-slide-up border border-slate-800 text-xs">
      <div className="flex items-center gap-2 font-bold select-none border-r border-slate-800 pr-4">
        <span className="flex items-center justify-center bg-teal text-white w-5 h-5 rounded-full text-[10px]">
          {selectedCount}
        </span>
        <span>Selected</span>
        <button
          type="button"
          onClick={onClear}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer ml-1"
          title="Clear selections"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        {hasVisibility && onToggleVisibility && (
          <button
            type="button"
            onClick={onToggleVisibility}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all border border-slate-700/50"
            title="Toggle visibility"
          >
            <Eye className="w-3.5 h-3.5 text-teal" />
            Toggle Show/Hide
          </button>
        )}

        {onExport && (
          <button
            type="button"
            onClick={onExport}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all border border-slate-700/50"
            title="Export selected data"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            {exportLabel}
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="px-3 py-2 bg-red-950 hover:bg-red-900 text-red-200 hover:text-red-100 font-extrabold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all border border-red-900/50"
            title="Delete selected items"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
            Bulk Delete
          </button>
        )}
      </div>

      <style jsx global>{`
        @keyframes slideUp {
          from { transform: translate(-50%, 20px); opacity: 0; }
          to   { transform: translate(-50%, 0);    opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}
