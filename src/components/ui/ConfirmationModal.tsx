"use client";

import { useEffect, type ReactNode } from "react";

type ConfirmationModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  variant?: "danger" | "primary";
};

export function ConfirmationModal({
  open,
  onClose,
  title,
  description,
  confirmLabel,
  cancelLabel = "Annulla",
  onConfirm,
  variant = "danger",
}: ConfirmationModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const confirmCls =
    variant === "danger"
      ? "border border-[#fecaca] bg-[#fdecec] text-[#E53E3E] hover:bg-[#fbd6d6]"
      : "border border-[#214e3a] bg-[#214e3a] text-white hover:bg-[#1a3f2e]";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Chiudi"
        className="absolute inset-0 bg-[#1f2b20]/25 backdrop-blur-[2px] hover:cursor-pointer"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
        className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm"
      >
        <div className="px-6 py-4">
          <h2
            id="confirmation-modal-title"
            className="text-[11px] font-semibold tracking-wide text-[#1f2b20]"
          >
            {title}
          </h2>
        </div>
        <div className="h-px w-full bg-black/5" />
        <div className="px-6 py-5">
          {description ? (
            <div className="text-[11px] font-medium leading-relaxed text-[#6b746c]">
              {description}
            </div>
          ) : null}
          <div
            className={`flex flex-col-reverse gap-2 sm:flex-row sm:justify-end ${description ? "mt-6" : ""}`}
          >
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-black/10 bg-white px-4 text-[11px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-black/5"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`inline-flex h-9 items-center justify-center rounded-lg px-4 text-[11px] font-semibold hover:cursor-pointer ${confirmCls}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
