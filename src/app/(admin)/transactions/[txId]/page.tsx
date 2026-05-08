"use client";

import {
  Check,
  ChevronRight,
  Paperclip,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { Topbar } from "@/components/layout/Topbar";

type TimelineEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
};

const TIMELINE_DEMO: TimelineEvent[] = [
  {
    id: "ev1",
    title: "Pagamento eseguito",
    description:
      "Il pagamento di €249.99 è stato acquisito con successo da Stripe.",
    date: "15 Ott, 14:32:45",
  },
  {
    id: "ev2",
    title: "Ordine creato",
    description: "Il cliente ha avviato il checkout per 1 articolo.",
    date: "15 Ott, 14:31:10",
  },
];

type BreakdownRow = {
  id: string;
  label: string;
  value: string;
  variant: "header" | "deduction" | "total";
};

const BREAKDOWN_DEMO: BreakdownRow[] = [
  {
    id: "b1",
    label: "Importo lordo pagato dal cliente",
    value: "€249.99",
    variant: "header",
  },
  {
    id: "b2",
    label: "Fee Provider (Stripe 1.4% + €0.25)",
    value: "-€3.75",
    variant: "deduction",
  },
  {
    id: "b3",
    label: "Commissione marketplace (10%)",
    value: "-€25.00",
    variant: "deduction",
  },
  {
    id: "b4",
    label: "Netto venditore da liquidare",
    value: "€221.24",
    variant: "total",
  },
];

export default function TransactionDetailPage({
  params,
}: {
  params: Promise<{ txId: string }>;
}) {
  const { txId } = use(params);
  void txId;

  return (
    <>
      <Topbar
        title={null}
        breadcrumb={
          <span className="inline-flex items-center gap-2">
            <Link
              href="/transactions"
              className="hover:cursor-pointer hover:underline"
            >
              Transazioni
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-[#6b746c]">Dettaglio transazione</span>
          </span>
        }
      />

      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <section className="rounded-xl border border-black/10 bg-white px-6 py-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-[18px] font-semibold text-[#1f2b20]">
                  Transazione #TX-99281-A
                </h2>
                <span className="inline-flex items-center rounded-full bg-[#e7f6ea] px-3 py-1 text-[10px] font-semibold text-[#38A169]">
                  Completato
                </span>
              </div>
              <div className="mt-1 text-[11px] font-medium text-[#9aa39a]">
                Creata il 15 Ottobre 2024, 14:32:45 CEST
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-medium text-[#9aa39a]">
                Importo lordo
              </div>
              <div className="mt-1 text-[24px] font-semibold text-[#1f2b20]">
                €249.99
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
            AZIONI RAPIDE
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <button
              type="button"
              className="flex items-center gap-4 rounded-xl border border-black/10 bg-white p-4 text-left shadow-sm hover:cursor-pointer hover:bg-black/5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e7f6ea] text-[#38A169] ring-1 ring-[#5DBE54]/15">
                <Paperclip className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[12px] font-semibold text-[#1f2b20]">
                  Allega documento
                </div>
                <div className="mt-0.5 text-[10px] font-medium text-[#9aa39a]">
                  Allega documento aggiuntivo
                </div>
              </div>
            </button>

            <button
              type="button"
              className="flex items-center gap-4 rounded-xl border border-black/10 bg-white p-4 text-left shadow-sm hover:cursor-pointer hover:bg-black/5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fdecec] text-[#E53E3E] ring-1 ring-[#E53E3E]/15">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[12px] font-semibold text-[#1f2b20]">
                  Rimborso forzato
                </div>
                <div className="mt-0.5 text-[10px] font-medium text-[#9aa39a]">
                  Procedi con rimborso cliente
                </div>
              </div>
            </button>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.55fr_0.85fr]">
          <div className="space-y-4">
            <div className="rounded-xl border border-black/10 bg-white shadow-sm">
              <div className="px-6 py-4">
                <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
                  TIMELINE EVENTI
                </div>
              </div>
              <div className="h-px w-full bg-black/5" />
              <div className="px-6 py-5">
                <ol className="ml-auto flex max-w-[340px] flex-col gap-4">
                  {TIMELINE_DEMO.map((ev, idx) => (
                    <li key={ev.id} className="flex items-stretch gap-3">
                      <div className="relative flex w-7 flex-none flex-col items-center">
                        <span
                          aria-hidden
                          className="z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#38A169] text-white"
                        >
                          <Check className="h-4 w-4" strokeWidth={3} />
                        </span>
                        {idx < TIMELINE_DEMO.length - 1 ? (
                          <span
                            aria-hidden
                            className="mt-1 w-px flex-1 bg-black/10"
                          />
                        ) : null}
                      </div>

                      <div className="min-w-0 flex-1 rounded-xl border border-black/10 bg-white px-4 py-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="text-[12px] font-semibold text-[#1f2b20]">
                            {ev.title}
                          </div>
                          <div className="whitespace-nowrap text-[10px] font-medium text-[#9aa39a]">
                            {ev.date}
                          </div>
                        </div>
                        <div className="mt-1 text-[11px] font-medium text-[#6b746c]">
                          {ev.description}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="rounded-xl border border-black/10 bg-white shadow-sm">
              <div className="px-6 py-4">
                <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
                  BREAKDOWN EVENTI
                </div>
              </div>
              <div className="h-px w-full bg-black/5" />
              <div className="px-6 py-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[12px] font-medium text-[#1f2b20]">
                    {BREAKDOWN_DEMO[0].label}
                  </div>
                  <div className="text-[13px] font-semibold text-[#1f2b20]">
                    {BREAKDOWN_DEMO[0].value}
                  </div>
                </div>

                <div className="mt-4 space-y-3 pl-4">
                  {BREAKDOWN_DEMO.filter((r) => r.variant === "deduction").map(
                    (row) => (
                      <div
                        key={row.id}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="text-[12px] font-medium text-[#6b746c]">
                          <span className="mr-2 text-[#9aa39a]">−</span>
                          {row.label}
                        </div>
                        <div className="text-[12px] font-semibold text-[#E53E3E]">
                          {row.value}
                        </div>
                      </div>
                    ),
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-black/5 pt-5">
                  <div className="text-[12px] font-semibold text-[#1f2b20]">
                    {BREAKDOWN_DEMO[3].label}
                  </div>
                  <div className="text-[14px] font-semibold text-[#38A169]">
                    {BREAKDOWN_DEMO[3].value}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-black/10 bg-white shadow-sm">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
                  VENDITORE
                </div>
                <Link
                  href="/vendors/1"
                  className="text-[11px] font-semibold text-[#9aa39a] hover:cursor-pointer hover:text-[#1f2b20]"
                >
                  Apri Profilo
                </Link>
              </div>
              <div className="h-px w-full bg-black/5" />
              <div className="space-y-3 px-6 py-5">
                <div>
                  <div className="text-[13px] font-semibold text-[#1f2b20]">
                    Tech Store Milano
                  </div>
                  <div className="mt-1 text-[10px] font-medium text-[#9aa39a]">
                    ID: VND-TECH-001
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#6b746c]">
                    Stato Account
                  </span>
                  <span className="text-[11px] font-semibold text-[#38A169]">
                    Attivo
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#6b746c]">
                    Piano Comm.
                  </span>
                  <span className="text-[11px] font-semibold text-[#1f2b20]">
                    Standard (10%)
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-black/10 bg-white shadow-sm">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
                  CLIENTE
                </div>
                <Link
                  href="/end-users/1"
                  className="text-[11px] font-semibold text-[#9aa39a] hover:cursor-pointer hover:text-[#1f2b20]"
                >
                  Apri Profilo
                </Link>
              </div>
              <div className="h-px w-full bg-black/5" />
              <div className="space-y-3 px-6 py-5">
                <div>
                  <div className="text-[13px] font-semibold text-[#1f2b20]">
                    Marco Rossi
                  </div>
                  <div className="mt-1 text-[10px] font-medium text-[#9aa39a]">
                    ID: USR-8821
                  </div>
                </div>
                <div className="text-[11px] font-medium text-[#1f2b20]">
                  m.rossi@email.it
                </div>
                <div className="text-[11px] font-medium text-[#1f2b20]">
                  +39 333 1234567
                </div>
                <div className="border-t border-black/5 pt-3">
                  <div className="text-[10px] font-semibold tracking-wide text-[#9aa39a]">
                    INDIRIZZO FATTURAZIONE
                  </div>
                  <div className="mt-2 text-[11px] font-medium text-[#1f2b20]">
                    Via Roma 123
                  </div>
                  <div className="text-[11px] font-medium text-[#1f2b20]">
                    20100 Milano (MI)
                  </div>
                  <div className="text-[11px] font-medium text-[#1f2b20]">
                    Italia
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-black/10 bg-white shadow-sm">
              <div className="px-6 py-4">
                <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
                  NOTE INTERNE
                </div>
              </div>
              <div className="h-px w-full bg-black/5" />
              <div className="space-y-3 px-6 py-5">
                <div className="rounded-xl bg-[#FEF9C3] p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-semibold text-[#1f2b20]">
                      Admin (ADM-001)
                    </div>
                    <div className="text-[10px] font-medium text-[#9aa39a]">
                      15 Ott, 15:00
                    </div>
                  </div>
                  <div className="mt-1 text-[11px] font-medium text-[#6b746c]">
                    Transazione verificata manualmente. Nessuna anomalia
                    rilevata nel punteggio di rischio.
                  </div>
                </div>

                <div className="rounded-xl border border-black/10 bg-white p-3">
                  <textarea
                    rows={2}
                    placeholder="Scrivi una nota interna..."
                    className="w-full resize-none rounded-md bg-white text-[11px] font-medium text-[#1f2b20] outline-none placeholder:text-[#9aa39a]"
                  />
                  <div className="mt-2 flex items-center justify-end">
                    <button
                      type="button"
                      className="inline-flex h-7 items-center justify-center rounded-lg bg-[#214e3a] px-4 text-[11px] font-semibold text-white hover:cursor-pointer hover:bg-[#1a3f2e]"
                    >
                      Salva
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
