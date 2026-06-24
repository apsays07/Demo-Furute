"use client";

import { useEffect } from "react";

/**
 * Global component that listens for keydown events.
 * If the user presses the Backspace key and is not currently typing in a text field,
 * it triggers a history back navigation.
 */
export default function BackspaceNavigation() {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Backspace") {
        const activeEl = document.activeElement;
        
        if (activeEl) {
          const tagName = activeEl.tagName.toLowerCase();
          const isEditable =
            activeEl.getAttribute("contenteditable") === "true" ||
            activeEl.getAttribute("contentEditable") === "true";
          const isInput =
            tagName === "input" ||
            tagName === "textarea" ||
            isEditable ||
            activeEl.getAttribute("role") === "textbox";
          
          if (isInput) {
            return;
          }
        }
        
        // Prevent default backspace actions and navigate back in browser history
        event.preventDefault();
        window.history.back();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}
