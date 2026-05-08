"use client";

import { useEffect, useState } from "react";
import {
  type RegistrationDateFilter,
  dateToInputValue,
  inputValueToDate,
} from "@/lib/end-user-registration-filter";

type Mode = "specific" | "range" | "before" | "after";

const MODE_OPTIONS: { id: Mode; label: string }[] = [
  { id: "specific", label: "Data specifica" },
  { id: "range", label: "Intervallo" },
  { id: "before", label: "Prima del" },
  { id: "after", label: "Dopo il" },
];

function filterToDraft(f: RegistrationDateFilter): {
  mode: Mode;
  single: string;
  from: string;
  to: string;
} {
  if (f.mode === "none") {
    return { mode: "specific", single: "", from: "", to: "" };
  }
  if (f.mode === "specific") {
    return {
      mode: "specific",
      single: dateToInputValue(f.date),
      from: "",
      to: "",
    };
  }
  if (f.mode === "range") {
    return {
      mode: "range",
      single: "",
      from: dateToInputValue(f.from),
      to: dateToInputValue(f.to),
    };
  }
  if (f.mode === "before") {
    return {
      mode: "before",
      single: dateToInputValue(f.date),
      from: "",
      to: "",
    };
  }
  return {
    mode: "after",
    single: dateToInputValue(f.date),
    from: "",
    to: "",
  };
}

export function RegistrationDateFilterModal({
  open,
  onClose,
  committed,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  committed: RegistrationDateFilter;
  onApply: (next: RegistrationDateFilter) => void;
}) {
  const [mode, setMode] = useState<Mode>("specific");
  const [single, setSingle] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const d = filterToDraft(committed);
    setMode(d.mode);
    setSingle(d.single);
    setFrom(d.from);
    setTo(d.to);
    setError(null);
  }, [open, committed]);

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

  function handleApply() {
    setError(null);
    if (mode === "specific") {
      const d = inputValueToDate(single);
      if (!d) {
        setError("Seleziona una data valida.");
        return;
      }
      onApply({ mode: "specific", date: d });
      onClose();
      return;
    }
    if (mode === "range") {
      let a = inputValueToDate(from);
      let b = inputValueToDate(to);
      if (!a || !b) {
        setError("Inserisci data inizio e fine.");
        return;
      }
      if (a.getTime() > b.getTime()) {
        [a, b] = [b, a];
      }
      onApply({ mode: "range", from: a, to: b });
      onClose();
      return;
    }
    if (mode === "before" || mode === "after") {
      const d = inputValueToDate(single);
      if (!d) {
        setError("Seleziona una data valida.");
        return;
      }
      onApply(mode === "before" ? { mode: "before", date: d } : { mode: "after", date: d });
      onClose();
    }
  }

  if (!open) return null;

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
        aria-labelledby="registration-date-filter-title"
        className="relative z-10 w-full max-w-[440px] overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm"
      >
        <div className="px-6 py-4">
          <h2
            id="registration-date-filter-title"
            className="text-[11px] font-semibold tracking-wide text-[#1f2b20]"
          >
            FILTRO DATA REGISTRAZIONE
          </h2>
        </div>
        <div className="h-px w-full bg-black/5" />
        <div className="px-6 py-5">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {MODE_OPTIONS.map((opt) => {
              const active = mode === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setMode(opt.id);
                    setError(null);
                  }}
                  className={`rounded-lg border px-3 py-2 text-left text-[11px] font-semibold transition-colors hover:cursor-pointer ${
                    active
                      ? "border-[#214e3a] bg-[#e7efe9] text-[#1f5132]"
                      : "border-black/10 bg-white text-[#1f2b20] hover:bg-black/[0.03]"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4 space-y-3">
            {mode === "range" ? (
              <>
                <div className="space-y-2">
                  <div className="text-[10px] font-semibold text-[#6b746c]">Dal</div>
                  <input
                    type="date"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="h-10 w-full rounded-lg border border-black/10 bg-white px-3 text-[12px] font-medium text-[#1f2b20] outline-none focus:border-[#5DBE54] focus:ring-4 focus:ring-[#5DBE54]/15"
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] font-semibold text-[#6b746c]">Al</div>
                  <input
                    type="date"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="h-10 w-full rounded-lg border border-black/10 bg-white px-3 text-[12px] font-medium text-[#1f2b20] outline-none focus:border-[#5DBE54] focus:ring-4 focus:ring-[#5DBE54]/15"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <div className="text-[10px] font-semibold text-[#6b746c]">Data</div>
                <input
                  type="date"
                  value={single}
                  onChange={(e) => setSingle(e.target.value)}
                  className="h-10 w-full rounded-lg border border-black/10 bg-white px-3 text-[12px] font-medium text-[#1f2b20] outline-none focus:border-[#5DBE54] focus:ring-4 focus:ring-[#5DBE54]/15"
                />
              </div>
            )}
          </div>

          {error ? (
            <div className="mt-3 text-[10px] font-semibold text-[#E53E3E]">{error}</div>
          ) : null}

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-black/10 bg-white px-4 text-[11px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-black/5"
            >
              Annulla
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-[#214e3a] bg-[#214e3a] px-4 text-[11px] font-semibold text-white hover:cursor-pointer hover:bg-[#1a3f2e]"
            >
              Applica
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
