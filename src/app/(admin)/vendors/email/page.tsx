"use client";

import { ChevronRight, X } from "lucide-react";
import { Inter } from "next/font/google";
import Link from "next/link";
import { useMemo } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { useVendorSelection } from "@/components/vendors/VendorSelectionProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const inter = Inter({
  subsets: ["latin"],
});

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-black/10 bg-white shadow-sm">
      <div className="px-6 py-4">
        <div className="text-[11px] font-semibold tracking-wide text-[#1f2b20]">
          {title}
        </div>
      </div>
      <div className="h-px w-full bg-black/5" />
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  placeholder,
  required,
  disabled,
  value,
}: {
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="text-[10px] font-semibold text-[#6b746c]">
        {label}
        {required ? <span className="text-[#ef4444]"> *</span> : null}
      </div>
      <input
        disabled={disabled}
        defaultValue={value}
        placeholder={placeholder}
        className={`h-10 w-full rounded-lg border border-black/10 px-3 text-[12px] font-medium outline-none placeholder:text-[#c0c6c0] focus:border-[#5DBE54] focus:ring-4 focus:ring-[#5DBE54]/15 ${
          disabled ? "bg-[#f6f7f6] text-[#6b746c]" : "bg-white text-[#1f2b20]"
        }`}
      />
    </div>
  );
}

function RecipientChip({
  initials,
  name,
  email,
}: {
  initials: string;
  name: string;
  email: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[#f6f7f6] px-4 py-3">
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
  );
}

function AttachmentRow({
  name,
  size,
}: {
  name: string;
  size: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-white px-4 py-3">
      <div className="min-w-0">
        <div className="truncate text-[11px] font-semibold text-[#1f2b20]">
          {name}
        </div>
        <div className="mt-0.5 text-[10px] font-medium text-[#9aa39a]">{size}</div>
      </div>
      <button
        type="button"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#9aa39a] hover:cursor-pointer hover:bg-black/5"
        aria-label="Rimuovi allegato"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function VendorsBulkEmailPage() {
  const { selectedById } = useVendorSelection();

  const recipients = useMemo(
    () => [
      { initials: "MR", name: "Maria Rossi", email: "maria.rossi@email.it" },
      { initials: "LB", name: "Luca Bianchi", email: "luca.bianchi@email.it" },
      { initials: "GV", name: "Giulia Verdi", email: "giulia.verdi@email.it" },
      { initials: "MC", name: "Marco Conti", email: "marco.conti@email.it" },
      { initials: "SF", name: "Sofia Ferrari", email: "sofia.ferrari@email.it" },
      { initials: "DR", name: "Davide Romano", email: "davide.romano@email.it" },
    ],
    [],
  );

  const selectedRecipients = useMemo(() => {
    const rows = Array.from(selectedById.values());
    if (rows.length === 0) return recipients;
    return rows.map((r) => ({
      initials: r.name
        .split(" ")
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase(),
      name: r.name,
      email: r.email,
    }));
  }, [recipients, selectedById]);

  const tooltipRecipients = useMemo(
    () => selectedRecipients.slice(0, 5),
    [selectedRecipients],
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
            <span className="text-[#6b746c]">Invia email di massa</span>
          </span>
        }
      />

      <div className={`mx-auto w-full max-w-6xl px-6 py-6 ${inter.className}`}>
        <div className="space-y-4">
          <SectionCard title="DESTINATARI SELEZIONATI">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {selectedRecipients.slice(0, 6).map((r) => (
                <RecipientChip key={r.email} {...r} />
              ))}

              <TooltipProvider>
                <Tooltip delayDuration={120}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-center rounded-xl border border-dashed border-black/15 bg-white px-4 py-3 text-[11px] font-semibold text-[#6b746c] hover:cursor-pointer">
                      +1 altri
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center">
                    <div className="flex flex-col gap-1">
                      {tooltipRecipients.map((u) => (
                        <div key={u.email} className="leading-tight">
                          <div className="font-semibold">{u.name}</div>
                          <div className="text-[10px] font-medium text-[#9aa39a]">
                            {u.email}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Link
                href="/vendors/email/recipients"
                className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-[#214e3a] px-4 text-[12px] font-semibold text-white shadow-sm hover:cursor-pointer hover:bg-[#1a3f2e]"
              >
                Modifica selezione
              </Link>
            </div>
          </SectionCard>

          <SectionCard title="COMPONI EMAIL">
            <div className="space-y-4">
              <Field label="Mittente" disabled value="noreply@3rate.com" />
              <Field
                label="Oggetto email"
                required
                placeholder="Es: Importante aggiornamento per i venditori..."
              />

              <div className="space-y-2">
                <div className="text-[10px] font-semibold text-[#6b746c]">
                  Testo del messaggio <span className="text-[#ef4444]">*</span>
                </div>
                <textarea
                  placeholder="Scrivi qui il tuo messaggio..."
                  className="min-h-[240px] w-full rounded-lg border border-black/10 bg-white px-3 py-3 text-[12px] font-medium text-[#1f2b20] outline-none placeholder:text-[#c0c6c0] focus:border-[#5DBE54] focus:ring-4 focus:ring-[#5DBE54]/15"
                />
                <div className="text-[10px] font-medium text-[#9aa39a]">
                  Puoi usare variabili: {"{nome}"}, {"{cognome}"}, {"{email}"},{" "}
                  {"{id_utente}"}
                </div>
              </div>

              <div className="pt-2">
                <div className="text-[10px] font-semibold text-[#6b746c]">Allegati</div>
                <div className="mt-3 space-y-3">
                  <AttachmentRow name="Linee_Guida_Vendite.docx" size="1.8 MB" />
                  <AttachmentRow name="Tariffe_Commissioni.xlsx" size="856 KB" />

                  <button
                    type="button"
                    className="flex w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-black/15 bg-white px-4 py-8 text-center hover:cursor-pointer hover:bg-black/[0.02]"
                  >
                    <div className="text-[11px] font-semibold text-[#1f2b20]">
                      Aggiungi altro allegato
                    </div>
                    <div className="text-[10px] font-medium text-[#9aa39a]">
                      PDF, DOC, DOCX, XLS, XLSX (max 10MB)
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </SectionCard>

          <div className="sticky bottom-0 -mx-6 border-t border-black/5 bg-[#f3f5f2] px-6 py-4">
            <button
              type="button"
              className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#214e3a] text-[12px] font-semibold text-white shadow-sm hover:cursor-pointer hover:bg-[#1a3f2e] active:translate-y-px"
            >
              Invia email
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

