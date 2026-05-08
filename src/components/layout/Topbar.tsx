"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  timeLabel: string;
  unread?: boolean;
};

export function Topbar({
  title,
  breadcrumb,
}: {
  title: React.ReactNode;
  breadcrumb?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const notifications = useMemo<NotificationItem[]>(
    () => [
      {
        id: "n1",
        title: "Riconciliazione: payout non combacia",
        description: "Delta -€5,50 su PO-99282 (Klarna).",
        timeLabel: "Oggi • 10:41",
        unread: true,
      },
      {
        id: "n2",
        title: "Nuova transazione completata",
        description: "TX #TX-99281-A • €249,99 • Tech Store Milano.",
        timeLabel: "Oggi • 09:12",
        unread: true,
      },
      {
        id: "n3",
        title: "Nuovo utente registrato",
        description: "Maria Rossi (USR-8821).",
        timeLabel: "Ieri • 18:26",
        unread: false,
      },
    ],
    [],
  );

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: globalThis.MouseEvent | TouchEvent) {
      if (!wrapperRef.current) return;
      if (wrapperRef.current.contains(e.target as Node)) return;
      setOpen(false);
    }
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="bg-white">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 py-4 pl-20 pr-6 lg:pl-6">
        <div className="flex min-w-0 items-center gap-4">
          <div className="min-w-0">
            {breadcrumb ? (
              <div className="truncate text-[11px] font-semibold text-[#9aa39a]">
                {breadcrumb}
              </div>
            ) : null}
            {title ? (
              <h1 className="truncate text-xl font-semibold tracking-tight text-[#111827]">
                {title}
              </h1>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <div ref={wrapperRef} className="relative">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F7F9] text-[#1f2b20] ring-1 ring-black/5 hover:cursor-pointer hover:bg-black/5"
              aria-label="Notifiche"
              aria-haspopup="menu"
              aria-expanded={open}
            >
              <Bell className="h-[18px] w-[18px]" />
              {unreadCount > 0 ? (
                <span
                  aria-hidden
                  className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ef4444]"
                />
              ) : null}
            </button>

            {open ? (
              <div
                role="menu"
                className="absolute right-0 z-50 mt-2 w-[360px] overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="text-[11px] font-semibold tracking-wide text-[#1f2b20]">
                    NOTIFICHE
                  </div>
                  <span className="text-[10px] font-semibold text-[#9aa39a]">
                    {unreadCount > 0 ? `${unreadCount} nuove` : "Nessuna nuova"}
                  </span>
                </div>
                <div className="h-px w-full bg-black/5" />

                <div className="max-h-[340px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-[11px] font-medium text-[#9aa39a]">
                      Nessuna notifica.
                    </div>
                  ) : (
                    <ul className="py-1">
                      {notifications.map((n) => (
                        <li key={n.id}>
                          <button
                            type="button"
                            className="flex w-full items-start gap-3 px-4 py-3 text-left hover:cursor-pointer hover:bg-black/[0.02]"
                          >
                            <span
                              aria-hidden
                              className={`mt-1 h-2 w-2 flex-none rounded-full ${
                                n.unread ? "bg-[#76C043]" : "bg-black/10"
                              }`}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div className="text-[11px] font-semibold text-[#1f2b20]">
                                  {n.title}
                                </div>
                                <div className="whitespace-nowrap text-[10px] font-medium text-[#9aa39a]">
                                  {n.timeLabel}
                                </div>
                              </div>
                              <div className="mt-1 text-[11px] font-medium text-[#6b746c]">
                                {n.description}
                              </div>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="h-px w-full bg-black/5" />
                <div className="px-4 py-3">
                  <Link
                    href="/notifications"
                    className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-[#214e3a] px-4 text-[11px] font-semibold text-white shadow-sm hover:cursor-pointer hover:bg-[#1a3f2e]"
                  >
                    Vedi tutte le notifiche
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </header>
    </div>
  );
}

