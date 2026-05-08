"use client";

import { Eye, MoreVertical, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Topbar } from "@/components/layout/Topbar";

type ReconciliationStatus = "Matched" | "Unmatched" | "Parziale";

function ReconciliationStatusPill({
  status,
}: {
  status: ReconciliationStatus;
}) {
  const cls =
    status === "Matched"
      ? "bg-[#e7f6ea] text-[#38A169]"
      : status === "Unmatched"
        ? "bg-[#fdecec] text-[#E53E3E]"
        : "bg-[#FEF3C7] text-[#D69E2E]";
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold ${cls}`}
    >
      {status}
    </span>
  );
}

function ProviderPill({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#fdecec] px-3 py-1 text-[10px] font-semibold text-[#E53E3E]">
      {name}
    </span>
  );
}

type PayoutRow = {
  id: string;
  payoutId: string;
  date: string;
  time: string;
  vendor: { name: string; id: string };
  provider: string;
  importoProvider: string;
  importoSistema: string;
  delta: string;
  deltaTone: "neutral" | "red";
  status: ReconciliationStatus;
};

const PAYOUTS_DEMO: PayoutRow[] = [
  {
    id: "p1",
    payoutId: "PO-99281",
    date: "15 Ott 2024",
    time: "14:30",
    vendor: { name: "Tech Store Milano", id: "VND-001" },
    provider: "Klarna",
    importoProvider: "€1,245.50",
    importoSistema: "€1,245.50",
    delta: "€0.00",
    deltaTone: "neutral",
    status: "Matched",
  },
  {
    id: "p2",
    payoutId: "PO-99282",
    date: "15 Ott 2024",
    time: "12:15",
    vendor: { name: "Moda Boutique", id: "VND-042" },
    provider: "Klarna",
    importoProvider: "€850.00",
    importoSistema: "€855.50",
    delta: "-€5.50",
    deltaTone: "red",
    status: "Unmatched",
  },
  {
    id: "p3",
    payoutId: "PO-99283",
    date: "14 Ott 2024",
    time: "09:00",
    vendor: { name: "Sport & Co", id: "VND-018" },
    provider: "Klarna",
    importoProvider: "€2,100.00",
    importoSistema: "€2,100.25",
    delta: "-€0.25",
    deltaTone: "red",
    status: "Parziale",
  },
  {
    id: "p4",
    payoutId: "PO-99284",
    date: "14 Ott 2024",
    time: "08:30",
    vendor: { name: "Home Decor", id: "VND-102" },
    provider: "Klarna",
    importoProvider: "€450.00",
    importoSistema: "€450.00",
    delta: "€0.00",
    deltaTone: "neutral",
    status: "Matched",
  },
  {
    id: "p5",
    payoutId: "PO-99284",
    date: "14 Ott 2024",
    time: "08:30",
    vendor: { name: "Home Decor", id: "VND-102" },
    provider: "Klarna",
    importoProvider: "€450.00",
    importoSistema: "€450.00",
    delta: "€0.00",
    deltaTone: "neutral",
    status: "Matched",
  },
  {
    id: "p6",
    payoutId: "PO-99284",
    date: "14 Ott 2024",
    time: "08:30",
    vendor: { name: "Home Decor", id: "VND-102" },
    provider: "Klarna",
    importoProvider: "€450.00",
    importoSistema: "€450.00",
    delta: "€0.00",
    deltaTone: "neutral",
    status: "Matched",
  },
  {
    id: "p7",
    payoutId: "PO-99284",
    date: "14 Ott 2024",
    time: "08:30",
    vendor: { name: "Home Decor", id: "VND-102" },
    provider: "Klarna",
    importoProvider: "€450.00",
    importoSistema: "€450.00",
    delta: "€0.00",
    deltaTone: "neutral",
    status: "Matched",
  },
  {
    id: "p8",
    payoutId: "PO-99284",
    date: "14 Ott 2024",
    time: "08:30",
    vendor: { name: "Home Decor", id: "VND-102" },
    provider: "Klarna",
    importoProvider: "€450.00",
    importoSistema: "€450.00",
    delta: "€0.00",
    deltaTone: "neutral",
    status: "Matched",
  },
];

function rowTint(status: ReconciliationStatus) {
  if (status === "Unmatched") return "bg-[#fdecec]/30";
  if (status === "Parziale") return "bg-[#FEF3C7]/30";
  return "";
}

export default function ReconciliationPage() {
  const rows = useMemo(() => PAYOUTS_DEMO, []);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const masterRef = useRef<HTMLInputElement | null>(null);

  const allChecked = rows.length > 0 && rows.every((r) => selectedIds.has(r.id));
  const someChecked = rows.some((r) => selectedIds.has(r.id)) && !allChecked;

  useEffect(() => {
    if (!masterRef.current) return;
    masterRef.current.indeterminate = someChecked;
  }, [someChecked]);

  function toggleAll(checked: boolean) {
    setSelectedIds(checked ? new Set(rows.map((r) => r.id)) : new Set());
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <>
      <Topbar title="Bonifici e riconciliazione" />

      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Totale payout (30gg)",
              value: "€124,500.00",
              tone: "text-[#1f2b20]",
            },
            {
              label: "Da riconciliare",
              value: "€12,450.00",
              tone: "text-[#D69E2E]",
            },
            {
              label: "Anomalie rilevate",
              value: "3",
              tone: "text-[#E53E3E]",
            },
            {
              label: "Tasso riconciliazione",
              value: "98.5%",
              tone: "text-[#38A169]",
            },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-xl border border-black/10 bg-white px-5 py-4 shadow-sm"
            >
              <div className="text-[11px] font-medium text-[#6b746c]">
                {k.label}
              </div>
              <div className={`mt-2 text-[18px] font-semibold ${k.tone}`}>
                {k.value}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-4 rounded-xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_auto_auto] lg:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa39a]" />
              <input
                placeholder="Cerca transazione per ID, data, cliente..."
                className="h-7 w-full rounded-lg border border-black/10 bg-white pl-11 pr-4 text-[12px] font-medium text-[#1f2b20] outline-none placeholder:text-[#c0c6c0] focus:border-[#5DBE54] focus:ring-4 focus:ring-[#5DBE54]/15"
              />
            </div>
            <button
              type="button"
              className="inline-flex h-7 items-center justify-center rounded-lg border border-black/10 bg-white px-4 text-[11px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-black/5"
            >
              Ultimi 30 giorni
            </button>
            <button
              type="button"
              className="inline-flex h-7 items-center justify-center rounded-lg border border-black/10 bg-white px-4 text-[11px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-black/5"
            >
              Tutti gli stati
            </button>
            <button
              type="button"
              className="inline-flex h-7 items-center justify-center rounded-lg border border-black/10 bg-white px-4 text-[11px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-black/5"
            >
              Tutti i provider
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-[#6b746c]">
            <span className="text-[#9aa39a]">Filtri attivi:</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f2f4f2] px-3 py-1 text-[10px] font-semibold text-[#1f2b20]">
              Ultimi 30 giorni <span className="text-[#9aa39a]">×</span>
            </span>
            <button
              type="button"
              className="text-[10px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:underline"
            >
              Cancella tutti
            </button>
          </div>
        </section>

        <section className="mt-4 rounded-xl border border-black/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <label className="inline-flex items-center gap-3 text-[11px] font-semibold text-[#1f2b20]">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-black/10"
                checked={allChecked}
                onChange={(e) => toggleAll(e.target.checked)}
              />
              Seleziona tutti (342)
            </label>

            <button
              type="button"
              className="inline-flex h-7 items-center justify-center rounded-lg border border-[#f3c2c2] bg-white px-4 text-[11px] font-semibold text-[#E53E3E] hover:cursor-pointer hover:bg-[#fdecec]"
            >
              Riconcilia selezionati
            </button>
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
          <div className="px-6 py-4">
            <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
              STORICO BONIFICI
            </div>
          </div>
          <div className="h-px w-full bg-black/5" />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left">
              <thead className="bg-[#f6f7f6] text-[10px] font-semibold tracking-wide text-[#9aa39a]">
                <tr className="border-b border-black/5">
                  <th className="w-[44px] px-5 py-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-black/10"
                      checked={allChecked}
                      ref={masterRef}
                      onChange={(e) => toggleAll(e.target.checked)}
                      aria-label="Seleziona tutti"
                    />
                  </th>
                  <th className="py-4 pr-4">ID PAYOUT / DATA</th>
                  <th className="py-4 pr-4">VENDITORE</th>
                  <th className="py-4 pr-4">PROVIDER</th>
                  <th className="py-4 pr-4 text-right">IMPORTO PROVIDER</th>
                  <th className="py-4 pr-4 text-right">IMPORTO SISTEMA</th>
                  <th className="py-4 pr-4 text-right">DELTA</th>
                  <th className="py-4 pr-4 text-center">STATO</th>
                  <th className="w-[92px] px-5 py-4 text-right">AZIONI</th>
                </tr>
              </thead>

              <tbody className="text-[12px] text-[#1f2b20]">
                {rows.map((r) => (
                  <tr
                    key={r.id}
                    className={`border-b border-black/5 transition-colors ${rowTint(r.status)} hover:bg-black/[0.02]`}
                  >
                    <td className="w-[44px] px-5 py-5 align-middle">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-black/10"
                        checked={selectedIds.has(r.id)}
                        onChange={() => toggleOne(r.id)}
                        aria-label={`Seleziona ${r.payoutId}`}
                      />
                    </td>

                    <td className="py-5 pr-4 align-middle">
                      <div className="text-[11px] font-semibold">
                        {r.payoutId}
                      </div>
                      <div className="mt-1 text-[10px] font-medium text-[#9aa39a]">
                        {r.date}, {r.time}
                      </div>
                    </td>

                    <td className="py-5 pr-4 align-middle">
                      <div className="text-[11px] font-semibold">
                        {r.vendor.name}
                      </div>
                      <div className="mt-1 text-[10px] font-medium text-[#9aa39a]">
                        ID: {r.vendor.id}
                      </div>
                    </td>

                    <td className="py-5 pr-4 align-middle">
                      <ProviderPill name={r.provider} />
                    </td>

                    <td className="py-5 pr-4 align-middle text-right text-[11px] font-semibold">
                      {r.importoProvider}
                    </td>

                    <td className="py-5 pr-4 align-middle text-right text-[11px] font-semibold">
                      {r.importoSistema}
                    </td>

                    <td
                      className={`py-5 pr-4 align-middle text-right text-[11px] font-semibold ${
                        r.deltaTone === "red"
                          ? "text-[#E53E3E]"
                          : "text-[#1f2b20]"
                      }`}
                    >
                      {r.delta}
                    </td>

                    <td className="py-5 pr-4 align-middle text-center">
                      <ReconciliationStatusPill status={r.status} />
                    </td>

                    <td className="px-5 py-5 align-middle">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/reconciliation/${encodeURIComponent(r.id)}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-[#6b746c] hover:cursor-pointer hover:bg-black/5"
                          aria-label={`Vedi ${r.payoutId}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-[#6b746c] hover:cursor-pointer hover:bg-black/5"
                          aria-label="Altro"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end gap-2 px-5 py-4">
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-[#6b746c] hover:cursor-pointer hover:bg-black/5"
              aria-label="Pagina precedente"
            >
              ‹
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                type="button"
                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-[11px] font-semibold hover:cursor-pointer ${
                  p === 1
                    ? "bg-[#214e3a] text-white"
                    : "border border-black/10 bg-white text-[#1f2b20] hover:bg-black/5"
                }`}
                aria-label={`Pagina ${p}`}
              >
                {p}
              </button>
            ))}
            <div className="px-1 text-[12px] font-semibold text-[#9aa39a]">…</div>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-[11px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-black/5"
              aria-label="Pagina 69"
            >
              69
            </button>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-[#6b746c] hover:cursor-pointer hover:bg-black/5"
              aria-label="Pagina successiva"
            >
              ›
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
