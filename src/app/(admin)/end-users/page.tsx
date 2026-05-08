"use client";

import { Mail, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { EndUsersTable } from "@/components/end-users/EndUsersTable";
import { RegistrationDateFilterModal } from "@/components/end-users/RegistrationDateFilterModal";
import { useEndUserSelection } from "@/components/end-users/EndUserSelectionProvider";
import { Topbar } from "@/components/layout/Topbar";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { END_USERS_DEMO } from "@/lib/end-users-demo";
import {
  type RegistrationDateFilter,
  formatRegistrationFilterLabel,
  rowMatchesRegistrationFilter,
} from "@/lib/end-user-registration-filter";

export default function EndUsersPage() {
  const { selectedIds, setAll, clear } = useEndUserSelection();
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [allRows, setAllRows] = useState(() => END_USERS_DEMO);
  const [dateFilter, setDateFilter] = useState<RegistrationDateFilter>({
    mode: "none",
  });
  const [dateModalOpen, setDateModalOpen] = useState(false);

  const selectedCount = selectedIds.size;
  const hasDateFilter = dateFilter.mode !== "none";

  const rows = useMemo(
    () =>
      allRows.filter((r) =>
        rowMatchesRegistrationFilter(r.registeredAt, dateFilter),
      ),
    [allRows, dateFilter],
  );

  const dateButtonLabel = formatRegistrationFilterLabel(dateFilter);

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

            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <button
                type="button"
                onClick={() => setDateModalOpen(true)}
                aria-pressed={hasDateFilter}
                className={`inline-flex h-7 min-w-0 max-w-full items-center justify-center rounded-lg border px-4 text-[11px] font-semibold hover:cursor-pointer ${
                  hasDateFilter
                    ? "border-[#5DBE54] bg-[#e7f6ea] text-[#1f5132] hover:bg-[#d8efdb]"
                    : "border-black/10 bg-white text-[#1f2b20] hover:bg-black/5"
                }`}
              >
                <span className="truncate">{dateButtonLabel}</span>
              </button>
              {hasDateFilter ? (
                <button
                  type="button"
                  onClick={() => setDateFilter({ mode: "none" })}
                  className="inline-flex h-7 items-center justify-center rounded-lg border border-black/10 bg-white px-3 text-[10px] font-semibold text-[#6b746c] hover:cursor-pointer hover:bg-black/5"
                >
                  Cancella data
                </button>
              ) : null}
            </div>
            <button
              type="button"
              className="inline-flex h-7 items-center justify-center rounded-lg border border-black/10 bg-white px-4 text-[11px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-black/5 lg:ml-0"
            >
              Tutti gli stati
            </button>
          </div>
        </section>

        <RegistrationDateFilterModal
          open={dateModalOpen}
          onClose={() => setDateModalOpen(false)}
          committed={dateFilter}
          onApply={setDateFilter}
        />

        <section className="mt-4 rounded-xl border border-black/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <label className="inline-flex items-center gap-3 text-[11px] font-semibold text-[#1f2b20]">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-black/10"
                checked={rows.length > 0 && rows.every((r) => selectedIds.has(r.id))}
                onChange={(e) => setAll(rows, e.target.checked)}
              />
              Seleziona tutti ({rows.length})
            </label>

            <button
              type="button"
              disabled={selectedCount === 0}
              onClick={() => setSuspendOpen(true)}
              className={`inline-flex h-7 items-center justify-center rounded-lg border px-4 text-[11px] font-semibold ${
                selectedCount === 0
                  ? "cursor-not-allowed border-[#fecaca] bg-[#fdecec] text-[#e1a2a2]"
                  : "border-[#fecaca] bg-[#fdecec] text-[#E53E3E] hover:cursor-pointer hover:bg-[#fbd6d6]"
              }`}
            >
              Sospendi selezionati
            </button>
          </div>
        </section>

        <ConfirmationModal
          open={suspendOpen}
          onClose={() => setSuspendOpen(false)}
          title="Sospendere gli utenti selezionati?"
          description={
            selectedCount === 0 ? undefined : (
              <>
                Stai per sospendere{" "}
                <span className="font-semibold text-[#1f2b20]">{selectedCount}</span>{" "}
                {selectedCount === 1 ? "utente" : "utenti"}. Potrai gestire lo stato dal
                dettaglio utente.
              </>
            )
          }
          confirmLabel="Sospendi"
          onConfirm={() => {
            clear();
          }}
        />

        <section className="mt-4">
          <EndUsersTable
            rows={rows}
            onRemove={(row) =>
              setAllRows((prev) => prev.filter((r) => r.id !== row.id))
            }
          />
        </section>
      </div>
    </>
  );
}
