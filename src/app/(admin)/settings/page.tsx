"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { LogAttivitaContent } from "@/components/settings/LogAttivita";
import { ProviderApiContent } from "@/components/settings/ProviderApi";
import {
  RuoliPermessiContent,
  StaffUsersCard,
} from "@/components/settings/RuoliPermessi";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

type TabId = "generali" | "provider" | "ruoli" | "log";

const TABS: { id: TabId; label: string }[] = [
  { id: "generali", label: "Generali e commissioni" },
  { id: "provider", label: "Provider e API" },
  { id: "ruoli", label: "Ruoli e permessi" },
  { id: "log", label: "Log attività" },
];

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-none items-center rounded-full transition-colors hover:cursor-pointer ${
        checked ? "bg-[#38A169]" : "bg-black/15"
      }`}
    >
      <span
        aria-hidden
        className={`absolute top-1/2 inline-block h-5 w-5 -translate-y-1/2 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function StatusRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[12px] font-medium text-[#1f2b20]">{label}</span>
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#38A169]">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#38A169]" />
        {value}
      </span>
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<TabId>("generali");
  const [autoApprove, setAutoApprove] = useState(false);
  const [requireVisura, setRequireVisura] = useState(true);
  const [confirmAction, setConfirmAction] = useState<
    | null
    | { type: "toggle"; key: "autoApprove" | "requireVisura"; next: boolean }
    | { type: "suspendRegistrations" }
  >(null);

  const isGenerali = tab === "generali";

  return (
    <>
      <Topbar title="Impostazioni di sistema" />

      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <ConfirmationModal
          open={confirmAction !== null}
          onClose={() => setConfirmAction(null)}
          title={
            confirmAction?.type === "suspendRegistrations"
              ? "Sospendere nuove registrazioni?"
              : confirmAction?.type === "toggle" && confirmAction.key === "autoApprove"
                ? "Attivare approvazione automatica?"
                : confirmAction?.type === "toggle" &&
                    confirmAction.key === "requireVisura"
                  ? "Modificare requisito visura camerale?"
                  : "Confermi azione?"
          }
          description={
            confirmAction?.type === "suspendRegistrations" ? (
              <>
                Le nuove registrazioni verranno sospese per tutti i venditori finché non
                riattivi manualmente la funzionalità.
              </>
            ) : confirmAction?.type === "toggle" &&
              confirmAction.key === "autoApprove" ? (
              confirmAction.next ? (
                <>I nuovi venditori verranno approvati automaticamente dopo l&apos;acquisto.</>
              ) : (
                <>I nuovi venditori non verranno più approvati automaticamente.</>
              )
            ) : confirmAction?.type === "toggle" &&
              confirmAction.key === "requireVisura" ? (
              confirmAction.next ? (
                <>
                  La visura camerale diventerà obbligatoria per le nuove registrazioni
                  B2B.
                </>
              ) : (
                <>
                  La visura camerale non sarà più obbligatoria per le nuove registrazioni
                  B2B.
                </>
              )
            ) : undefined
          }
          confirmLabel={
            confirmAction?.type === "suspendRegistrations"
              ? "Sospendi"
              : confirmAction?.type === "toggle"
                ? "Conferma"
                : "Conferma"
          }
          variant={confirmAction?.type === "suspendRegistrations" ? "danger" : "primary"}
          onConfirm={() => {
            if (!confirmAction) return;
            if (confirmAction.type === "toggle") {
              if (confirmAction.key === "autoApprove") setAutoApprove(confirmAction.next);
              if (confirmAction.key === "requireVisura") setRequireVisura(confirmAction.next);
            }
            if (confirmAction.type === "suspendRegistrations") {
              // TODO: wire to backend
            }
          }}
        />

        <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
          <div className="flex items-center gap-6 border-b border-black/10 px-6 text-[12px] font-semibold text-[#6b746c]">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`relative -mb-px py-4 hover:cursor-pointer ${
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

          {tab === "ruoli" ? (
            <RuoliPermessiContent />
          ) : tab === "provider" ? (
            <ProviderApiContent />
          ) : tab === "log" ? (
            <LogAttivitaContent />
          ) : isGenerali ? (
            <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[1fr_320px]">
              <div>
                <div>
                  <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
                    COMMISSIONI DEFAULT
                  </div>
                  <p className="mt-2 max-w-2xl text-[11px] font-medium text-[#6b746c]">
                    Queste sono le commissioni applicate di default ai nuovi
                    venditori, a meno che non vengano sovrascritte a livello di
                    singolo venditore.
                  </p>

                  <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-[11px] font-medium text-[#6b746c]">
                        Commissione piattaforma (%)
                      </span>
                      <div className="relative mt-1">
                        <input
                          type="text"
                          defaultValue="2.5"
                          className="h-10 w-full rounded-lg border border-black/10 bg-white pl-3 pr-9 text-[12px] font-medium text-[#1f2b20] outline-none focus:border-[#5DBE54] focus:ring-2 focus:ring-[#5DBE54]/15"
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-medium text-[#9aa39a]">
                          %
                        </span>
                      </div>
                    </label>

                    <label className="block">
                      <span className="text-[11px] font-medium text-[#6b746c]">
                        Soglia minima payout (€)
                      </span>
                      <div className="relative mt-1">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-medium text-[#9aa39a]">
                          €
                        </span>
                        <input
                          type="text"
                          defaultValue="50.00"
                          className="h-10 w-full rounded-lg border border-black/10 bg-white pl-7 pr-3 text-[12px] font-medium text-[#1f2b20] outline-none focus:border-[#5DBE54] focus:ring-2 focus:ring-[#5DBE54]/15"
                        />
                      </div>
                    </label>

                    <label className="block">
                      <span className="text-[11px] font-medium text-[#6b746c]">
                        Fee fissa per transazione (€)
                      </span>
                      <div className="relative mt-1">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-medium text-[#9aa39a]">
                          €
                        </span>
                        <input
                          type="text"
                          defaultValue="0.25"
                          className="h-10 w-full rounded-lg border border-black/10 bg-white pl-7 pr-3 text-[12px] font-medium text-[#1f2b20] outline-none focus:border-[#5DBE54] focus:ring-2 focus:ring-[#5DBE54]/15"
                        />
                      </div>
                    </label>

                    <label className="block">
                      <span className="text-[11px] font-medium text-[#6b746c]">
                        Ritardo payout giorni
                      </span>
                      <div className="relative mt-1">
                        <input
                          type="text"
                          placeholder="Impostazioni API"
                          className="h-10 w-full rounded-lg border border-black/10 bg-white px-3 text-[12px] font-medium text-[#1f2b20] outline-none placeholder:text-[#9aa39a] focus:border-[#5DBE54] focus:ring-2 focus:ring-[#5DBE54]/15"
                        />
                      </div>
                    </label>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
                    ONBOARDING
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-start justify-between gap-4 rounded-xl border border-black/10 bg-white px-4 py-4">
                      <div className="min-w-0">
                        <div className="text-[12px] font-semibold text-[#1f2b20]">
                          Approvazione automatica
                        </div>
                        <div className="mt-1 text-[11px] font-medium text-[#6b746c]">
                          Approva automaticamente i venditori che acquistano un
                          pacchetto.
                        </div>
                      </div>
                      <Toggle
                        checked={autoApprove}
                        onChange={(next) =>
                          setConfirmAction({ type: "toggle", key: "autoApprove", next })
                        }
                        label="Approvazione automatica"
                      />
                    </div>

                    <div className="flex items-start justify-between gap-4 rounded-xl border border-black/10 bg-white px-4 py-4">
                      <div className="min-w-0">
                        <div className="text-[12px] font-semibold text-[#1f2b20]">
                          Richiedi visura camerale
                        </div>
                        <div className="mt-1 text-[11px] font-medium text-[#6b746c]">
                          Rendi obbligatorio il caricamento della visura per i
                          nuovi account B2B.
                        </div>
                      </div>
                      <Toggle
                        checked={requireVisura}
                        onChange={(next) =>
                          setConfirmAction({ type: "toggle", key: "requireVisura", next })
                        }
                        label="Richiedi visura camerale"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-black/10 bg-white p-5">
                  <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
                    STATO SISTEMA
                  </div>
                  <div className="mt-4 space-y-3">
                    <StatusRow label="API Klarna" value="Connesso" />
                    <StatusRow label="API Stripe Connect" value="Connesso" />
                    <StatusRow label="Servizio Email" value="Operativo" />
                  </div>
                </div>

                <div className="rounded-xl border border-[#fecaca] bg-[#fdecec]/40 p-5">
                  <div className="text-[12px] font-semibold tracking-wide text-[#E53E3E]">
                    ZONA PERICOLOSA
                  </div>
                  <p className="mt-2 text-[11px] font-medium text-[#6b746c]">
                    Azioni critiche che impattano l&apos;intero marketplace.
                  </p>
                  <button
                    type="button"
                    onClick={() => setConfirmAction({ type: "suspendRegistrations" })}
                    className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-lg border border-[#fecaca] bg-white px-3 text-[11px] font-semibold text-[#E53E3E] hover:cursor-pointer hover:bg-[#fdecec]"
                  >
                    Sospendi nuove registrazioni
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <div className="text-[12px] font-semibold text-[#1f2b20]">
                {TABS.find((t) => t.id === tab)?.label}
              </div>
              <p className="mt-2 text-[11px] font-medium text-[#6b746c]">
                Sezione in costruzione.
              </p>
            </div>
          )}
        </div>

        {tab === "ruoli" ? (
          <div className="mt-4">
            <StaffUsersCard />
          </div>
        ) : null}
      </div>
    </>
  );
}
