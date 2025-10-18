import React, { useEffect, useRef } from "react";

export default function ModalWrapper({
  open,
  onClose,
  children,
  ariaLabelledBy,
  ariaDescribedBy,
}) {
  const panelRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement;
    const node = panelRef.current;
    // find focusable elements
    const focusable = node
      ? node.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      : [];
    if (focusable && focusable.length) {
      focusable[0].focus();
    }

    function handleKey(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose(false);
        return;
      }
      if (e.key === "Tab" && focusable && focusable.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      try {
        if (previouslyFocused && previouslyFocused.focus)
          previouslyFocused.focus();
      } catch (e) {
        // ignore
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    >
      <div
        ref={panelRef}
        className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4 mx-4 relative focus:outline-none"
        tabIndex={-1}
      >
        {/* visible focus ring for keyboard users */}
        <style>{`.modal-focus:focus { box-shadow: 0 0 0 4px rgba(59,130,246,0.25); outline: none; }`}</style>
        <div className="modal-focus">{children}</div>
      </div>
    </div>
  );
}
