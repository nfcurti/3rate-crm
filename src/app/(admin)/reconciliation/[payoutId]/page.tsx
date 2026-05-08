"use client";

import { ChevronRight, Copy, Eye } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { Dropdown } from "@/components/ui/dropdown";

const ADJUSTMENT_TIPO_OPTIONS = [
  { value: "debito", label: "Debito (Riduci saldo sistema)" },
  { value: "credito", label: "Credito (Aumenta saldo sistema)" },
];

const ADJUSTMENT_MOTIVAZIONE_OPTIONS = [
  { value: "fee", label: "Fee provider non corretta" },
  { value: "rimborso", label: "Rimborso parziale al cliente" },
  { value: "errore", label: "Errore di registrazione" },
];

type AssociatedTx = {
  id: string;
  txId: string;
  vendorRef: string;
  date: string;
  customer: string;
  importo: string;
  netto: string;
};

const ASSOCIATED_TX_DEMO: AssociatedTx[] = [
  {
    id: "a1",
    txId: "#3R-8841203",
    vendorRef: "VND-001",
    date: "14 Ott, 14:32",
    customer: "Marco Rossi",
    importo: "€149.99",
    netto: "€146.24",
  },
  ...Array.from({ length: 10 }).map((_, i) => ({
    id: `a${i + 2}`,
    txId: "#3R-8841189",
    vendorRef: "VND-001",
    date: "14 Ott, 11:18",
    customer: "Giulia Bianchi",
    importo: "€350.00",
    netto: "€341.25",
  })),
];

export default function PayoutDetailPage({
  params,
}: {
  params: Promise<{ payoutId: string }>;
}) {
  const { payoutId } = use(params);
  void payoutId;

  const [adjustmentTipo, setAdjustmentTipo] = useState("debito");
  const [adjustmentMotivazione, setAdjustmentMotivazione] = useState("fee");

  return (
    <>
      <Topbar
        title={null}
        breadcrumb={
          <span className="inline-flex items-center gap-2">
            <Link
              href="/reconciliation"
              className="hover:cursor-pointer hover:underline"
            >
              Bonifici e riconciliazione
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-[#6b746c]">Dettaglio bonifico</span>
          </span>
        }
      />

      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <section className="overflow-hidden rounded-xl border border-[#f3c2c2] bg-[#fdecec] shadow-sm">
          <div className="flex items-stretch gap-3 px-5 py-3">
            <span aria-hidden className="w-1 rounded-sm bg-[#E53E3E]" />
            <div>
              <div className="text-[12px] font-semibold text-[#E53E3E]">
                Riconciliazione fallita (Unmatched)
              </div>
              <div className="mt-1 text-[11px] font-medium text-[#7a1c1c]">
                L&apos;importo ricevuto dal provider (Stripe) non corrisponde
                al totale delle transazioni registrate nel sistema per questo
                periodo. È richiesta un&apos;azione manuale.
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[340px_1fr]">
          <div className="space-y-4">
            <div className="rounded-xl border border-black/10 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-3 px-5 py-4">
                <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
                  DETTAGLIO PAYOUT
                </div>
                <span className="inline-flex items-center rounded-full bg-[#fdecec] px-3 py-1 text-[10px] font-semibold text-[#E53E3E]">
                  Unmatched
                </span>
              </div>
              <div className="h-px w-full bg-black/5" />
              <div className="space-y-4 px-5 py-4">
                <div>
                  <div className="text-[10px] font-medium text-[#9aa39a]">
                    ID Bonifico (Provider Ref)
                  </div>
                  <div className="mt-1 inline-flex items-center gap-2 text-[12px] font-semibold text-[#1f2b20]">
                    <span>po_1Oq2x5LkdlwHu7eZ9qX4</span>
                    <button
                      type="button"
                      className="text-[#9aa39a] hover:cursor-pointer hover:text-[#1f2b20]"
                      aria-label="Copia ID bonifico"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] font-medium text-[#9aa39a]">
                      Data Creazione
                    </div>
                    <div className="mt-1 text-[12px] font-semibold text-[#1f2b20]">
                      15 Ott 2024, 12:15
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-medium text-[#9aa39a]">
                      Data Valuta
                    </div>
                    <div className="mt-1 text-[12px] font-semibold text-[#1f2b20]">
                      17 Ott 2024
                    </div>
                  </div>
                </div>

                <div className="border-t border-black/5 pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-[#6b746c]">
                        Importo Provider:
                      </span>
                      <span className="text-[12px] font-semibold text-[#1f2b20]">
                        €850.00
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-[#6b746c]">
                        Importo Sistema:
                      </span>
                      <span className="text-[12px] font-semibold text-[#1f2b20]">
                        €855.50
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-[#6b746c]">
                        Commissioni Provider:
                      </span>
                      <span className="text-[12px] font-semibold text-[#1f2b20]">
                        €12.50
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-black/5 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-[#1f2b20]">
                      Delta (Discrepanza):
                    </span>
                    <span className="text-[13px] font-semibold text-[#E53E3E]">
                      -€5.50
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-black/10 bg-white shadow-sm">
              <div className="px-5 py-4">
                <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
                  DATI VENDITORI E BANCA
                </div>
              </div>
              <div className="h-px w-full bg-black/5" />
              <div className="space-y-3 px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[12px] font-semibold text-[#1f2b20]">
                      Moda Boutique
                    </div>
                    <div className="mt-0.5 text-[10px] font-medium text-[#9aa39a]">
                      ID: VND-042
                    </div>
                  </div>
                  <Link
                    href="/vendors/1"
                    className="text-[11px] font-semibold text-[#9aa39a] hover:cursor-pointer hover:text-[#1f2b20]"
                  >
                    Vedi Profilo
                  </Link>
                </div>

                <div className="rounded-xl border border-black/10 bg-[#F9FAFB] p-4">
                  <div className="text-[12px] font-semibold text-[#1f2b20]">
                    Intesa Sanpaolo
                  </div>
                  <div className="mt-3 text-[10px] font-medium text-[#9aa39a]">
                    IBAN
                  </div>
                  <div className="mt-1 text-[11px] font-medium tracking-wider text-[#1f2b20]">
                    IT60 X054 2811 **** **** **** 854
                  </div>
                  <div className="mt-3 text-[10px] font-medium text-[#9aa39a]">
                    Intestatario
                  </div>
                  <div className="mt-1 text-[11px] font-semibold text-[#1f2b20]">
                    Moda Boutique Srl
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-black/10 bg-white shadow-sm">
              <div className="px-5 py-4">
                <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
                  AZIONI DI RICONCILIAZIONE
                </div>
              </div>
              <div className="h-px w-full bg-black/5" />
              <div className="px-5 py-4">
                <div className="text-[11px] font-medium text-[#6b746c]">
                  Seleziona un&apos;azione per risolvere la discrepanza
                </div>

                <div className="mt-4 rounded-xl border border-black/10 bg-white p-4">
                  <div className="text-[12px] font-semibold text-[#1f2b20]">
                    Nuovo adjustment
                  </div>

                  <div className="mt-4 space-y-3">
                    <label className="block">
                      <span className="text-[10px] font-medium text-[#9aa39a]">
                        Tipo
                      </span>
                      <div className="mt-1">
                        <Dropdown
                          value={adjustmentTipo}
                          onChange={setAdjustmentTipo}
                          options={ADJUSTMENT_TIPO_OPTIONS}
                          size="sm"
                          ariaLabel="Tipo adjustment"
                        />
                      </div>
                    </label>

                    <label className="block">
                      <span className="text-[10px] font-medium text-[#9aa39a]">
                        Importo (€)
                      </span>
                      <input
                        type="text"
                        defaultValue="5.50"
                        className="mt-1 h-8 w-full rounded-md border border-black/10 bg-white px-2 text-[11px] font-medium text-[#1f2b20] outline-none focus:border-[#5DBE54] focus:ring-2 focus:ring-[#5DBE54]/15"
                      />
                    </label>

                    <label className="block">
                      <span className="text-[10px] font-medium text-[#9aa39a]">
                        Motivazione
                      </span>
                      <div className="mt-1">
                        <Dropdown
                          value={adjustmentMotivazione}
                          onChange={setAdjustmentMotivazione}
                          options={ADJUSTMENT_MOTIVAZIONE_OPTIONS}
                          size="sm"
                          ariaLabel="Motivazione adjustment"
                        />
                      </div>
                    </label>

                    <label className="block">
                      <textarea
                        rows={3}
                        placeholder="Note aggiuntive..."
                        className="mt-1 w-full resize-none rounded-md border border-black/10 bg-white px-2 py-2 text-[11px] font-medium text-[#1f2b20] outline-none placeholder:text-[#9aa39a] focus:border-[#5DBE54] focus:ring-2 focus:ring-[#5DBE54]/15"
                      />
                    </label>

                    <button
                      type="button"
                      className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-[#214e3a] text-[12px] font-semibold text-white hover:cursor-pointer hover:bg-[#1a3f2e]"
                    >
                      Applica adjustment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-black/10 bg-white shadow-sm">
            <div className="px-6 py-4">
              <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
                TRANSAZIONI ASSOCIATE
              </div>
            </div>
            <div className="h-px w-full bg-black/5" />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead className="text-[10px] font-semibold tracking-wide text-[#9aa39a]">
                  <tr className="border-b border-black/5">
                    <th className="px-6 py-4">ID TRANSAZIONE</th>
                    <th className="py-4 pr-4">DATA</th>
                    <th className="py-4 pr-4">CLIENTE</th>
                    <th className="py-4 pr-4 text-right">IMPORTO</th>
                    <th className="py-4 pr-4 text-right">NETTO</th>
                    <th className="w-[80px] px-6 py-4 text-center">STATO</th>
                  </tr>
                </thead>
                <tbody className="text-[12px] text-[#1f2b20]">
                  {ASSOCIATED_TX_DEMO.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-black/5 transition-colors hover:bg-black/[0.02]"
                    >
                      <td className="px-6 py-4 align-middle">
                        <div className="text-[11px] font-semibold">
                          {tx.txId}
                        </div>
                        <div className="mt-1 text-[10px] font-medium text-[#9aa39a]">
                          ID: {tx.vendorRef}
                        </div>
                      </td>
                      <td className="py-4 pr-4 align-middle text-[11px] font-medium text-[#6b746c]">
                        {tx.date}
                      </td>
                      <td className="py-4 pr-4 align-middle text-[11px] font-medium">
                        {tx.customer}
                      </td>
                      <td className="py-4 pr-4 align-middle text-right text-[11px] font-semibold">
                        {tx.importo}
                      </td>
                      <td className="py-4 pr-4 align-middle text-right text-[11px] font-medium text-[#6b746c]">
                        {tx.netto}
                      </td>
                      <td className="px-6 py-4 align-middle text-center">
                        <button
                          type="button"
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#6b746c] hover:cursor-pointer hover:bg-black/5"
                          aria-label={`Vedi ${tx.txId}`}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-right text-[11px] font-medium text-[#6b746c]">
                      Totale calcolato dal sistema:
                    </td>
                    <td className="py-4 pr-4 text-right text-[12px] font-semibold text-[#1f2b20]">
                      €879.99
                    </td>
                    <td className="py-4 pr-4 text-right text-[12px] font-semibold text-[#1f2b20]">
                      €855.50
                    </td>
                    <td className="px-6 py-4" />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
