"use client";

import {
  Ban,
  ChevronDown,
  ChevronRight,
  Copy,
  Eye,
  Mail,
  MoreVertical,
  Search,
  ShieldAlert,
  ShieldCheck,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { use, useMemo, useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { StatusPill } from "@/components/vendors/StatusPill";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { getVendorDemoById } from "@/lib/vendors-demo";

function StatCard({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-xl border border-black/10 bg-white px-5 py-4 shadow-sm">
      <div className="text-[10px] font-semibold text-[#9aa39a]">{label}</div>
      <div
        className={`mt-2 text-[16px] font-semibold ${valueClassName ?? "text-[#1f2b20]"}`}
      >
        {value}
      </div>
    </div>
  );
}

function InfoItem({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold text-[#9aa39a]">{k}</div>
      <div className="mt-1 text-[11px] font-semibold text-[#1f2b20]">{v}</div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-[#e7f6ea] px-3 py-1 text-[10px] font-semibold text-[#38A169]">
      {children}
    </span>
  );
}

type ProductStatus = "ATTIVO" | "ESAURITO" | "SOSPESO";

type ProductRow = {
  id: string;
  status: ProductStatus;
  statusSince: string;
  title: string;
  asin: string;
  sku: string;
  variantsText: string;
  todaySales: string;
  todayUnits: number;
  todayViews: number;
  available: number;
  reorder: number;
  price: string;
  commission: string;
};

function ProductStatusCell({
  status,
  since,
}: {
  status: ProductStatus;
  since: string;
}) {
  const tone =
    status === "ATTIVO"
      ? "text-[#38A169]"
      : status === "SOSPESO"
        ? "text-[#D69E2E]"
        : "text-[#E53E3E]";

  return (
    <div className="flex flex-col gap-1">
      <div className={`text-[10px] font-semibold ${tone}`}>{status}</div>
      <span className="text-[10px] font-medium text-[#9aa39a]">{since}</span>
    </div>
  );
}

function Metric({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2 text-[10px]">
      <span className="font-medium text-[#9aa39a]">{label}:</span>
      <span className={`font-semibold ${valueClassName ?? "text-[#1f2b20]"}`}>
        {value}
      </span>
    </div>
  );
}

const DEMO_PRODUCT_ROWS: ProductRow[] = [
  {
    id: "p1",
    status: "ATTIVO",
    statusSince: "Dal: 12 Gen 2024",
    title: "Cuffie Wireless Pro – Cancellazione Rumore Attiva",
    asin: "B0DK7V5NXL",
    sku: "3R-9921-BLK",
    variantsText: "+3 Varianti",
    todaySales: "€9,796.00",
    todayUnits: 124,
    todayViews: 3420,
    available: 20,
    reorder: 10,
    price: "€79.00",
    commission: "10%",
  },
  {
    id: "p2",
    status: "ESAURITO",
    statusSince: "Da: 20 Mar 2024",
    title: "Macchina Caffè Barista Pro – Doppia Caldaia",
    asin: "B0J8R4KZLM",
    sku: "3R-1020-SS",
    variantsText: "+2 Varianti",
    todaySales: "€35,168.00",
    todayUnits: 32,
    todayViews: 1205,
    available: 0,
    reorder: 0,
    price: "€110.00",
    commission: "10%",
  },
  {
    id: "p3",
    status: "ATTIVO",
    statusSince: "Dal: 05 Feb 2024",
    title: "Laptop UltraBook 15\" – Intel i7 16GB RAM",
    asin: "B0CKR8WNP5",
    sku: "3R-5543-SLV",
    variantsText: "+1 Variante",
    todaySales: "€42,350.00",
    todayUnits: 45,
    todayViews: 2890,
    available: 8,
    reorder: 5,
    price: "€940.00",
    commission: "10%",
  },
  {
    id: "p4",
    status: "ATTIVO",
    statusSince: "Dal: 21 Mar 2024",
    title: "Tastiera Meccanica RGB Gaming – Switch Blue",
    asin: "B0CLP2Q2AR",
    sku: "3R-7788-RGB",
    variantsText: "+0 Varianti",
    todaySales: "€0.00",
    todayUnits: 0,
    todayViews: 0,
    available: 20,
    reorder: 0,
    price: "€129.00",
    commission: "10%",
  },
  {
    id: "p5",
    status: "ATTIVO",
    statusSince: "Dal: 02 Feb 2024",
    title: "Mouse Wireless Ergonomico – 6 Pulsanti",
    asin: "B0H9W9N9NM",
    sku: "3R-3321-BLK",
    variantsText: "+0 Varianti",
    todaySales: "€5,480.00",
    todayUnits: 137,
    todayViews: 4320,
    available: 45,
    reorder: 15,
    price: "€39.99",
    commission: "10%",
  },
];

function ProductsTab({ totalText }: { totalText: string }) {
  const [rows, setRows] = useState<ProductRow[]>(() => DEMO_PRODUCT_ROWS);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [bulkSuspendOpen, setBulkSuspendOpen] = useState(false);
  const [singleRemoveTarget, setSingleRemoveTarget] = useState<ProductRow | null>(
    null,
  );
  const [singleSuspendTarget, setSingleSuspendTarget] = useState<ProductRow | null>(
    null,
  );
  const selectedCount = useMemo(
    () => Object.values(selected).filter(Boolean).length,
    [selected],
  );
  const allChecked = selectedCount > 0 && selectedCount === rows.length;
  const someChecked = selectedCount > 0 && selectedCount < rows.length;

  return (
    <>
      <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Prodotti totali" value={totalText} />
        <StatCard label="Prodotti attivi" value="318" valueClassName="text-[#38A169]" />
        <StatCard label="Esauriti" value="12" valueClassName="text-[#E53E3E]" />
        <StatCard label="Valore inventario" value="€89.2K" />
      </section>

      <section className="mt-4 rounded-xl border border-black/10 bg-white px-4 py-3 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative w-full lg:flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa39a]" />
            <input
              placeholder="Cerca per nome, SKU, ASIN…"
              className="h-7 w-full rounded-lg border border-black/10  pl-10 pr-3 text-[11px] font-medium text-[#1f2b20] outline-none placeholder:text-[#9aa39a] focus:border-black/20"
            />
          </div>

          <button
            type="button"
            className="inline-flex h-7 items-center justify-center gap-2 rounded-lg border border-black/10  px-4 text-[11px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-black/[0.03] lg:w-[170px]"
          >
            Tutti gli stati
          </button>
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-black/10 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 px-6 py-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-black/10"
              checked={allChecked}
              ref={(el) => {
                if (!el) return;
                el.indeterminate = someChecked;
              }}
              onChange={(e) => {
                const next: Record<string, boolean> = {};
                if (e.target.checked) {
                  rows.forEach((r) => {
                    next[r.id] = true;
                  });
                }
                setSelected(next);
              }}
              aria-label="Seleziona tutti"
            />
            <div className="text-[11px] font-semibold text-[#1f2b20]">
              Seleziona tutti ({totalText})
            </div>
          </div>

          <button
            type="button"
            disabled={selectedCount === 0}
            onClick={() => setBulkSuspendOpen(true)}
            className={`inline-flex h-7 items-center justify-center rounded-lg border px-3 text-[11px] font-semibold ${
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
        open={bulkSuspendOpen}
        onClose={() => setBulkSuspendOpen(false)}
        title="Sospendere i prodotti selezionati?"
        description={
          selectedCount === 0 ? undefined : (
            <>
              Stai per sospendere{" "}
              <span className="font-semibold text-[#1f2b20]">{selectedCount}</span>{" "}
              {selectedCount === 1 ? "prodotto" : "prodotti"}. Non saranno più visibili
              fino a riattivazione.
            </>
          )
        }
        confirmLabel="Sospendi"
        onConfirm={() => {
          const ids = Object.entries(selected)
            .filter(([, v]) => v)
            .map(([id]) => id);
          setRows((prev) =>
            prev.map((r) =>
              ids.includes(r.id) && r.status === "ATTIVO"
                ? { ...r, status: "SOSPESO", statusSince: "Da: oggi" }
                : r,
            ),
          );
          setSelected({});
        }}
      />

      <ConfirmationModal
        open={singleRemoveTarget !== null}
        onClose={() => setSingleRemoveTarget(null)}
        title="Rimuovere questo prodotto?"
        description={
          singleRemoveTarget ? (
            <>
              <span className="font-semibold text-[#1f2b20]">
                {singleRemoveTarget.title}
              </span>{" "}
              verrà rimosso dall&apos;elenco del venditore.
            </>
          ) : undefined
        }
        confirmLabel="Rimuovi"
        onConfirm={() => {
          if (!singleRemoveTarget) return;
          const id = singleRemoveTarget.id;
          setRows((prev) => prev.filter((r) => r.id !== id));
          setSelected((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
        }}
      />

      <ConfirmationModal
        open={singleSuspendTarget !== null}
        onClose={() => setSingleSuspendTarget(null)}
        title="Sospendere questo prodotto?"
        description={
          singleSuspendTarget ? (
            <>
              <span className="font-semibold text-[#1f2b20]">
                {singleSuspendTarget.title}
              </span>{" "}
              non sarà visibile nel marketplace fino alla riattivazione.
            </>
          ) : undefined
        }
        confirmLabel="Sospendi"
        onConfirm={() => {
          if (!singleSuspendTarget) return;
          const id = singleSuspendTarget.id;
          setRows((prev) =>
            prev.map((r) =>
              r.id === id && r.status === "ATTIVO"
                ? { ...r, status: "SOSPESO", statusSince: "Da: oggi" }
                : r,
            ),
          );
        }}
      />

      <section className="mt-3 rounded-xl border border-black/10 bg-white shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[980px]">
            <thead>
              <tr className="bg-[#f6f7f6] text-left text-[10px] font-semibold text-[#6b746c]">
                <th className="w-[44px] px-6 py-3">
                  <span className="sr-only">Seleziona</span>
                </th>
                <th className="w-[120px] px-2 py-3">STATO</th>
                <th className="px-2 py-3">DETTAGLI PRODOTTO</th>
                <th className="w-[170px] px-2 py-3">PERFORMANCE (OGGI)</th>
                <th className="w-[150px] px-2 py-3">INVENTARIO</th>
                <th className="w-[150px] px-2 py-3">PREZZO &amp; SPEDIZIONE</th>
                <th className="w-[84px] px-6 py-3 text-right">AZIONI</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const checked = Boolean(selected[r.id]);
                return (
                  <tr
                    key={r.id}
                    className="border-t border-black/5 text-[11px] hover:bg-black/[0.02]"
                  >
                    <td className="px-6 py-4 align-top">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-black/10"
                        checked={checked}
                        onChange={() =>
                          setSelected((prev) => ({ ...prev, [r.id]: !checked }))
                        }
                        aria-label={`Seleziona ${r.title}`}
                      />
                    </td>
                    <td className="px-2 py-4 align-top">
                      <ProductStatusCell status={r.status} since={r.statusSince} />
                    </td>
                    <td className="px-2 py-4 align-top">
                      <div className="font-semibold text-[#1f2b20]">{r.title}</div>
                      <div className="mt-1 flex flex-wrap gap-x-6 gap-y-1 text-[10px] font-medium text-[#9aa39a]">
                        <span>
                          ASIN: <span className="text-[#6b746c]">{r.asin}</span>
                        </span>
                        <span>
                          SKU: <span className="text-[#6b746c]">{r.sku}</span>
                        </span>
                      </div>
                      <button
                        type="button"
                        className="mt-2 inline-flex items-center rounded-sm  bg-[#f6f7f6] px-2 py-1 text-[10px] font-semibold text-[#6b746c] hover:cursor-pointer hover:bg-black/[0.03]"
                      >
                        {r.variantsText}
                      </button>
                    </td>
                    <td className="px-2 py-4 align-top">
                      <div className="space-y-1">
                        <Metric label="Vendite" value={r.todaySales} />
                        <Metric label="Unità" value={r.todayUnits} />
                        <Metric label="Visite" value={r.todayViews} />
                      </div>
                    </td>
                    <td className="px-2 py-4 align-top">
                      <div className="space-y-1">
                        <Metric
                          label="Disponibili"
                          value={r.available}
                          valueClassName={
                            r.available === 0 ? "text-[#E53E3E]" : "text-[#38A169]"
                          }
                        />
                        <Metric
                          label="Soglia riordino"
                          value={r.reorder}
                          valueClassName="text-[#6b746c]"
                        />
                      </div>
                    </td>
                    <td className="px-2 py-4 align-top">
                      <div className="space-y-1">
                        <Metric label="Prezzo" value={r.price} />
                        <Metric label="Comm" value={r.commission} valueClassName="text-[#E53E3E]" />
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-[#6b746c] hover:cursor-pointer hover:bg-black/5"
                          aria-label="Vedi prodotto"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <DropdownMenu
                          align="right"
                          items={[
                            {
                              label: "Copia SKU",
                              icon: <Copy className="h-3.5 w-3.5" />,
                              onClick: () => {
                                void navigator.clipboard?.writeText(r.sku);
                              },
                            },
                            {
                              label: "Sospendi prodotto",
                              icon: <Ban className="h-3.5 w-3.5" />,
                              disabled: r.status !== "ATTIVO",
                              onClick: () => setSingleSuspendTarget(r),
                            },
                            {
                              label: "Rimuovi",
                              danger: true,
                              icon: <Trash2 className="h-3.5 w-3.5" />,
                              onClick: () => setSingleRemoveTarget(r),
                            },
                          ]}
                        >
                          <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-[#6b746c] hover:cursor-pointer hover:bg-black/5"
                            aria-label="Altre azioni"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-black/5 px-6 py-3 text-[11px] font-semibold text-[#6b746c]">
          <button
            type="button"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-black/10 bg-white hover:cursor-pointer hover:bg-black/5"
            aria-label="Pagina precedente"
          >
            ‹
          </button>
          <button
            type="button"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#214e3a] text-white hover:cursor-pointer"
          >
            1
          </button>
          <button
            type="button"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-black/10 bg-white hover:cursor-pointer hover:bg-black/5"
          >
            2
          </button>
          <button
            type="button"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-black/10 bg-white hover:cursor-pointer hover:bg-black/5"
          >
            3
          </button>
          <span className="px-1 text-[#9aa39a]">…</span>
          <button
            type="button"
            className="inline-flex h-7 min-w-10 items-center justify-center rounded-md border border-black/10 bg-white px-2 hover:cursor-pointer hover:bg-black/5"
          >
            69
          </button>
          <button
            type="button"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-black/10 bg-white hover:cursor-pointer hover:bg-black/5"
            aria-label="Pagina successiva"
          >
            ›
          </button>
        </div>
      </section>
    </>
  );
}

type TransactionStatus = "COMPLETATA" | "PENDING" | "RIMBORSATA" | "ANNULLATA";
type TransactionRow = {
  id: string;
  date: string;
  orderId: string;
  customer: string;
  items: number;
  gross: string;
  commission: string;
  net: string;
  method: string;
  status: TransactionStatus;
};

function TransactionStatusPill({ status }: { status: TransactionStatus }) {
  const cls =
    status === "COMPLETATA"
      ? "bg-[#e7f6ea] text-[#38A169]"
      : status === "PENDING"
        ? "bg-[#fff7ed] text-[#D69E2E]"
        : status === "RIMBORSATA"
          ? "bg-[#f2f4f2] text-[#6b746c]"
          : "bg-[#fdecec] text-[#E53E3E]";
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold ${cls}`}>
      {status}
    </span>
  );
}

function TransactionsTab() {
  const rows: TransactionRow[] = useMemo(
    () => [
      {
        id: "t1",
        date: "08 Mag 2026, 10:12",
        orderId: "ORD-1049812",
        customer: "Marco R.",
        items: 2,
        gross: "€189.00",
        commission: "€18.90",
        net: "€170.10",
        method: "Carta",
        status: "COMPLETATA",
      },
      {
        id: "t2",
        date: "08 Mag 2026, 09:41",
        orderId: "ORD-1049790",
        customer: "Giulia S.",
        items: 1,
        gross: "€39.99",
        commission: "€4.00",
        net: "€35.99",
        method: "PayPal",
        status: "PENDING",
      },
      {
        id: "t3",
        date: "07 Mag 2026, 18:05",
        orderId: "ORD-1049554",
        customer: "Luca B.",
        items: 3,
        gross: "€329.00",
        commission: "€32.90",
        net: "€296.10",
        method: "Bonifico",
        status: "COMPLETATA",
      },
      {
        id: "t4",
        date: "06 Mag 2026, 12:22",
        orderId: "ORD-1049011",
        customer: "Sara P.",
        items: 1,
        gross: "€110.00",
        commission: "€11.00",
        net: "€99.00",
        method: "Carta",
        status: "RIMBORSATA",
      },
      {
        id: "t5",
        date: "05 Mag 2026, 15:03",
        orderId: "ORD-1048620",
        customer: "Andrea V.",
        items: 1,
        gross: "€79.00",
        commission: "€7.90",
        net: "€71.10",
        method: "Carta",
        status: "ANNULLATA",
      },
    ],
    [],
  );

  return (
    <>
      <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Totale transazioni" value="1,248" />
        <StatCard label="Volume lordo" value="€128,440.55" />
        <StatCard label="Commissioni" value="€12,844.06" valueClassName="text-[#E53E3E]" />
        <StatCard label="Netto venditore" value="€115,596.49" valueClassName="text-[#38A169]" />
      </section>

      <section className="mt-4 rounded-xl border border-black/10 bg-white px-4 py-3 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative w-full lg:flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa39a]" />
            <input
              placeholder="Cerca per ID ordine, cliente…"
              className="h-7 w-full rounded-lg border border-black/10  pl-10 pr-3 text-[11px] font-medium text-[#1f2b20] outline-none placeholder:text-[#9aa39a] focus:border-black/20"
            />
          </div>

          <button
            type="button"
            className="inline-flex h-7 items-center justify-center gap-2 rounded-lg border border-black/10  px-4 text-[11px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-black/[0.03] lg:w-[170px]"
          >
            Tutti gli stati
          </button>

        </div>
      </section>

      <section className="mt-4 rounded-xl border border-black/10 bg-white shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[980px]">
            <thead>
              <tr className="bg-[#f6f7f6] text-left text-[10px] font-semibold text-[#6b746c]">
                <th className="w-[170px] px-6 py-3">DATA</th>
                <th className="w-[160px] px-2 py-3">ID ORDINE</th>
                <th className="px-2 py-3">CLIENTE</th>
                <th className="w-[110px] px-2 py-3">ARTICOLI</th>
                <th className="w-[140px] px-2 py-3 text-left">LORDO</th>
                <th className="w-[140px] px-2 py-3 text-left">COMMISIONE</th>
                <th className="w-[140px] px-2 py-3 text-left">NETTO</th>
                <th className="w-[140px] px-2 py-3">STATO</th>
                <th className="w-[84px] px-6 py-3 text-right">AZIONI</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-black/5 text-[11px] hover:bg-black/[0.02]">
                  <td className="px-6 py-4 align-top font-semibold text-[#1f2b20]">
                    {r.date}
                  </td>
                  <td className="px-2 py-4 align-top">
                    <div className="font-semibold text-[#1f2b20]">{r.orderId}</div>
                    <div className="mt-1 text-[10px] font-medium text-[#9aa39a]">{r.id}</div>
                  </td>
                  <td className="px-2 py-4 align-top">
                    <div className="font-semibold text-[#1f2b20]">{r.customer}</div>
                  </td>
                  <td className="px-2 py-4 align-top font-semibold text-[#6b746c]">{r.items}</td>
                  <td className="px-2 py-4 align-top text-start font-semibold text-[#1f2b20]">
                    {r.gross}
                  </td>
                  <td className="px-2 py-4 align-top text-start font-semibold text-[#E53E3E]">
                    {r.commission} <br />
                    <span className="text-[10px] font-medium text-[#6b746c]">10%</span>
                  </td>
                  <td className="px-2 py-4 align-top text-start font-semibold text-[#38A169]">
                    {r.net}
                  </td>
                  <td className="px-2 py-4 align-top">
                    <TransactionStatusPill status={r.status} />
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-[#6b746c] hover:cursor-pointer hover:bg-black/5"
                        aria-label="Vedi transazione"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-black/5 px-6 py-3 text-[11px] font-semibold text-[#6b746c]">
          <button
            type="button"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-black/10 bg-white hover:cursor-pointer hover:bg-black/5"
            aria-label="Pagina precedente"
          >
            ‹
          </button>
          <button
            type="button"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#214e3a] text-white hover:cursor-pointer"
          >
            1
          </button>
          <button
            type="button"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-black/10 bg-white hover:cursor-pointer hover:bg-black/5"
          >
            2
          </button>
          <button
            type="button"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-black/10 bg-white hover:cursor-pointer hover:bg-black/5"
            aria-label="Pagina successiva"
          >
            ›
          </button>
        </div>
      </section>
    </>
  );
}

type PayoutStatus = "COMPLETATO" | "IN_ELABORAZIONE";
type PayoutRow = {
  id: string;
  date: string;
  period: string;
  days: string;
  amount: string;
  accountMasked: string;
  bank: string;
  status: PayoutStatus;
};

function PayoutStatusPill({ status }: { status: PayoutStatus }) {
  const cls =
    status === "COMPLETATO"
      ? "bg-[#e7f6ea] text-[#38A169]"
      : "bg-[#fff7ed] text-[#D69E2E]";
  const label = status === "COMPLETATO" ? "Completato" : "In elaborazione";
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold ${cls}`}>
      {label}
    </span>
  );
}

function PayoutTab() {
  const rows: PayoutRow[] = useMemo(
    () => [
      {
        id: "PAY-2024-042",
        date: "29 Apr 2024, 09:15",
        period: "22–28 Apr 2024",
        days: "7 giorni",
        amount: "€12,450.00",
        accountMasked: "****12345",
        bank: "Intesa Sanpaolo",
        status: "IN_ELABORAZIONE",
      },
      {
        id: "PAY-2024-041",
        date: "22 Apr 2024, 09:20",
        period: "15–21 Apr 2024",
        days: "7 giorni",
        amount: "€18,920.50",
        accountMasked: "****12345",
        bank: "Intesa Sanpaolo",
        status: "COMPLETATO",
      },
      {
        id: "PAY-2024-040",
        date: "15 Apr 2024, 09:18",
        period: "08–14 Apr 2024",
        days: "7 giorni",
        amount: "€22,340.00",
        accountMasked: "****12345",
        bank: "Intesa Sanpaolo",
        status: "COMPLETATO",
      },
      {
        id: "PAY-2024-039",
        date: "08 Apr 2024, 09:22",
        period: "01–07 Apr 2024",
        days: "7 giorni",
        amount: "€16,780.00",
        accountMasked: "****12345",
        bank: "Intesa Sanpaolo",
        status: "COMPLETATO",
      },
      {
        id: "PAY-2024-038",
        date: "01 Apr 2024, 09:16",
        period: "25–31 Mar 2024",
        days: "7 giorni",
        amount: "€19,450.50",
        accountMasked: "****12345",
        bank: "Intesa Sanpaolo",
        status: "COMPLETATO",
      },
      {
        id: "PAY-2024-037",
        date: "25 Mar 2024, 09:19",
        period: "18–24 Mar 2024",
        days: "7 giorni",
        amount: "€21,120.00",
        accountMasked: "****12345",
        bank: "Intesa Sanpaolo",
        status: "COMPLETATO",
      },
    ],
    [],
  );

  return (
    <>
      <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <StatCard
          label="Saldo disponibile per il prelievo"
          value="€24,832.50"
          valueClassName="text-[#38A169]"
        />
        <StatCard label="Totale pagato anno corrente" value="€186,920.00" />
        <StatCard label="Prossimo payout" value="5 Mag 2026" />
      </section>

      <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-black/10 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="text-[11px] font-semibold tracking-wide text-[#1f2b20]">
              STORICO PAYOUT
            </div>
            <button
              type="button"
              className="inline-flex h-7 items-center justify-center gap-2 rounded-lg border border-black/10  px-4 text-[11px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-black/[0.03]"
            >
              Tutti gli stati
              <ChevronDown className="h-4 w-4 text-[#9aa39a]" />
            </button>
          </div>
          <div className="h-px w-full bg-black/5" />

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead>
                <tr className="bg-[#f6f7f6] text-left text-[10px] font-semibold text-[#6b746c]">
                  <th className="w-[170px] px-6 py-3">ID &amp; DATA</th>
                  <th className="w-[190px] px-2 py-3">PERIODO</th>
                  <th className="w-[140px] px-2 py-3">IMPORTO</th>
                  <th className="w-[220px] px-2 py-3">CONTO</th>
                  <th className="w-[160px] px-2 py-3">STATO</th>
                  <th className="w-[84px] px-6 py-3 text-right">AZIONI</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-black/5 text-[11px] hover:bg-black/[0.02]"
                  >
                    <td className="px-6 py-4 align-top">
                      <div className="font-semibold text-[#1f2b20]">{r.id}</div>
                      <div className="mt-1 text-[10px] font-medium text-[#9aa39a]">{r.date}</div>
                    </td>
                    <td className="px-2 py-4 align-top">
                      <div className="font-semibold text-[#1f2b20]">{r.period}</div>
                      <div className="mt-1 text-[10px] font-medium text-[#9aa39a]">{r.days}</div>
                    </td>
                    <td className="px-2 py-4 align-top">
                      <div className="font-semibold text-[#38A169]">{r.amount}</div>
                    </td>
                    <td className="px-2 py-4 align-top">
                      <div className="font-semibold text-[#1f2b20]">{r.accountMasked}</div>
                      <div className="mt-1 text-[10px] font-medium text-[#9aa39a]">{r.bank}</div>
                    </td>
                    <td className="px-2 py-4 align-top">
                      <PayoutStatusPill status={r.status} />
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-[#6b746c] hover:cursor-pointer hover:bg-black/5"
                          aria-label="Vedi payout"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-black/5 px-6 py-3 text-[11px] font-semibold text-[#6b746c]">
            <button
              type="button"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-black/10 bg-white hover:cursor-pointer hover:bg-black/5"
              aria-label="Pagina precedente"
            >
              ‹
            </button>
            <button
              type="button"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#214e3a] text-white hover:cursor-pointer"
            >
              1
            </button>
            <button
              type="button"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-black/10 bg-white hover:cursor-pointer hover:bg-black/5"
            >
              2
            </button>
            <button
              type="button"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-black/10 bg-white hover:cursor-pointer hover:bg-black/5"
            >
              3
            </button>
            <span className="px-1 text-[#9aa39a]">…</span>
            <button
              type="button"
              className="inline-flex h-7 min-w-10 items-center justify-center rounded-md border border-black/10 bg-white px-2 hover:cursor-pointer hover:bg-black/5"
            >
              69
            </button>
            <button
              type="button"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-black/10 bg-white hover:cursor-pointer hover:bg-black/5"
              aria-label="Pagina successiva"
            >
              ›
            </button>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-1">
          <div className="rounded-xl border border-black/10 bg-white shadow-sm">
            <div className="px-6 py-4">
              <div className="text-[11px] font-semibold tracking-wide text-[#1f2b20]">
                IMPOSTAZIONI PAYOUT
              </div>
            </div>
            <div className="h-px w-full bg-black/5" />
            <div className="space-y-4 px-6 py-5">
              <div className="rounded-xl border border-black/10 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-semibold text-[#1f2b20]">
                    Conto Bancario principale
                  </div>
                  <span className="rounded-full bg-[#e7f6ea] px-3 py-1 text-[10px] font-semibold text-[#38A169]">
                    Verificato
                  </span>
                </div>
                <div className="mt-2 text-[10px] font-medium text-[#6b746c]">
                  Banca Intesa Sanpaolo
                </div>
                <div className="mt-1 text-[10px] font-medium text-[#6b746c]">
                  IT02 X 03069 09606 100000012345
                </div>
                <div className="mt-1 text-[10px] font-medium text-[#9aa39a]">
                  Intestatario: {`Tech Store Milano Srl`}
                </div>
              </div>

              <div className="rounded-xl border border-black/10 bg-white p-4">
                <div className="text-[10px] font-semibold tracking-wide text-[#9aa39a]">
                  FREQUENZA PAYOUT
                </div>
                <div className="mt-1 text-[11px] font-semibold text-[#1f2b20]">Settimanale</div>
                <div className="mt-1 text-[10px] font-medium text-[#9aa39a]">Ogni Lunedì</div>
              </div>

              <div className="rounded-xl border border-black/10 bg-white p-4">
                <div className="text-[10px] font-semibold tracking-wide text-[#9aa39a]">
                  SOGLIA MINIMA
                </div>
                <div className="mt-1 text-[11px] font-semibold text-[#1f2b20]">€500.00</div>
                <div className="mt-1 text-[10px] font-medium text-[#9aa39a]">Minimo per bonifico</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-black/10 bg-white shadow-sm">
            <div className="px-6 py-4">
              <div className="text-[11px] font-semibold tracking-wide text-[#1f2b20]">
                STATISTICHE ANNUALI
              </div>
            </div>
            <div className="h-px w-full bg-black/5" />
            <div className="space-y-4 px-6 py-5">
              <div>
                <div className="flex items-center justify-between text-[10px] font-semibold text-[#6b746c]">
                  <span>Totale Pagato</span>
                  <span className="text-[#1f2b20]">€186,920.00</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-[#e7efe9]">
                  <div className="h-2 w-[88%] rounded-full bg-[#38A169]" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] font-semibold text-[#6b746c]">
                  <span>Media Mensile</span>
                  <span className="text-[#1f2b20]">€46,730.00</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-[#e7efe9]">
                  <div className="h-2 w-[64%] rounded-full bg-[#2B6CB0]" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] font-semibold text-[#6b746c]">
                  <span>Payout Completati</span>
                  <span className="text-[#1f2b20]">16 / 17</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-[#e7efe9]">
                  <div className="h-2 w-[92%] rounded-full bg-[#214e3a]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function VendorProfilePage({
  params,
}: {
  params: Promise<{ vendorId: string }>;
}) {
  const { vendorId } = use(params);
  const vendor = useMemo(() => getVendorDemoById(vendorId), [vendorId]);
  const [tab, setTab] = useState<"info" | "products" | "transactions" | "payout">(
    "info",
  );

  const name = vendor?.name ?? "Tech Store Milano Srl";
  const productsTotalText = "342";
  const editCompanyContactsHref = `/vendors/${encodeURIComponent(vendorId)}/edit`;
  const [vendorBlocked, setVendorBlocked] = useState(false);
  const [blockConfirm, setBlockConfirm] = useState<null | "block" | "unblock">(
    null,
  );

  return (
    <>
      <Topbar
        title={null}
        breadcrumb={
          <span className="inline-flex items-center gap-2">
            <Link href="/vendors" className="hover:cursor-pointer hover:underline">
              Venditori
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-[#6b746c]">
              {tab === "products"
                ? "Prodotti"
                : tab === "transactions"
                  ? "Transazioni"
                  : tab === "payout"
                    ? "Payout"
                    : "Profilo Venditore"}
            </span>
          </span>
        }
      />

      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <section className="rounded-xl border border-black/10 bg-white px-6 py-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-[#76C043] ring-1 ring-black/5" />
              <div className="min-w-0">
                <div className="text-[16px] font-semibold text-[#1f2b20]">
                  {name}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-1 text-[11px] font-medium text-[#6b746c]">
                  <span>ID: {vendor?.vendorId ?? "VND-8839201"}</span>
                  <span>{vendor?.email ?? "amministrazione@techstoremilano.it"}</span>
                  <span>Creato: 12 Gen 2024</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <StatusPill tone={vendorBlocked ? "red" : "green"}>
                {vendorBlocked ? "Bloccato" : "Attivo"}
              </StatusPill>
              <Link
                href={{
                  pathname: "/vendors/email",
                  query: {
                    to: vendor?.email ?? "amministrazione@techstoremilano.it",
                    name,
                    vendorId: vendor?.vendorId ?? vendorId,
                  },
                }}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-black/10 bg-white px-4 text-[11px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-black/5"
              >
                <Mail className="h-4 w-4 text-[#6b746c]" />
                Invia email
              </Link>
              <Link
                href={editCompanyContactsHref}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-black/10 bg-white px-4 text-[11px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-black/5"
              >
                <Pencil className="h-4 w-4 text-[#6b746c]" />
                Modifica
              </Link>
              <button
                type="button"
                onClick={() =>
                  setBlockConfirm(vendorBlocked ? "unblock" : "block")
                }
                className={
                  vendorBlocked
                    ? "inline-flex h-9 items-center gap-2 rounded-lg border border-[#c6e6cf] bg-[#e7f6ea] px-4 text-[11px] font-semibold text-[#276749] hover:cursor-pointer hover:bg-[#d4edda]"
                    : "inline-flex h-9 items-center gap-2 rounded-lg border border-[#fecaca] bg-[#fdecec] px-4 text-[11px] font-semibold text-[#E53E3E] hover:cursor-pointer hover:bg-[#fbd6d6]"
                }
              >
                {vendorBlocked ? (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Sblocca
                  </>
                ) : (
                  <>
                    <ShieldAlert className="h-4 w-4" />
                    Blocca
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        <ConfirmationModal
          open={blockConfirm !== null}
          onClose={() => setBlockConfirm(null)}
          title={
            blockConfirm === "unblock"
              ? "Sbloccare questo venditore?"
              : "Bloccare questo venditore?"
          }
          description={
            blockConfirm === "unblock"
              ? `${name} tornerà operativo sul marketplace. Potrai bloccarlo di nuovo in qualsiasi momento.`
              : `${name} non potrà vendere finché non verrà sbloccato. Confermi il blocco?`
          }
          confirmLabel={blockConfirm === "unblock" ? "Sblocca" : "Blocca"}
          variant={blockConfirm === "unblock" ? "primary" : "danger"}
          onConfirm={() => {
            setVendorBlocked(blockConfirm === "block");
          }}
        />

        <section className="mt-4">
          <div className="flex items-center gap-6 border-b border-black/10 text-[11px] font-semibold text-[#6b746c]">
            {[
              { id: "info", label: "Info & Contratto" },
              { id: "products", label: "Prodotti" },
              { id: "transactions", label: "Transazioni" },
              { id: "payout", label: "Payout" },
            ].map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id as any)}
                  className={`relative -mb-px py-3 hover:cursor-pointer ${
                    active ? "text-[#1f2b20]" : "text-[#6b746c]"
                  }`}
                >
                  {t.label}
                  {active ? (
                    <span className="absolute inset-x-0 -bottom-px h-[2px] rounded bg-[#214e3a]" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </section>

        {tab === "products" ? (
          <ProductsTab totalText={productsTotalText} />
        ) : tab === "transactions" ? (
          <TransactionsTab />
        ) : tab === "payout" ? (
          <PayoutTab />
        ) : (
          <>
            <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Fatturato lordo" value="€45,320.80" />
              <StatCard label="Ordini completati" value="387" />
              <StatCard label="Scontrino medio" value="€117.05" />
              <StatCard label="Commissioni generate" value="€4,532.08" />
            </section>

            <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.55fr_0.75fr]">
              <div className="rounded-xl border border-black/10 bg-white shadow-sm">
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="text-[11px] font-semibold tracking-wide text-[#1f2b20]">
                    DATI AZIENDALI E CONTATTI
                  </div>
                  <Link
                    href={editCompanyContactsHref}
                    className="text-[11px] font-semibold text-[#38A169] hover:cursor-pointer hover:underline"
                  >
                    Modifica
                  </Link>
                </div>
                <div className="h-px w-full bg-black/5" />
                <div className="px-6 py-5">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <InfoItem k="Ragione Sociale" v={name} />
                    <InfoItem
                      k="Partita IVA"
                      v={vendor?.vat ? `IT${vendor.vat}` : "IT01234567890"}
                    />
                    <InfoItem
                      k="C.F."
                      v={vendor?.vat ? `IT${vendor.vat}` : "IT01234567890"}
                    />
                    <InfoItem k="Codice SDI" v="M5UXCR1" />
                    <InfoItem k="Indirizzo" v="Via Roma 123" />
                    <InfoItem k="Città" v="Milano" />
                    <InfoItem k="CAP" v="20100" />
                    <InfoItem k="Provincia" v="Milano (MI)" />
                    <InfoItem
                      k="Email Principale"
                      v={vendor?.email ?? "amministrazione@techstoremilano.it"}
                    />
                    <InfoItem k="PEC" v={vendor?.email ?? "amministrazione@techstoremilano.it"} />
                    <InfoItem k="Telefono" v={vendor?.phone ?? "+12 345 678 910"} />
                    <InfoItem k="Whatsapp Business" v={vendor?.phone ?? "+12 345 678 910"} />
                  </div>

                  <div className="mt-6 border-t border-black/5 pt-5">
                    <div className="text-[10px] font-semibold text-[#9aa39a]">
                      Descrizione negozio
                    </div>
                    <div className="mt-2 text-[11px] font-medium leading-relaxed text-[#1f2b20]">
                      Negozio specializzato in elettronica di consumo, smartphone, computer e
                      accessori tecnologici. Partner ufficiale dei principali brand.
                    </div>

                    <div className="mt-4 text-[10px] font-semibold text-[#9aa39a]">
                      Categorie prodotti
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Tag>Elettronica</Tag>
                      <Tag>Smartphone</Tag>
                      <Tag>Computer</Tag>
                      <Tag>Accessori</Tag>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-black/10 bg-white shadow-sm">
                  <div className="flex items-center justify-between px-6 py-4">
                    <div className="text-[11px] font-semibold tracking-wide text-[#1f2b20]">
                      CONDIZIONI CONTRATTO
                    </div>
                    <button
                      type="button"
                      className="text-[11px] font-semibold text-[#38A169] hover:cursor-pointer hover:underline"
                    >
                      Gestisci
                    </button>
                  </div>
                  <div className="h-px w-full bg-black/5" />
                  <div className="space-y-4 px-6 py-5">
                    <div className="rounded-xl border border-black/10 bg-[#f6f7f6] p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] font-semibold text-[#6b746c]">
                          Piano Attuale
                        </div>
                        <span className="rounded-md bg-[#e7f6ea] px-2 py-1 text-[10px] font-semibold text-[#38A169]">
                          Standard
                        </span>
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <div className="text-[18px] font-semibold text-[#1f2b20]">10%</div>
                        <div className="text-[11px] font-medium text-[#6b746c]">
                          commissione base
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-semibold text-[#9aa39a]">
                        Frequenza Payout
                      </div>
                      <div className="mt-1 text-[11px] font-semibold text-[#1f2b20]">
                        Settimanale (Ogni Venerdì)
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold text-[#9aa39a]">
                        Metodo di Pagamento
                      </div>
                      <div className="mt-1 text-[11px] font-semibold text-[#1f2b20]">
                        Intesa Sanpaolo
                      </div>
                      <div className="mt-1 text-[10px] font-medium text-[#9aa39a]">
                        IT60 X054 281 ... 0854
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-black/10 bg-white shadow-sm">
                  <div className="flex items-center justify-between px-6 py-4">
                    <div className="text-[11px] font-semibold tracking-wide text-[#1f2b20]">
                      DOCUMENTI
                    </div>
                    <span className="text-[#9aa39a]">›</span>
                  </div>
                  <div className="h-px w-full bg-black/5" />
                  <div className="space-y-4 px-6 py-5">
                    <div className="rounded-xl border border-black/10 bg-white px-4 py-3">
                      <div className="text-[11px] font-semibold text-[#1f2b20]">
                        Visura_Camerale_2024.pdf
                      </div>
                      <div className="mt-1 text-[10px] font-medium text-[#9aa39a]">
                        Caricato: 12 Gen 2024
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-[10px] font-semibold text-[#38A169]">
                        <button
                          type="button"
                          className="hover:cursor-pointer hover:underline"
                        >
                          Visualizza
                        </button>
                        <button
                          type="button"
                          className="hover:cursor-pointer hover:underline"
                        >
                          Scarica
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-black/10 bg-white text-[11px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-black/5"
                    >
                      Richiedi documento
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}

