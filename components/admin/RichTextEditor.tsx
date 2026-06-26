"use client";

import React, { useState, useId } from "react";
import { Bold, Italic, Underline, Link, List, ListOrdered, Eye, Edit3 } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
}

export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Write content here...",
  rows = 5,
}: RichTextEditorProps) {
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const editorId = useId();

  const insertTag = (before: string, after: string = "") => {
    const textarea = document.getElementById(editorId) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const replacement = before + selectedText + after;
    const newValue = text.substring(0, start) + replacement + text.substring(end);
    
    onChange(newValue);

    // Maintain focus and reset selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const handleLink = () => {
    const url = prompt("Enter link URL (e.g. https://example.com):");
    if (!url) return;
    const safeUrl = url.startsWith("http") ? url : `https://${url}`;
    insertTag(`<a href="${safeUrl}" target="_blank" class="text-teal hover:underline font-bold">`, "</a>");
  };

  const activeTabStyle = "border-teal text-teal font-extrabold";
  const inactiveTabStyle = "border-transparent text-slate-400 hover:text-slate-700 font-bold";

  return (
    <div className="w-full border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm hover:border-slate-350 focus-within:border-teal transition-all">
      {/* Header Tabs & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 bg-slate-50/50 px-3 py-2 gap-2">
        {/* Tabs */}
        <div className="flex gap-2 text-xs uppercase tracking-wider select-none border-b border-slate-100 sm:border-none pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setTab("edit")}
            className={`px-3 py-1.5 border-b-2 flex items-center gap-1.5 cursor-pointer transition-all ${
              tab === "edit" ? activeTabStyle : inactiveTabStyle
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Write
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`px-3 py-1.5 border-b-2 flex items-center gap-1.5 cursor-pointer transition-all ${
              tab === "preview" ? activeTabStyle : inactiveTabStyle
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
        </div>

        {/* Formatting Buttons (only active in 'edit' tab) */}
        {tab === "edit" && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => insertTag("<strong>", "</strong>")}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertTag("<em>", "</em>")}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertTag("<u>", "</u>")}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              title="Underline"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <button
              type="button"
              onClick={() => insertTag("<ul>\n  <li>", "</li>\n</ul>")}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              title="Unordered List"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertTag("<ol>\n  <li>", "</li>\n</ol>")}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              title="Ordered List"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleLink}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              title="Link"
            >
              <Link className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Editor Content Area */}
      <div className="p-3 bg-white">
        {tab === "preview" ? (
          <div
            className="w-full p-3 bg-slate-50/50 border border-slate-150 rounded-lg text-sm prose prose-sm max-w-none text-slate-800 outline-none overflow-y-auto leading-relaxed"
            style={{ minHeight: `${rows * 24}px` }}
            dangerouslySetInnerHTML={{
              __html: value.trim()
                ? value.replace(/\n/g, "<br />")
                : `<span class="text-slate-400 italic">Nothing to preview. Type something in the Write tab!</span>`,
            }}
          />
        ) : (
          <textarea
            id={editorId}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-white text-slate-900 border-none outline-none focus:ring-0 text-sm font-sans placeholder-slate-400 leading-relaxed resize-y"
          />
        )}
      </div>
    </div>
  );
}
