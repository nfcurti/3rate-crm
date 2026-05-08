"use client";

import { ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { Topbar } from "@/components/layout/Topbar";

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  timeLabel: string;
  unread?: boolean;
};

const NOTIFICATIONS_DEMO: NotificationItem[] = [
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
  {
    id: "n4",
    title: "Documento allegato alla transazione",
    description: "È stato caricato un file su TX #TX-99279-C.",
    timeLabel: "Ieri • 11:03",
    unread: false,
  },
];

export default function NotificationsPage() {
  return (
    <>
      <Topbar
        title={null}
        breadcrumb={
          <span className="inline-flex items-center gap-2">
            <Link href="/" className="hover:cursor-pointer hover:underline">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-[#6b746c]">Notifiche</span>
          </span>
        }
      />

      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <section className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa39a]" />
              <input
                placeholder="Cerca notifica..."
                className="h-7 w-full rounded-lg border border-black/10 bg-white pl-11 pr-4 text-[12px] font-medium text-[#1f2b20] outline-none placeholder:text-[#c0c6c0] focus:border-[#5DBE54] focus:ring-4 focus:ring-[#5DBE54]/15"
              />
            </div>
            <button
              type="button"
              className="inline-flex h-7 items-center justify-center rounded-lg border border-black/10 bg-white px-4 text-[11px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-black/5"
            >
              Segna tutte come lette
            </button>
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
          <div className="px-6 py-4">
            <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
              TUTTE LE NOTIFICHE
            </div>
          </div>
          <div className="h-px w-full bg-black/5" />
          <ul className="divide-y divide-black/5">
            {NOTIFICATIONS_DEMO.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  className="flex w-full items-start gap-3 px-6 py-4 text-left hover:cursor-pointer hover:bg-black/[0.02]"
                >
                  <span
                    aria-hidden
                    className={`mt-1.5 h-2 w-2 flex-none rounded-full ${
                      n.unread ? "bg-[#76C043]" : "bg-black/10"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-[12px] font-semibold text-[#1f2b20]">
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
        </section>
      </div>
    </>
  );
}

