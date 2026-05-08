"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { MiniLineChart } from "@/components/dashboard/MiniLineChart";
import { RevenueCommissionChart } from "@/components/dashboard/RevenueCommissionChart";
import { Topbar } from "@/components/layout/Topbar";

export default function DashboardHomePage() {
  const [rangeOpen, setRangeOpen] = useState(false);
  const rangeRef = useRef<HTMLDivElement | null>(null);
  const [salesRangeDays, setSalesRangeDays] = useState<7 | 30 | 90>(30);

  const chartData = useMemo(() => {
    const base = [
      { label: "1 Gen", revenue: 34000, commission: 47000 },
      { label: "5 Gen", revenue: 42000, commission: 51000 },
      { label: "10 Gen", revenue: 38000, commission: 49000 },
      { label: "15 Gen", revenue: 56000, commission: 59000 },
      { label: "20 Gen", revenue: 50000, commission: 54000 },
      { label: "25 Gen", revenue: 64000, commission: 63000 },
      { label: "30 Gen", revenue: 59000, commission: 60000 },
    ];
    if (salesRangeDays === 7) return base;
    if (salesRangeDays === 30) return base;
    return base;
  }, [salesRangeDays]);

  const vendorsMini = useMemo(
    () => [
      { x: "Lun", y: 14000 },
      { x: "Mar", y: 16000 },
      { x: "Mer", y: 15000 },
      { x: "Gio", y: 17000 },
      { x: "Ven", y: 18000 },
      { x: "Sab", y: 19000 },
      { x: "Dom", y: 17500 },
    ],
    [],
  );

  const usersMini = useMemo(
    () => [
      { x: "Lun", y: 20000 },
      { x: "Mar", y: 21500 },
      { x: "Mer", y: 22500 },
      { x: "Gio", y: 24000 },
      { x: "Ven", y: 25500 },
      { x: "Sab", y: 26500 },
      { x: "Dom", y: 28200 },
    ],
    [],
  );

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const target = e.target;
      if (!(target instanceof Node)) return;
      const rangeEl = rangeRef.current;
      if (rangeEl && !rangeEl.contains(target)) setRangeOpen(false);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setRangeOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <>
      <Topbar title="Dashboard" />

      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-black/10 bg-[#fdecec] p-4">
            <div className="text-[12px] font-semibold text-[#E53E3E]">
              Payout non riconciliati
            </div>
            <div className="mt-1 text-[11px] font-medium text-[#1f2b20]/70">
              Ci sono 12 bonifici da Klarna in attesa di riconciliazione manuale.
            </div>
            <Link
              href="/reconciliation"
              className="mt-2 inline-block text-[11px] font-semibold text-[#E53E3E] hover:cursor-pointer hover:underline"
            >
              Risolvi ora →
            </Link>
          </div>

          <div className="rounded-xl border border-black/10 bg-[#fff4e5] p-4">
            <div className="text-[12px] font-semibold text-[#b45309]">
              Venditori da approvare
            </div>
            <div className="mt-1 text-[11px] font-medium text-[#1f2b20]/70">
              5 nuovi venditori hanno completato l&apos;upload dei pacchetti e le
              verifiche KYC e attendono approvazione.
            </div>
            <Link
              href="/vendors"
              className="mt-2 inline-block text-[11px] font-semibold text-[#b45309] hover:cursor-pointer hover:underline"
            >
              Vai alle richieste →
            </Link>
          </div>

          <div className="rounded-xl border border-black/10 bg-[#eaf2ff] p-4">
            <div className="text-[12px] font-semibold text-[#1d4ed8]">
              Transazioni fallite
            </div>
            <div className="mt-1 text-[11px] font-medium text-[#1f2b20]/70">
              Rilevato un picco di transazioni fallite da attrezzature (52) nelle
              ultime 2 ore.
            </div>
            <Link
              href="/transactions"
              className="mt-2 inline-block text-[11px] font-semibold text-[#1d4ed8] hover:cursor-pointer hover:underline"
            >
              Vedi log →
            </Link>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Vendite totali (Lordo)", value: "€1,245,670.00" },
            { label: "Commissioni generate", value: "€45,820.50" },
            { label: "Ordini totali", value: "12,458" },
            { label: "Ticket medio", value: "€99.99" },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-xl border border-black/10 bg-white px-5 py-4 shadow-sm"
            >
              <div className="text-[11px] font-semibold text-[#6b746c]">
                {k.label}
              </div>
              <div className="mt-2 text-[18px] font-semibold text-[#1f2b20]">
                {k.value}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.55fr_0.75fr]">
          <div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
                ANDAMENTO VENDITE E COMMISSIONI
              </div>

              <div className="relative" ref={rangeRef}>
                <button
                  type="button"
                  onClick={() => setRangeOpen((v) => !v)}
                  aria-expanded={rangeOpen}
                  aria-haspopup="menu"
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-black/10 bg-white px-3 text-[11px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-black/5"
                >
                  Ultimi {salesRangeDays} giorni
                  <ChevronDown
                    className={`h-[18px] w-[18px] text-[#6b746c] transition-transform ${rangeOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {rangeOpen ? (
                    <motion.div
                      key="sales-range-menu"
                      role="menu"
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                      className="absolute right-0 z-50 mt-2 w-52 rounded-2xl border border-black/10 bg-white p-2 shadow-[0_18px_40px_rgba(16,24,16,0.12)]"
                    >
                      {([7, 30, 90] as const).map((d) => {
                        const isActive = salesRangeDays === d;
                        return (
                          <button
                            key={d}
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setSalesRangeDays(d);
                              setRangeOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[12px] font-semibold hover:cursor-pointer hover:bg-black/5 ${isActive ? "bg-black/5 text-[#1f2b20]" : "text-[#1f2b20]"}`}
                          >
                            Ultimi {d} giorni
                            {isActive ? (
                              <span className="text-[11px] text-[#6b746c]">✓</span>
                            ) : null}
                          </button>
                        );
                      })}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-4 text-[10px] font-semibold text-[#6b746c]">
              <span className="inline-flex items-center gap-2">
                <span className="h-[2px] w-5 rounded bg-[#214e3a]" />
                Vendite totali (€)
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-sm bg-[#a7dd7b]" />
                Commissioni (€)
              </span>
            </div>

            <div className="mt-2 h-[260px] w-full">
              <RevenueCommissionChart data={chartData} />
            </div>
          </div>

          <div className="rounded-xl border border-black/10 bg-white shadow-sm">
            <div className="flex items-center justify-between px-5 py-4">
              <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
                TOP VENDITORI MENSILI
              </div>
              <Link
                href="/vendors"
                className="text-[11px] font-semibold text-[#38A169] hover:cursor-pointer hover:underline"
              >
                Vedi tutti
              </Link>
            </div>
            <div className="h-px w-full bg-black/5" />
            <div className="bg-[#f6f7f6] px-5 py-3">
              <div className="grid grid-cols-[1fr_120px_84px] text-[10px] font-semibold tracking-wide text-[#9aa39a]">
                <div>VENDITORE</div>
                <div className="text-right">VOLUME</div>
                <div className="text-right">ORDINI</div>
              </div>
            </div>
            <div className="px-5">
              <div className="divide-y divide-black/5">
                {[
                  { name: "Tech Store Milano", cat: "Elettronica", vol: "€650,320", ord: "23,311" },
                  { name: "Fashion Boutique", cat: "Abbigliamento", vol: "€422,150", ord: "19,210" },
                  { name: "Home Goods Spa", cat: "Casa", vol: "€388,900", ord: "19,021" },
                ].map((r) => (
                  <div
                    key={r.name}
                    className="grid grid-cols-[1fr_120px_84px] items-start py-4"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-[11px] font-semibold text-[#1f2b20]">
                        {r.name}
                      </div>
                      <div className="mt-0.5 text-[10px] font-medium text-[#9aa39a]">
                        {r.cat}
                      </div>
                    </div>
                    <div className="text-right text-[11px] font-semibold text-[#1f2b20]">
                      {r.vol}
                    </div>
                    <div className="text-right text-[11px] font-medium text-[#6b746c]">
                      {r.ord}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
                VENDITORI
              </div>
              <span className="rounded-md bg-[#e7f6ea] px-2 py-1 text-[10px] font-semibold text-[#38A169]">
                +6 oggi
              </span>
            </div>
            <div className="mt-3 text-[22px] font-semibold text-[#1f2b20]">5,620</div>
            <div className="mt-0.5 text-[11px] font-medium text-[#9aa39a]">
              Venditori registrati totali
            </div>
            <div className="mt-4 h-[140px]">
              <MiniLineChart data={vendorsMini} color="#214e3a" tone="green" />
            </div>
          </div>

          <div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
                UTENTI
              </div>
              <span className="rounded-md bg-[#eaf2ff] px-2 py-1 text-[10px] font-semibold text-[#1d4ed8]">
                +124 oggi
              </span>
            </div>
            <div className="mt-3 text-[22px] font-semibold text-[#1f2b20]">35,289</div>
            <div className="mt-0.5 text-[11px] font-medium text-[#9aa39a]">
              Utenti registrati totali
            </div>
            <div className="mt-4 h-[140px]">
              <MiniLineChart data={usersMini} color="#2563eb" tone="blue" />
            </div>
          </div>

          <div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
                NOVITÀ E AVVISI
              </div>
              <span className="text-[#9aa39a]">›</span>
            </div>
            <div className="mt-4 space-y-4">
              {[
                {
                  date: "10 Febbraio 2026",
                  text: "Aggiornamento commissioni per la categoria Elettronica a partire da Marzo.",
                },
                {
                  date: "9 Febbraio 2026",
                  text: "Aggiornamento documentazione per la categoria Elettronica a partire da Marzo.",
                },
                {
                  date: "7 Febbraio 2026",
                  text: "Aggiornamento documentazione per la categoria Elettronica a partire da Marzo.",
                },
                {
                  date: "05 Febbraio 2026",
                  text: "Nuove funzionalità di spedizione espresso disponibili per tutti i venditori.",
                },
              ].map((n) => (
                <div key={n.date} className="border-l-2 border-[#76C043] pl-3">
                  <div className="text-[10px] font-semibold text-[#9aa39a]">
                    {n.date}
                  </div>
                  <div className="mt-1 text-[11px] font-medium text-[#1f2b20]">
                    {n.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
            <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
              STATISTICHE VENDITORI
            </div>
            <div className="mt-4">
              <div className="text-[11px] font-semibold text-[#9aa39a]">
                Venditori Totali
              </div>
              <div className="mt-1 text-[22px] font-semibold text-[#1f2b20]">
                5,620
              </div>
            </div>

            <div className="mt-4 space-y-3 text-[11px]">
              {[
                { label: "Attivi", color: "#16a34a", val: "5,226 (93%)" },
                { label: "Sospesi", color: "#f59e0b", val: "209 (4%)" },
                { label: "Bloccati", color: "#ef4444", val: "185 (3%)" },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#1f2b20]">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: r.color }}
                    />
                    <span className="font-medium">{r.label}</span>
                  </div>
                  <div className="font-semibold text-[#6b746c]">{r.val}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
            <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
              STATISTICHE CLIENTI
            </div>
            <div className="mt-4">
              <div className="text-[11px] font-semibold text-[#9aa39a]">
                Venditori Totali
              </div>
              <div className="mt-1 text-[22px] font-semibold text-[#1f2b20]">
                35,289
              </div>
            </div>

            <div className="mt-4 space-y-3 text-[11px]">
              {[
                { label: "Attivi", color: "#16a34a", val: "32,118 (93%)" },
                { label: "Sospesi", color: "#f59e0b", val: "1,811 (4%)" },
                { label: "Bloccati", color: "#ef4444", val: "1,358 (3%)" },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#1f2b20]">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: r.color }}
                    />
                    <span className="font-medium">{r.label}</span>
                  </div>
                  <div className="font-semibold text-[#6b746c]">{r.val}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
            <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
              STATO MARKETPLACE
            </div>
            <div className="mt-4 space-y-3">
              {[
                {
                  title: "Transazioni pendenti",
                  sub: "In attesa di conferma gateway",
                  val: "142",
                },
                {
                  title: "Transazioni Fallite",
                  sub: "Ultime 24 ore",
                  val: "8",
                },
                {
                  title: "Payout in attesa",
                  sub: "Da liquidare ai vendor",
                  val: "€125.4K",
                },
              ].map((r) => (
                <div
                  key={r.title}
                  className="rounded-lg bg-[#f6f7f6] px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold text-[#1f2b20]">
                        {r.title}
                      </div>
                      <div className="mt-0.5 text-[10px] font-medium text-[#9aa39a]">
                        {r.sub}
                      </div>
                    </div>
                    <div className="shrink-0 text-[12px] font-semibold text-[#1f2b20]">
                      {r.val}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

