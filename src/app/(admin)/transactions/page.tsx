"use client";

import { Eye, MoreVertical, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { parseRegisteredAtItalian } from "@/lib/end-user-registration-filter";

type GlobalTxStatus = "Completato" | "Rimborsato" | "In Sospeso" | "Stornato";

function GlobalTxStatusPill({ status }: { status: GlobalTxStatus }) {
  const cls =
    status === "Completato"
      ? "bg-[#e7f6ea] text-[#38A169]"
      : status === "Rimborsato"
        ? "bg-[#FEF3C7] text-[#D69E2E]"
        : status === "In Sospeso"
          ? "bg-[#fff7ed] text-[#D69E2E]"
          : "bg-[#fdecec] text-[#E53E3E]";
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold ${cls}`}
    >
      {status}
    </span>
  );
}

type GlobalTransaction = {
  id: string;
  txId: string;
  date: string;
  time: string;
  vendor: { name: string; email: string };
  customer: { name: string; email: string };
  amount: string;
  amountSub?: string;
  amountSubTone?: "muted" | "red";
  amountStrike?: boolean;
  commission: string;
  commissionPct?: string;
  net: string;
  commissionStrike?: boolean;
  netTone?: "muted" | "red";
  status: GlobalTxStatus;
  provider: string;
};

const TRANSACTIONS_DEMO: GlobalTransaction[] = [
  {
    id: "g1",
    txId: "#TX-99281-A",
    date: "15 Ott 2024",
    time: "14:32",
    vendor: { name: "Tech Store Milano", email: "info@techstoremilano.it" },
    customer: { name: "Marco Rossi", email: "m.rossi@email.it" },
    amount: "€249.99",
    amountSub: "EUR",
    amountSubTone: "muted",
    commission: "€25.00",
    commissionPct: "(10%)",
    net: "Netto: €224.99",
    status: "Completato",
    provider: "Klarna (3 Rate)",
  },
  {
    id: "g2",
    txId: "#TX-99280-B",
    date: "15 Ott 2024",
    time: "11:15",
    vendor: { name: "Fashion Boutique Roma", email: "info@techstoremilano.it" },
    customer: { name: "Giulia Bianchi", email: "giulia.b@email.it" },
    amount: "€89.50",
    amountStrike: true,
    amountSub: "-€89.50",
    amountSubTone: "red",
    commission: "€8.95",
    commissionStrike: true,
    net: "Stornata",
    netTone: "red",
    status: "Rimborsato",
    provider: "Klarna (3 Rate)",
  },
  {
    id: "g3",
    txId: "#TX-99279-C",
    date: "14 Ott 2024",
    time: "18:45",
    vendor: { name: "EcoLiving Shop", email: "info@techstoremilano.it" },
    customer: { name: "Hans Mueller", email: "h.mueller@email.de" },
    amount: "€450.00",
    amountSub: "EUR",
    amountSubTone: "muted",
    commission: "€36.00",
    commissionPct: "(8%)",
    net: "Netto: €414.00",
    status: "Completato",
    provider: "Klarna (3 Rate)",
  },
  {
    id: "g4",
    txId: "#TX-99278-D",
    date: "14 Ott 2024",
    time: "09:12",
    vendor: { name: "Tech Store Milano", email: "info@techstoremilano.it" },
    customer: { name: "Luca Verdi", email: "l.verdi@email.it" },
    amount: "€1,299.00",
    amountSub: "EUR",
    amountSubTone: "muted",
    commission: "—",
    net: "—",
    netTone: "muted",
    status: "In Sospeso",
    provider: "Stripe",
  },
  {
    id: "g5",
    txId: "#TX-99277-E",
    date: "13 Ott 2024",
    time: "16:20",
    vendor: { name: "Sport & Co", email: "info@techstoremilano.it" },
    customer: { name: "Sara Neri", email: "s.neri@email.it" },
    amount: "€120.00",
    amountSub: "EUR",
    amountSubTone: "muted",
    commission: "€14.40",
    commissionPct: "(12%)",
    net: "Netto: €105.60",
    status: "Completato",
    provider: "Klarna (Pago Ora)",
  },
  {
    id: "g6",
    txId: "#TX-99277-E",
    date: "13 Ott 2024",
    time: "16:20",
    vendor: { name: "Sport & Co", email: "info@techstoremilano.it" },
    customer: { name: "Sara Neri", email: "s.neri@email.it" },
    amount: "€120.00",
    amountSub: "EUR",
    amountSubTone: "muted",
    commission: "€14.40",
    commissionPct: "(12%)",
    net: "Netto: €105.60",
    status: "Completato",
    provider: "Klarna (Pago Ora)",
  },
  {
    id: "g7",
    txId: "#TX-99277-E",
    date: "13 Ott 2024",
    time: "16:20",
    vendor: { name: "Sport & Co", email: "info@techstoremilano.it" },
    customer: { name: "Sara Neri", email: "s.neri@email.it" },
    amount: "€120.00",
    amountSub: "EUR",
    amountSubTone: "muted",
    commission: "€14.40",
    commissionPct: "(12%)",
    net: "Netto: €105.60",
    status: "Completato",
    provider: "Klarna (Pago Ora)",
  },
  {
    id: "g8",
    txId: "#TX-99277-E",
    date: "13 Ott 2024",
    time: "16:20",
    vendor: { name: "Sport & Co", email: "info@techstoremilano.it" },
    customer: { name: "Sara Neri", email: "s.neri@email.it" },
    amount: "€120.00",
    amountSub: "EUR",
    amountSubTone: "muted",
    commission: "€14.40",
    commissionPct: "(12%)",
    net: "Netto: €105.60",
    status: "Completato",
    provider: "Klarna (Pago Ora)",
  },
];

function filterByItalianDateLast30Days<T extends { date: string }>(rows: T[]): T[] {
  const withDates = rows
    .map((r) => ({ r, d: parseRegisteredAtItalian(r.date) }))
    .filter((x): x is { r: T; d: Date } => x.d !== null);
  if (withDates.length === 0) return rows;
  const maxT = Math.max(...withDates.map((x) => x.d.getTime()));
  const cutoff = maxT - 30 * 24 * 60 * 60 * 1000;
  return rows.filter((r) => {
    const d = parseRegisteredAtItalian(r.date);
    return d !== null && d.getTime() >= cutoff;
  });
}

export default function TransactionsPage() {
  const [allRows, setAllRows] = useState<GlobalTransaction[]>(() => TRANSACTIONS_DEMO);
  const [last30Active, setLast30Active] = useState(true);
  const [removeTarget, setRemoveTarget] = useState<GlobalTransaction | null>(null);
  const [forceRefundOpen, setForceRefundOpen] = useState(false);
  const rows = useMemo(
    () => (last30Active ? filterByItalianDateLast30Days(allRows) : allRows),
    [allRows, last30Active],
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const masterRef = useRef<HTMLInputElement | null>(null);
  const selectedCount = selectedIds.size;

  const allChecked = rows.length > 0 && rows.every((r) => selectedIds.has(r.id));
  const someChecked =
    rows.some((r) => selectedIds.has(r.id)) && !allChecked;

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
      <Topbar title="Transazioni e vendite globali" />

      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <ConfirmationModal
          open={removeTarget !== null}
          onClose={() => setRemoveTarget(null)}
          title="Rimuovere questa transazione?"
          description={
            removeTarget ? (
              <>
                La transazione{" "}
                <span className="font-semibold text-[#1f2b20]">{removeTarget.txId}</span>{" "}
                verrà rimossa dall&apos;elenco (solo visualizzazione demo).
              </>
            ) : undefined
          }
          confirmLabel="Rimuovi"
          onConfirm={() => {
            if (!removeTarget) return;
            const id = removeTarget.id;
            setAllRows((prev) => prev.filter((r) => r.id !== id));
            setSelectedIds((prev) => {
              const next = new Set(prev);
              next.delete(id);
              return next;
            });
          }}
        />

        <ConfirmationModal
          open={forceRefundOpen}
          onClose={() => setForceRefundOpen(false)}
          title="Forzare rimborso?"
          description={
            selectedCount === 0 ? undefined : (
              <>
                Stai per forzare il rimborso di{" "}
                <span className="font-semibold text-[#1f2b20]">
                  {selectedCount}
                </span>{" "}
                transazioni selezionate. Confermi?
              </>
            )
          }
          confirmLabel="Forza rimborso"
          onConfirm={() => {
            if (selectedCount === 0) return;
            const ids = new Set(selectedIds);
            setAllRows((prev) =>
              prev.map((r) =>
                ids.has(r.id) ? { ...r, status: "Rimborsato" } : r,
              ),
            );
            setSelectedIds(new Set());
          }}
        />

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "GMV", value: "€1,245,680.00", tone: "text-[#1f2b20]" },
            {
              label: "Commissioni piattaforma",
              value: "€112,450.50",
              tone: "text-[#1f2b20]",
            },
            {
              label: "Netto venditori",
              value: "€1,095,829.50",
              tone: "text-[#1f2b20]",
            },
            {
              label: "Rimborsi & storni",
              value: "€37,400.00",
              tone: "text-[#E53E3E]",
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
            <button
              type="button"
              className="inline-flex h-7 items-center justify-center rounded-lg border border-black/10 bg-white px-4 text-[11px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-black/5"
            >
              Tutti i provider
            </button>
          </div>

          {last30Active ? (
            <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-[#6b746c]">
              <span className="text-[#9aa39a]">Filtri attivi:</span>
              <button
                type="button"
                onClick={() => setLast30Active(false)}
                aria-label="Rimuovi filtro Ultimi 30 giorni"
                className="inline-flex items-center gap-2 rounded-full bg-[#f2f4f2] px-3 py-1 text-[10px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-[#e8ebe8]"
              >
                Ultimi 30 giorni <span className="text-[#9aa39a]">×</span>
              </button>
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
                checked={allChecked}
                onChange={(e) => toggleAll(e.target.checked)}
              />
              Seleziona tutti (342)
            </label>

            <button
              type="button"
              disabled={selectedCount === 0}
              onClick={() => setForceRefundOpen(true)}
              className={`inline-flex h-7 items-center justify-center rounded-lg border px-4 text-[11px] font-semibold ${
                selectedCount === 0
                  ? "cursor-not-allowed border-[#fecaca] bg-[#fdecec] text-[#e1a2a2]"
                  : "border-[#f3c2c2] bg-white text-[#E53E3E] hover:cursor-pointer hover:bg-[#fdecec]"
              }`}
            >
              Forza rimborso
            </button>
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
          <div className="px-6 py-4">
            <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
              STORICO TRANSAZIONI
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
                  <th className="py-4 pr-4">
                    <span className="inline-flex items-center gap-1">
                      ID &amp; DATA <span className="text-[#9aa39a]">↓</span>
                    </span>
                  </th>
                  <th className="py-4 pr-4">VENDITORE</th>
                  <th className="py-4 pr-4">CLIENTE</th>
                  <th className="py-4 pr-4 text-right">IMPORTO TOT.</th>
                  <th className="py-4 pr-4 text-right">COMM. (NETTO)</th>
                  <th className="py-4 pr-4 text-center">STATO &amp; PROVIDER</th>
                  <th className="w-[92px] px-5 py-4 text-right">AZIONI</th>
                </tr>
              </thead>

              <tbody className="text-[12px] text-[#1f2b20]">
                {rows.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-black/5 transition-colors hover:bg-black/[0.02]"
                  >
                    <td className="w-[44px] px-5 py-5 align-middle">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-black/10"
                        checked={selectedIds.has(t.id)}
                        onChange={() => toggleOne(t.id)}
                        aria-label={`Seleziona ${t.txId}`}
                      />
                    </td>

                    <td className="py-5 pr-4 align-middle">
                      <div className="text-[11px] font-semibold">{t.txId}</div>
                      <div className="mt-1 text-[10px] font-medium text-[#9aa39a]">
                        {t.date}, {t.time}
                      </div>
                    </td>

                    <td className="py-5 pr-4 align-middle">
                      <div className="text-[11px] font-semibold">
                        {t.vendor.name}
                      </div>
                      <div className="mt-1 text-[10px] font-medium text-[#9aa39a]">
                        {t.vendor.email}
                      </div>
                    </td>

                    <td className="py-5 pr-4 align-middle">
                      <div className="text-[11px] font-semibold">
                        {t.customer.name}
                      </div>
                      <div className="mt-1 text-[10px] font-medium text-[#9aa39a]">
                        {t.customer.email}
                      </div>
                    </td>

                    <td className="py-5 pr-4 align-middle text-right">
                      <div
                        className={`text-[11px] font-semibold ${
                          t.amountStrike ? "text-[#9aa39a] line-through" : ""
                        }`}
                      >
                        {t.amount}
                      </div>
                      {t.amountSub ? (
                        <div
                          className={`mt-1 text-[10px] font-semibold ${
                            t.amountSubTone === "red"
                              ? "text-[#E53E3E]"
                              : "text-[#9aa39a]"
                          }`}
                        >
                          {t.amountSub}
                        </div>
                      ) : null}
                    </td>

                    <td className="py-5 pr-4 align-middle text-right">
                      <div
                        className={`inline-flex items-baseline justify-end gap-1 text-[11px] font-semibold ${
                          t.commissionStrike
                            ? "text-[#9aa39a] line-through"
                            : t.commission === "—"
                              ? "text-[#9aa39a]"
                              : "text-[#E53E3E]"
                        }`}
                      >
                        <span>{t.commission}</span>
                        {t.commissionPct ? (
                          <span className="text-[10px] font-medium text-[#6b746c]">
                            {t.commissionPct}
                          </span>
                        ) : null}
                      </div>
                      <div
                        className={`mt-1 text-[10px] font-medium ${
                          t.netTone === "red"
                            ? "text-[#E53E3E]"
                            : t.netTone === "muted"
                              ? "text-[#9aa39a]"
                              : "text-[#38A169]"
                        }`}
                      >
                        {t.net}
                      </div>
                    </td>

                    <td className="py-5 pr-4 align-middle text-center">
                      <div className="flex flex-col items-center gap-1">
                        <GlobalTxStatusPill status={t.status} />
                        <span className="text-[10px] font-medium text-[#9aa39a]">
                          {t.provider}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-5 align-middle">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/transactions/${encodeURIComponent(t.id)}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-[#6b746c] hover:cursor-pointer hover:bg-black/5"
                          aria-label={`Vedi ${t.txId}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <DropdownMenu
                          align="right"
                          items={[
                            {
                              label: "Rimuovi",
                              danger: true,
                              icon: <Trash2 className="h-3.5 w-3.5" />,
                              onClick: () => setRemoveTarget(t),
                            },
                          ]}
                        >
                          <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-[#6b746c] hover:cursor-pointer hover:bg-black/5"
                            aria-label="Altro"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </DropdownMenu>
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
