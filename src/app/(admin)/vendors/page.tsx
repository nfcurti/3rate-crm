"use client";

import { Mail, Search, UserRoundPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { VendorsTable } from "@/components/vendors/VendorsTable";
import { useVendorSelection } from "@/components/vendors/VendorSelectionProvider";
import { VENDORS_DEMO } from "@/lib/vendors-demo";

export default function VendorsPage() {
  const { selectedIds, setAll, clear } = useVendorSelection();
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [rows, setRows] = useState(VENDORS_DEMO);
  const selectedCount = selectedIds.size;
  const [last30Active, setLast30Active] = useState(true);
  const hasActiveFilters = last30Active;

  return (
    <>
      <Topbar title="Gestione venditori" />

      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Totale venditori", value: "5,620", tone: "text-[#1f2b20]" },
            { label: "Venditori attivi", value: "5,226", tone: "text-[#1f2b20]" },
            { label: "Venditori piano sospeso", value: "209", tone: "text-[#b45309]" },
            { label: "Venditori bloccati", value: "185", tone: "text-[#E53E3E]" },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-xl border border-black/10 bg-white px-5 py-4 shadow-sm"
            >
              <div className="text-[11px] font-semibold text-[#6b746c]">
                {k.label}
              </div>
              <div className={`mt-2 text-[18px] font-semibold ${k.tone}`}>
                {k.value}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-4 rounded-xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
            AZIONI RAPIDE
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Link
              href="/vendors/new"
              className="flex items-center gap-4 rounded-xl border border-black/10 bg-white p-4 text-left shadow-sm hover:cursor-pointer hover:bg-black/5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e7f6ea] text-[#38A169] ring-1 ring-[#5DBE54]/15">
                <UserRoundPlus className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[12px] font-semibold text-[#1f2b20]">
                  Aggiungi nuovo venditore
                </div>
                <div className="mt-0.5 text-[10px] font-medium text-[#9aa39a]">
                  Aggiungi venditore manualmente
                </div>
              </div>
            </Link>

            <Link
              href="/vendors/email"
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
                placeholder="Cerco venditore per nome, ID, email o P.IVA..."
                className="h-7 w-full rounded-lg border border-black/10 bg-white pl-11 pr-4 text-[12px] font-medium text-[#1f2b20] outline-none placeholder:text-[#c0c6c0] focus:border-[#5DBE54] focus:ring-4 focus:ring-[#5DBE54]/15"
              />
            </div>

            <button
              type="button"
              onClick={() => setLast30Active((v) => !v)}
              aria-pressed={last30Active}
              className={`inline-flex h-7 items-center justify-center rounded-lg border px-4 text-[11px] font-semibold hover:cursor-pointer ${
                last30Active
                  ? "border-[#5DBE54] bg-[#e7f6ea] text-[#1f5132] hover:bg-[#d8efdb]"
                  : "border-black/10 bg-white text-[#1f2b20] hover:bg-black/5"
              }`}
            >
              Ultimi 30 giorni
            </button>
            <button
              type="button"
              className="inline-flex h-7 items-center justify-center rounded-lg border border-black/10 bg-white px-4 text-[11px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-black/5"
            >
              Tutti gli stati
            </button>
          </div>

          {hasActiveFilters ? (
            <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-[#6b746c]">
              <span className="text-[#9aa39a]">Filtri attivi:</span>
              {last30Active ? (
                <button
                  type="button"
                  onClick={() => setLast30Active(false)}
                  aria-label="Rimuovi filtro Ultimi 30 giorni"
                  className="inline-flex items-center gap-2 rounded-full bg-[#f2f4f2] px-3 py-1 text-[10px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-[#e8ebe8]"
                >
                  Ultimi 30 giorni
                  <span aria-hidden className="text-[#9aa39a]">
                    ×
                  </span>
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setLast30Active(false)}
                className="text-[10px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:underline"
              >
                Cancella tutti
              </button>
            </div>
          ) : null}
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
          title="Sospendere i venditori selezionati?"
          description={
            selectedCount === 0 ? undefined : (
              <>
                Stai per sospendere{" "}
                <span className="font-semibold text-[#1f2b20]">{selectedCount}</span>{" "}
                {selectedCount === 1 ? "venditore" : "venditori"}. Potrai gestire lo
                stato dal profilo di ciascuno.
              </>
            )
          }
          confirmLabel="Sospendi"
          onConfirm={() => {
            clear();
          }}
        />

        <section className="mt-4">
          <VendorsTable
            rows={rows}
            onRemove={(row) =>
              setRows((prev) => prev.filter((r) => r.id !== row.id))
            }
          />
        </section>
      </div>
    </>
  );
}

