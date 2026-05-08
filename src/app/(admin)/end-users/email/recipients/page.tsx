"use client";

import { ChevronRight, Search, X } from "lucide-react";
import { Inter } from "next/font/google";
import Link from "next/link";
import { useMemo } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { EndUsersTable, type EndUserRow } from "@/components/end-users/EndUsersTable";
import { useEndUserSelection } from "@/components/end-users/EndUserSelectionProvider";
import { END_USERS_DEMO } from "@/lib/end-users-demo";

const inter = Inter({ subsets: ["latin"] });

function SelectedRecipientRow({
  initials,
  name,
  email,
  onRemove,
}: {
  initials: string;
  name: string;
  email: string;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f6f7f6] px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f2f4f2] text-[11px] font-semibold text-[#6b746c] ring-1 ring-black/5">
          {initials}
        </div>
        <div className="min-w-0">
          <div className="truncate text-[11px] font-semibold text-[#1f2b20]">
            {name}
          </div>
          <div className="truncate text-[10px] font-medium text-[#9aa39a]">
            {email}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#9aa39a] hover:cursor-pointer hover:bg-black/5"
        aria-label="Rimuovi destinatario"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function ModifyEndUserRecipientsPage() {
  const { selectedById, selectedIds, remove, setAll } = useEndUserSelection();

  const rows = useMemo<EndUserRow[]>(() => END_USERS_DEMO, []);

  const selectedRecipients = useMemo(() => {
    const r = Array.from(selectedById.values());
    return r.map((v) => ({
      id: v.id,
      initials: v.name
        .split(" ")
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase(),
      name: v.name,
      email: v.email,
    }));
  }, [selectedById]);

  return (
    <>
      <Topbar
        title={null}
        breadcrumb={
          <span className="inline-flex items-center gap-2">
            <Link href="/end-users" className="hover:cursor-pointer hover:underline">
              Utenti
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href="/end-users/email"
              className="hover:cursor-pointer hover:underline"
            >
              Invia email di massa
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-[#6b746c]">Modifica destinatari</span>
          </span>
        }
      />

      <div className={`mx-auto w-full max-w-7xl px-6 py-6 ${inter.className}`}>
        <div className="space-y-4">
          <section className="rounded-xl border border-black/10 bg-white shadow-sm">
            <div className="px-6 py-4">
              <div className="text-[11px] font-semibold tracking-wide text-[#1f2b20]">
                DESTINATARI SELEZIONATI
              </div>
            </div>
            <div className="h-px w-full bg-black/5" />
            <div className="px-6 py-5">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {selectedRecipients.length ? (
                  selectedRecipients.map((r) => (
                    <SelectedRecipientRow
                      key={r.id}
                      initials={r.initials}
                      name={r.name}
                      email={r.email}
                      onRemove={() => remove(r.id)}
                    />
                  ))
                ) : (
                  <div className="text-[11px] font-medium text-[#9aa39a]">
                    Nessun destinatario selezionato. Seleziona almeno un utente dalla
                    tabella qui sotto.
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-center">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa39a]" />
                <input
                  placeholder="Cerca utente per ID, nome, email..."
                  className="h-10 w-full rounded-lg border border-black/10 bg-white pl-11 pr-4 text-[12px] font-medium text-[#1f2b20] outline-none placeholder:text-[#c0c6c0] focus:border-[#5DBE54] focus:ring-4 focus:ring-[#5DBE54]/15"
                />
              </div>

              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-black/10 bg-white px-4 text-[11px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-black/5"
              >
                Ultimi 30 giorni
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-black/10 bg-white px-4 text-[11px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-black/5"
              >
                Tutti gli stati
              </button>
            </div>
          </section>

          <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
            <label className="inline-flex items-center gap-3 text-[11px] font-semibold text-[#1f2b20]">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-black/10"
                checked={rows.length > 0 && rows.every((r) => selectedIds.has(r.id))}
                onChange={(e) => setAll(rows, e.target.checked)}
              />
              Seleziona tutti ({rows.length})
            </label>
          </section>

          <EndUsersTable rows={rows} />

          <div className="sticky bottom-0 -mx-6 border-t border-black/5 bg-[#f3f5f2] px-6 py-4">
            <Link
              href="/end-users/email"
              className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#214e3a] text-[12px] font-semibold text-white shadow-sm hover:cursor-pointer hover:bg-[#1a3f2e] active:translate-y-px"
            >
              Conferma selezione
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

