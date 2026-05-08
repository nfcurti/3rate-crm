"use client";

import {
  Check,
  ChevronRight,
  Copy,
  Eye,
  Mail,
  MoreVertical,
  Search,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { use, useMemo, useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { StatusPill } from "@/components/vendors/StatusPill";
import { getEndUserDemoById } from "@/lib/end-users-demo";

type TabId = "panoramica" | "ordini" | "pagamenti";

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-black/10 bg-white px-5 py-4 shadow-sm">
      <div className="text-[11px] font-medium text-[#6b746c]">{label}</div>
      <div className="mt-2 text-[18px] font-semibold text-[#1f2b20]">
        {value}
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  valueNode,
}: {
  label: string;
  value?: string;
  valueNode?: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[10px] font-medium text-[#9aa39a]">{label}</div>
      <div className="mt-1 text-[12px] font-semibold text-[#1f2b20]">
        {valueNode ?? value}
      </div>
    </div>
  );
}

function AddressCard({
  name,
  street,
  city,
}: {
  name: string;
  street: string;
  city: string;
}) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-4">
      <div className="text-[12px] font-semibold text-[#1f2b20]">{name}</div>
      <div className="mt-1 text-[11px] font-medium text-[#6b746c]">{street}</div>
      <div className="text-[11px] font-medium text-[#6b746c]">{city}</div>
    </div>
  );
}

type OrderStatus =
  | "Consegnato"
  | "In transito"
  | "In elaborazione"
  | "Annullato";

function OrderStatusPill({ status }: { status: OrderStatus }) {
  const cls =
    status === "Consegnato"
      ? "bg-[#e7f6ea] text-[#38A169]"
      : status === "In transito"
        ? "bg-[#dbeafe] text-[#1d4ed8]"
        : status === "In elaborazione"
          ? "bg-[#FEF3C7] text-[#D69E2E]"
          : "bg-[#fdecec] text-[#E53E3E]";
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold ${cls}`}
    >
      {status}
    </span>
  );
}

type OrderRow = {
  id: string;
  orderId: string;
  date: string;
  productsLabel: string;
  total: string;
  status: OrderStatus;
};

const ORDERS_DEMO: OrderRow[] = [
  {
    id: "o1",
    orderId: "#ORD-3421",
    date: "18 Gen 2024",
    productsLabel: "3 prodotti",
    total: "€245.90",
    status: "Consegnato",
  },
  {
    id: "o2",
    orderId: "#ORD-3398",
    date: "16 Gen 2024",
    productsLabel: "1 prodotto",
    total: "€89.00",
    status: "In transito",
  },
  {
    id: "o3",
    orderId: "#ORD-3367",
    date: "14 Gen 2024",
    productsLabel: "5 prodotti",
    total: "€432.50",
    status: "Consegnato",
  },
  {
    id: "o4",
    orderId: "#ORD-3289",
    date: "10 Gen 2024",
    productsLabel: "2 prodotti",
    total: "€156.75",
    status: "Consegnato",
  },
];

function PanoramicaTab({
  user,
}: {
  user: ReturnType<typeof getEndUserDemoById>;
}) {
  const fullName = user?.name ?? "Maria Rossi";

  return (
    <>
      <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Valore totale ordini (30gg)" value="€3,240.50" />
        <StatCard label="Ordini completati (30gg)" value="24" />
        <StatCard label="Scontrino medio" value="€135.02" />
        <StatCard label="Lifetime value" value="€12,845.75" />
      </section>

      <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.55fr_0.85fr]">
        <div className="rounded-xl border border-black/10 bg-white shadow-sm">
          <div className="px-6 py-4">
            <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
              INFORMAZIONI PERSONALI
            </div>
          </div>
          <div className="h-px w-full bg-black/5" />
          <div className="grid grid-cols-1 gap-y-6 gap-x-8 px-6 py-5 md:grid-cols-2">
            <InfoItem label="Nome Completo" value={fullName} />
            <InfoItem label="Codice Fiscale" value="RSSMRA85M41F205X" />
            <InfoItem label="Data di Nascita" value="01 Agosto 1985" />
            <InfoItem label="Luogo di Nascita" value="Milano (MI)" />
            <InfoItem label="Email" value={user?.email ?? "maria.rossi@email.it"} />
            <InfoItem label="Telefono" value={user?.phone ?? "+39 345 678 9012"} />
            <InfoItem label="Lingua Preferita" value="Italiano" />
            <InfoItem
              label="Newsletter"
              valueNode={
                <span className="inline-flex items-center gap-1.5 text-[#38A169]">
                  <Check className="h-3.5 w-3.5" /> Iscritto
                </span>
              }
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-black/10 bg-white shadow-sm">
            <div className="px-6 py-4">
              <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
                INDIRIZZI SPEDIZIONE
              </div>
            </div>
            <div className="h-px w-full bg-black/5" />
            <div className="px-6 py-5">
              <AddressCard
                name={fullName}
                street="Via Giuseppe Verdi, 42"
                city="20121 Milano (MI) Italia"
              />
            </div>
          </div>

          <div className="rounded-xl border border-black/10 bg-white shadow-sm">
            <div className="px-6 py-4">
              <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
                INDIRIZZI FATTURAZIONE
              </div>
            </div>
            <div className="h-px w-full bg-black/5" />
            <div className="px-6 py-5">
              <AddressCard
                name={fullName}
                street="Via Giuseppe Verdi, 42"
                city="20121 Milano (MI) Italia"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-black/10 bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
            ULTIMI ORDINI
          </div>
          <button
            type="button"
            className="text-[11px] font-semibold text-[#38A169] hover:cursor-pointer hover:underline"
          >
            Vedi tutti
          </button>
        </div>
        <div className="h-px w-full bg-black/5" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead className="bg-[#f6f7f6] text-[10px] font-semibold tracking-wide text-[#9aa39a]">
              <tr className="border-b border-black/5">
                <th className="px-6 py-3">ID ORDINE</th>
                <th className="py-3 pr-4">DATA</th>
                <th className="py-3 pr-4">PRODOTTI</th>
                <th className="py-3 pr-4 text-right">TOTALE</th>
                <th className="py-3 pr-4 text-center">STATO</th>
                <th className="w-[92px] px-6 py-3 text-right">AZIONI</th>
              </tr>
            </thead>
            <tbody className="text-[12px] text-[#1f2b20]">
              {ORDERS_DEMO.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-black/5 transition-colors hover:bg-black/[0.02]"
                >
                  <td className="px-6 py-4 align-middle text-[11px] font-semibold">
                    {o.orderId}
                  </td>
                  <td className="py-4 pr-4 align-middle text-[11px] font-medium">
                    {o.date}
                  </td>
                  <td className="py-4 pr-4 align-middle text-[11px] font-medium">
                    {o.productsLabel}
                  </td>
                  <td className="py-4 pr-4 align-middle text-right text-[11px] font-semibold">
                    {o.total}
                  </td>
                  <td className="py-4 pr-4 align-middle text-center">
                    <OrderStatusPill status={o.status} />
                  </td>
                  <td className="px-6 py-4 align-middle">
                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-[#6b746c] hover:cursor-pointer hover:bg-black/5"
                        aria-label={`Vedi ordine ${o.orderId}`}
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
      </section>
    </>
  );
}

type TopProduct = {
  id: string;
  title: string;
  category: string;
  qty: number;
  price: string;
};

const TOP_PRODUCTS_DEMO: TopProduct[] = [
  {
    id: "tp1",
    title: "Cover Protettiva Premium",
    category: "Accessori",
    qty: 4,
    price: "€156",
  },
  {
    id: "tp2",
    title: "Cuffie Wireless Premium ANC",
    category: "Audio",
    qty: 2,
    price: "€598",
  },
  {
    id: "tp3",
    title: "Smartwatch Fitness Tracker",
    category: "Wearable",
    qty: 2,
    price: "€478",
  },
];

type StatusBreakdown = {
  id: string;
  label: string;
  count: number;
  percent: number;
  color: string;
};

const STATUS_BREAKDOWN_DEMO: StatusBreakdown[] = [
  {
    id: "consegnato",
    label: "Consegnato/Ritirato",
    count: 18,
    percent: 75,
    color: "#38A169",
  },
  {
    id: "transito",
    label: "In transito/in attesa di ritiro",
    count: 3,
    percent: 12.5,
    color: "#3B82F6",
  },
  {
    id: "elaborazione",
    label: "In elaborazione",
    count: 2,
    percent: 8.3,
    color: "#D69E2E",
  },
  {
    id: "annullato",
    label: "Annullato",
    count: 1,
    percent: 4.2,
    color: "#E53E3E",
  },
];

type FullOrderRow = {
  id: string;
  orderId: string;
  date: string;
  time: string;
  productsLabel: string;
  paymentLast4: string;
  total: string;
  status: OrderStatus;
};

const FULL_ORDERS_DEMO: FullOrderRow[] = [
  {
    id: "fo1",
    orderId: "#ORD-3421",
    date: "18 Gen 2024",
    time: "14:32",
    productsLabel: "3 prodotti",
    paymentLast4: "4532",
    total: "€245.90",
    status: "Consegnato",
  },
  {
    id: "fo2",
    orderId: "#ORD-3398",
    date: "16 Gen 2024",
    time: "09:15",
    productsLabel: "1 prodotto",
    paymentLast4: "4532",
    total: "€89.00",
    status: "In transito",
  },
  {
    id: "fo3",
    orderId: "#ORD-3367",
    date: "14 Gen 2024",
    time: "16:48",
    productsLabel: "5 prodotti",
    paymentLast4: "8891",
    total: "€432.50",
    status: "Consegnato",
  },
  {
    id: "fo4",
    orderId: "#ORD-3289",
    date: "10 Gen 2024",
    time: "11:22",
    productsLabel: "2 prodotti",
    paymentLast4: "4532",
    total: "€156.75",
    status: "Consegnato",
  },
  {
    id: "fo5",
    orderId: "#ORD-3201",
    date: "05 Gen 2024",
    time: "13:05",
    productsLabel: "3 prodotti",
    paymentLast4: "4532",
    total: "€324.20",
    status: "In elaborazione",
  },
  {
    id: "fo6",
    orderId: "#ORD-3156",
    date: "28 Dic 2023",
    time: "15:41",
    productsLabel: "1 prodotto",
    paymentLast4: "8891",
    total: "€67.90",
    status: "Annullato",
  },
];

function OrdiniTab() {
  return (
    <>
      <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Totale ordini" value="24" />
        <StatCard label="Valore totale" value="€12,845.75" />
        <StatCard label="Scontrino medio" value="€535.24" />
        <StatCard label="Tasso reso" value="4.2%" />
      </section>

      <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white shadow-sm">
          <div className="px-6 py-4">
            <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
              PRODOTTI PIÙ ACQUISTATI
            </div>
          </div>
          <div className="h-px w-full bg-black/5" />
          <div className="space-y-3 px-6 py-5">
            {TOP_PRODUCTS_DEMO.map((p) => (
              <div
                key={p.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-black/10 bg-white px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="text-[12px] font-semibold text-[#1f2b20]">
                    {p.title}
                  </div>
                  <div className="mt-1 text-[10px] font-medium text-[#9aa39a]">
                    Categoria: {p.category}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-semibold text-[#1f2b20]">
                    {p.qty}x
                  </div>
                  <div className="mt-1 text-[10px] font-medium text-[#9aa39a]">
                    {p.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-black/10 bg-white shadow-sm">
          <div className="px-6 py-4">
            <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
              DISTRIBUZIONE STATI ORDINI
            </div>
          </div>
          <div className="h-px w-full bg-black/5" />
          <div className="space-y-4 px-6 py-5">
            {STATUS_BREAKDOWN_DEMO.map((s) => (
              <div key={s.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="text-[11px] font-medium text-[#1f2b20]">
                      {s.label}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#1f2b20]">
                    {s.count} ({s.percent}%)
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#f2f4f2]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${s.percent}%`,
                      backgroundColor: s.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-black/10 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa39a]" />
            <input
              placeholder="Cerca ordine per ID, data..."
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
        </div>
      </section>

      <section className="mt-4 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
        <div className="px-6 py-4">
          <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
            ORDINI
          </div>
        </div>
        <div className="h-px w-full bg-black/5" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead className="bg-[#f6f7f6] text-[10px] font-semibold tracking-wide text-[#9aa39a]">
              <tr className="border-b border-black/5">
                <th className="w-[44px] px-5 py-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-black/10"
                    aria-label="Seleziona tutti"
                  />
                </th>
                <th className="py-4 pr-4">ID ORDINE</th>
                <th className="py-4 pr-4">DATA</th>
                <th className="py-4 pr-4">PRODOTTI</th>
                <th className="py-4 pr-4">METODO PAGAMENTO</th>
                <th className="py-4 pr-4 text-right">TOTALE</th>
                <th className="py-4 pr-4 text-center">STATO</th>
                <th className="w-[92px] px-5 py-4 text-right">AZIONI</th>
              </tr>
            </thead>
            <tbody className="text-[12px] text-[#1f2b20]">
              {FULL_ORDERS_DEMO.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-black/5 transition-colors hover:bg-black/[0.02]"
                >
                  <td className="w-[44px] px-5 py-5 align-middle">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-black/10"
                      aria-label={`Seleziona ${o.orderId}`}
                    />
                  </td>
                  <td className="py-5 pr-4 align-middle">
                    <div className="inline-flex items-center gap-2">
                      <span className="text-[11px] font-semibold">
                        {o.orderId}
                      </span>
                      <button
                        type="button"
                        className="text-[#9aa39a] hover:cursor-pointer hover:text-[#1f2b20]"
                        aria-label={`Copia ${o.orderId}`}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="py-5 pr-4 align-middle">
                    <div className="text-[11px] font-medium">{o.date}</div>
                    <div className="mt-1 text-[10px] font-medium text-[#9aa39a]">
                      {o.time}
                    </div>
                  </td>
                  <td className="py-5 pr-4 align-middle text-[11px] font-medium">
                    {o.productsLabel}
                  </td>
                  <td className="py-5 pr-4 align-middle text-[11px] font-medium tracking-wider text-[#6b746c]">
                    •••• {o.paymentLast4}
                  </td>
                  <td className="py-5 pr-4 align-middle text-right text-[11px] font-semibold">
                    {o.total}
                  </td>
                  <td className="py-5 pr-4 align-middle text-center">
                    <OrderStatusPill status={o.status} />
                  </td>
                  <td className="px-5 py-5 align-middle">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-[#6b746c] hover:cursor-pointer hover:bg-black/5"
                        aria-label={`Vedi ordine ${o.orderId}`}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
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
    </>
  );
}

type TransactionStatus = "Completato" | "Rimborsato" | "Fallito";

function TransactionStatusPill({ status }: { status: TransactionStatus }) {
  const cls =
    status === "Completato"
      ? "bg-[#e7f6ea] text-[#38A169]"
      : status === "Rimborsato"
        ? "bg-[#FEF3C7] text-[#D69E2E]"
        : "bg-[#fdecec] text-[#E53E3E]";
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold ${cls}`}
    >
      {status}
    </span>
  );
}

type PaymentMethod = {
  id: string;
  last4: string;
  expiry: string;
};

const PAYMENT_METHODS_DEMO: PaymentMethod[] = [
  { id: "pm1", last4: "4532", expiry: "08/2026" },
  { id: "pm2", last4: "8891", expiry: "12/2025" },
];

type MonthlyStat = {
  id: string;
  label: string;
  value: number;
  bg: string;
  text: string;
};

const MONTHLY_STATS_DEMO: MonthlyStat[] = [
  {
    id: "ok",
    label: "Riusciti",
    value: 24,
    bg: "bg-[#e7f6ea]",
    text: "text-[#38A169]",
  },
  {
    id: "ko",
    label: "Falliti",
    value: 0,
    bg: "bg-[#fdecec]",
    text: "text-[#E53E3E]",
  },
  {
    id: "refund",
    label: "Rimborsi",
    value: 1,
    bg: "bg-[#FEF3C7]",
    text: "text-[#D69E2E]",
  },
];

type TransactionRow = {
  id: string;
  txId: string;
  date: string;
  time: string;
  orderId: string;
  paymentLast4: string;
  amount: string;
  status: TransactionStatus;
};

const TRANSACTIONS_DEMO: TransactionRow[] = [
  {
    id: "tx1",
    txId: "#TXN-8821",
    date: "18 Gen 2024",
    time: "14:32:15",
    orderId: "#ORD-3421",
    paymentLast4: "4532",
    amount: "€245.90",
    status: "Completato",
  },
  {
    id: "tx2",
    txId: "#TXN-8798",
    date: "16 Gen 2024",
    time: "09:15:42",
    orderId: "#ORD-3398",
    paymentLast4: "4532",
    amount: "€89.00",
    status: "Completato",
  },
  {
    id: "tx3",
    txId: "#TXN-8767",
    date: "14 Gen 2024",
    time: "16:48:33",
    orderId: "#ORD-3367",
    paymentLast4: "8891",
    amount: "€432.50",
    status: "Completato",
  },
  {
    id: "tx4",
    txId: "#TXN-8689",
    date: "10 Gen 2024",
    time: "11:22:08",
    orderId: "#ORD-3289",
    paymentLast4: "4532",
    amount: "€156.75",
    status: "Completato",
  },
  {
    id: "tx5",
    txId: "#TXN-8661",
    date: "05 Gen 2024",
    time: "13:05:21",
    orderId: "#ORD-3201",
    paymentLast4: "4532",
    amount: "€324.20",
    status: "Completato",
  },
  {
    id: "tx6",
    txId: "#TXN-8556",
    date: "28 Dic 2023",
    time: "15:41:55",
    orderId: "#ORD-3156",
    paymentLast4: "8891",
    amount: "€67.90",
    status: "Rimborsato",
  },
];

function PagamentiTab() {
  return (
    <>
      <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Totale pagato" value="€12,845.75" />
        <StatCard label="Transazioni" value="24" />
        <StatCard label="Metodi salvati" value="2" />
        <StatCard label="Ultima transazione" value="€245.90" />
      </section>

      <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white shadow-sm">
          <div className="px-6 pt-4">
            <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
              METODI DI PAGAMENTO
            </div>
          </div>
          <div className="space-y-3 px-6 py-5">
            {PAYMENT_METHODS_DEMO.map((m) => (
              <div
                key={m.id}
                className="rounded-xl border border-black/10 bg-white px-4 py-3"
              >
                <div className="text-[12px] font-semibold tracking-wider text-[#1f2b20]">
                  •••• {m.last4}
                </div>
                <div className="mt-1 text-[10px] font-medium text-[#9aa39a]">
                  Scad: {m.expiry}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-black/10 bg-white shadow-sm">
          <div className="px-6 pt-4">
            <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
              STATISTICHE MENSILI
            </div>
          </div>
          <div className="space-y-3 px-6 py-5">
            {MONTHLY_STATS_DEMO.map((s) => (
              <div
                key={s.id}
                className={`flex items-center justify-between rounded-xl px-4 py-3 ${s.bg}`}
              >
                <span className={`text-[12px] font-semibold ${s.text}`}>
                  {s.label}
                </span>
                <span className={`text-[14px] font-semibold ${s.text}`}>
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-black/10 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa39a]" />
            <input
              placeholder="Cerca transazione per ID, data..."
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
          <table className="w-full min-w-[980px] text-left">
            <thead className="bg-[#f6f7f6] text-[10px] font-semibold tracking-wide text-[#9aa39a]">
              <tr className="border-b border-black/5">
                <th className="px-6 py-4">ID TRANSAZIONE</th>
                <th className="py-4 pr-4">DATA &amp; ORA</th>
                <th className="py-4 pr-4">ORDINE</th>
                <th className="py-4 pr-4">METODO</th>
                <th className="py-4 pr-4 text-right">IMPORTO</th>
                <th className="py-4 pr-4 text-center">STATO</th>
                <th className="w-[92px] px-6 py-4 text-right">AZIONI</th>
              </tr>
            </thead>
            <tbody className="text-[12px] text-[#1f2b20]">
              {TRANSACTIONS_DEMO.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-black/5 transition-colors hover:bg-black/[0.02]"
                >
                  <td className="px-6 py-5 align-middle">
                    <div className="inline-flex items-center gap-2">
                      <span className="text-[11px] font-semibold">
                        {t.txId}
                      </span>
                      <button
                        type="button"
                        className="text-[#9aa39a] hover:cursor-pointer hover:text-[#1f2b20]"
                        aria-label={`Copia ${t.txId}`}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="py-5 pr-4 align-middle">
                    <div className="text-[11px] font-medium">{t.date}</div>
                    <div className="mt-1 text-[10px] font-medium text-[#9aa39a]">
                      {t.time}
                    </div>
                  </td>
                  <td className="py-5 pr-4 align-middle text-[11px] font-medium">
                    {t.orderId}
                  </td>
                  <td className="py-5 pr-4 align-middle text-[11px] font-medium tracking-wider text-[#6b746c]">
                    •••• {t.paymentLast4}
                  </td>
                  <td className="py-5 pr-4 align-middle text-right text-[11px] font-semibold">
                    {t.amount}
                  </td>
                  <td className="py-5 pr-4 align-middle text-center">
                    <TransactionStatusPill status={t.status} />
                  </td>
                  <td className="px-6 py-5 align-middle">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-[#6b746c] hover:cursor-pointer hover:bg-black/5"
                        aria-label={`Vedi transazione ${t.txId}`}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
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
    </>
  );
}

export default function EndUserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const user = useMemo(() => getEndUserDemoById(userId), [userId]);
  const [tab, setTab] = useState<TabId>("panoramica");

  const name = user?.name ?? "Maria Rossi";
  const userIdLabel = user?.userId ?? "USR-8821";
  const email = user?.email ?? "maria.rossi@email.it";
  const phone = user?.phone ?? "+39 345 678 9012";
  const registeredAt = user?.registeredAt ?? "15 Gen 2024";
  const status = user?.status ?? "Attivo";
  const statusTone =
    status === "Attivo"
      ? "green"
      : status === "Pending"
        ? "amber"
        : status === "Bloccato"
          ? "red"
          : "gray";
  const initials = name
    .split(" ")
    .map((p: string) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

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
            <span className="text-[#6b746c]">
              {tab === "ordini"
                ? "Ordini"
                : tab === "pagamenti"
                  ? "Pagamenti"
                  : "Dettaglio Utente"}
            </span>
          </span>
        }
      />

      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <section className="rounded-xl border border-black/10 bg-white px-6 py-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#76C043] text-[13px] font-semibold text-white ring-1 ring-black/5">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="text-[18px] font-semibold text-[#1f2b20]">
                  {name}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-medium text-[#6b746c]">
                  <span>ID: #{userIdLabel}</span>
                  <span className="text-[#d3d8d3]">|</span>
                  <span>{email}</span>
                  <span className="text-[#d3d8d3]">|</span>
                  <span>{phone}</span>
                  <span className="text-[#d3d8d3]">|</span>
                  <span>Registrato: {registeredAt}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <StatusPill tone={statusTone}>● {status}</StatusPill>
              <button
                type="button"
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-black/10 bg-white px-4 text-[11px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-black/5"
              >
                <Mail className="h-4 w-4 text-[#6b746c]" />
                Invia email
              </button>
              <button
                type="button"
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#fecaca] bg-[#fdecec] px-4 text-[11px] font-semibold text-[#E53E3E] hover:cursor-pointer hover:bg-[#fbd6d6]"
              >
                <ShieldAlert className="h-4 w-4" />
                Blocca
              </button>
            </div>
          </div>
        </section>

        <section className="mt-4">
          <div className="flex items-center gap-6 border-b border-black/10 text-[11px] font-semibold text-[#6b746c]">
            {[
              { id: "panoramica", label: "Panoramica" },
              { id: "ordini", label: "Ordini" },
              { id: "pagamenti", label: "Pagamenti" },
            ].map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id as TabId)}
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

        {tab === "panoramica" ? (
          <PanoramicaTab user={user} />
        ) : tab === "ordini" ? (
          <OrdiniTab />
        ) : (
          <PagamentiTab />
        )}
      </div>
    </>
  );
}
