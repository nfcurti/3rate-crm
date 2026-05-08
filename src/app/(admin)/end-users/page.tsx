"use client";

import { Mail, Search } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { EndUsersTable } from "@/components/end-users/EndUsersTable";
import { useEndUserSelection } from "@/components/end-users/EndUserSelectionProvider";
import { Topbar } from "@/components/layout/Topbar";
import { END_USERS_DEMO } from "@/lib/end-users-demo";

export default function EndUsersPage() {
  const { selectedIds, setAll } = useEndUserSelection();
  const rows = useMemo(() => END_USERS_DEMO, []);

  return (
    <>
      <Topbar title="Gestione utenti" />

      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Utenti totali", value: "18,432", tone: "text-[#1f2b20]" },
            { label: "Utenti attivi", value: "15,287", tone: "text-[#1f2b20]" },
            { label: "Nuovi (30gg)", value: "342", tone: "text-[#1f2b20]" },
            { label: "Bloccati", value: "124", tone: "text-[#E53E3E]" },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-xl border border-black/10 bg-white px-5 py-4 shadow-sm"
            >
              <div className={`text-[18px] font-semibold ${k.tone}`}>
                {k.value}
              </div>
              <div className="mt-2 text-[11px] font-semibold text-[#6b746c]">
                {k.label}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-4 rounded-xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
            AZIONI RAPIDE
          </div>

          <div className="mt-4">
            <Link
              href="/end-users/email"
              className="flex items-center gap-4 rounded-xl border border-black/10 bg-white p-4 text-left shadow-sm hover:cursor-pointer hover:bg-black/5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e7f6ea] text-[#38A169] ring-1 ring-[#5DBE54]/15">
                <Mail className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[12px] font-semibold text-[#1f2b20]">
                  Invia email
                </div>
                <div className="mt-0.5 text-[10px] font-medium text-[#9aa39a]">
                  Comunicazione massiva
                </div>
              </div>
            </Link>
          </div>
        </section>

        <section className="mt-4 rounded-xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa39a]" />
              <input
                placeholder="Cerca utente per ID, nome, email..."
                className="h-7 w-full rounded-lg border border-black/10 bg-white pl-11 pr-4 text-[12px] font-medium text-[#1f2b20] outline-none placeholder:text-[#c0c6c0] focus:border-[#5DBE54] focus:ring-4 focus:ring-[#5DBE54]/15"
              />
            </div>

            <button
              type="button"
              className="inline-flex h-7 items-center justify-center rounded-lg border border-black/10 bg-white px-4 text-[11px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-black/5"
            >
              Data registrazione
            </button>
            <button
              type="button"
              className="inline-flex h-7 items-center justify-center rounded-lg border border-black/10 bg-white px-4 text-[11px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-black/5"
            >
              Tutti gli stati
            </button>
          </div>
        </section>

        <section className="mt-4 rounded-xl border border-black/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <label className="inline-flex items-center gap-3 text-[11px] font-semibold text-[#1f2b20]">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-black/10"
                checked={rows.length > 0 && rows.every((r) => selectedIds.has(r.id))}
                onChange={(e) => setAll(rows, e.target.checked)}
              />
              Seleziona tutti (342)
            </label>

            <button
              type="button"
              className="inline-flex h-7 items-center justify-center rounded-lg border border-[#f3c2c2] bg-white px-4 text-[11px] font-semibold text-[#E53E3E] hover:cursor-pointer hover:bg-[#fdecec]"
            >
              Sospendi selezionati
            </button>
          </div>
        </section>

        <section className="mt-4">
          <EndUsersTable rows={rows} />
        </section>
      </div>
    </>
  );
}
