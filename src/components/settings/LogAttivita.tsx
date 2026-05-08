"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Search,
  User,
} from "lucide-react";
import { Clock } from "lucide-react";
import { useState } from "react";
import { Dropdown } from "@/components/ui/dropdown";

const PERIODO_OPTIONS = [
  { value: "7", label: "Ultimi 7 giorni" },
  { value: "30", label: "Ultimi 30 giorni" },
  { value: "90", label: "Ultimi 90 giorni" },
  { value: "365", label: "Ultimo anno" },
];

const TIPO_ATTIVITA_OPTIONS = [
  { value: "tutte", label: "Tutte le attività" },
  { value: "impostazioni", label: "Modifiche impostazioni" },
  { value: "venditori", label: "Gestione venditori" },
  { value: "finanziarie", label: "Operazioni finanziarie" },
  { value: "accessi", label: "Accessi e Logout" },
  { value: "sicurezza", label: "Eventi di sicurezza" },
  { value: "permessi", label: "Modifiche permessi" },
];

const ADMIN_OPTIONS = [
  { value: "tutti", label: "Tutti gli admin" },
  { value: "adm-001", label: "Super Admin (ADM-001)" },
  { value: "adm-002", label: "Super Admin (ADM-002)" },
  { value: "sistema", label: "Sistema Automatico" },
];

type LogEntry = {
  id: string;
  title: string;
  description: string;
  actor: string;
  time: string;
  ip: string;
};

const LOG_ENTRIES: LogEntry[] = [
  {
    id: "l1",
    title: "Modifica commissioni default",
    description: "Commissione marketplace globale modificata da 3.5% a 2.5%",
    actor: "Super Admin (ADM-001)",
    time: "Oggi alle 14:32",
    ip: "192.168.1.45",
  },
  {
    id: "l2",
    title: "Approvazione venditore",
    description:
      'Venditore "TechStore Milano" (VND-1847) approvato e attivato',
    actor: "Sistema Automatico",
    time: "Oggi alle 13:18",
    ip: "192.168.1.22",
  },
  {
    id: "l3",
    title: "Riconciliazione manuale",
    description:
      "Bonifico €1,245.00 riconciliato manualmente per VND-1523 - Transazione TRX-98234",
    actor: "Super Admin (ADM-002)",
    time: "Oggi alle 11:45",
    ip: "192.168.1.18",
  },
  {
    id: "l4",
    title: "Tentativo accesso fallito",
    description: "3 tentativi di accesso falliti per account admin@3rate.com",
    actor: "Sistema Automatico",
    time: "Oggi alle 10:22",
    ip: "185.94.166.72",
  },
  {
    id: "l5",
    title: "Aggiornamento Chiave API",
    description: "Chiave API Klarna rigenerata e aggiornata con successo",
    actor: "Super Admin (ADM-001)",
    time: "Ieri alle 16:55",
    ip: "192.168.1.45",
  },
  {
    id: "l6",
    title: "Modifica permessi ruolo",
    description:
      "Ruolo \"Supporto\" aggiornato: aggiunto permesso visione 'Dashboard'",
    actor: "Super Admin (ADM-001)",
    time: "2 giorni fa alle 09:15",
    ip: "192.168.1.45",
  },
];

const ACTIVITY_TYPES: { id: string; label: string }[] = [
  { id: "modifiche-impostazioni", label: "Modifiche impostazioni" },
  { id: "gestione-venditori", label: "Gestione venditori" },
  { id: "operazioni-finanziarie", label: "Operazioni finanziarie" },
  { id: "accessi-logout", label: "Accessi e Logout" },
  { id: "eventi-sicurezza", label: "Eventi di sicurezza" },
  { id: "modifiche-permessi", label: "Modifiche permessi" },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-medium text-[#6b746c]">{children}</span>
  );
}

function CheckSquare({ checked }: { checked: boolean }) {
  if (checked) {
    return (
      <span aria-hidden className="inline-block h-4 w-4 rounded-sm bg-[#214e3a]" />
    );
  }
  return (
    <span
      aria-hidden
      className="inline-block h-4 w-4 rounded-sm border border-black/20"
    />
  );
}

export function LogAttivitaContent() {
  const [page, setPage] = useState(1);
  const [periodo, setPeriodo] = useState("30");
  const [tipoAttivita, setTipoAttivita] = useState("tutte");
  const [admin, setAdmin] = useState("tutti");
  const [enabledTypes, setEnabledTypes] = useState<Set<string>>(
    () => new Set(ACTIVITY_TYPES.map((t) => t.id)),
  );

  function toggleType(id: string) {
    setEnabledTypes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-6 px-6 py-6">
      <section>
        <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
          FILTRI E RICERCA
        </div>
        <p className="mt-2 max-w-3xl text-[11px] font-medium text-[#6b746c]">
          Filtra e cerca tra le attività amministrative registrate nel sistema.
          Tutti i log sono conservati per 365 giorni.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
          <label className="block">
            <FieldLabel>Periodo</FieldLabel>
            <div className="mt-1">
              <Dropdown
                value={periodo}
                onChange={setPeriodo}
                options={PERIODO_OPTIONS}
                ariaLabel="Periodo"
              />
            </div>
          </label>

          <label className="block">
            <FieldLabel>Tipo Attività</FieldLabel>
            <div className="mt-1">
              <Dropdown
                value={tipoAttivita}
                onChange={setTipoAttivita}
                options={TIPO_ATTIVITA_OPTIONS}
                ariaLabel="Tipo attività"
              />
            </div>
          </label>

          <label className="block">
            <FieldLabel>Amministratore</FieldLabel>
            <div className="mt-1">
              <Dropdown
                value={admin}
                onChange={setAdmin}
                options={ADMIN_OPTIONS}
                ariaLabel="Amministratore"
              />
            </div>
          </label>
        </div>

        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa39a]" />
          <input
            type="text"
            placeholder="Cerca per ID transazione, venditore, azione..."
            aria-label="Cerca log"
            className="h-10 w-full rounded-lg border border-black/10 bg-white pl-10 pr-3 text-[12px] font-medium text-[#1f2b20] outline-none placeholder:text-[#9aa39a] focus:border-[#5DBE54] focus:ring-2 focus:ring-[#5DBE54]/15"
          />
        </div>
      </section>

      <section>
        <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
          REGISTRO ATTIVITÀ
        </div>

        <div className="mt-4 space-y-3">
          {LOG_ENTRIES.map((entry) => (
            <div
              key={entry.id}
              className="rounded-xl border border-black/10 bg-white px-4 py-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[12px] font-semibold text-[#1f2b20]">
                    {entry.title}
                  </div>
                  <div className="mt-1 text-[11px] font-medium text-[#6b746c]">
                    {entry.description}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[10px] font-medium text-[#9aa39a]">
                    <span className="inline-flex items-center gap-1.5">
                      <User className="h-3 w-3" />
                      {entry.actor}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {entry.time}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Monitor className="h-3 w-3" />
                      {entry.ip}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label={`Espandi ${entry.title}`}
                  className="inline-flex h-7 w-7 flex-none items-center justify-center rounded-md text-[#6b746c] hover:cursor-pointer hover:bg-black/5"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            aria-label="Pagina precedente"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#6b746c] hover:cursor-pointer hover:bg-black/5"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {[1, 2, 3].map((n) => {
            const active = page === n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                aria-label={`Pagina ${n}`}
                aria-current={active ? "page" : undefined}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-[11px] font-semibold hover:cursor-pointer ${
                  active
                    ? "bg-[#214e3a] text-white"
                    : "text-[#1f2b20] hover:bg-black/5"
                }`}
              >
                {n}
              </button>
            );
          })}
          <span className="px-1 text-[11px] font-medium text-[#9aa39a]">
            …
          </span>
          <button
            type="button"
            onClick={() => setPage(69)}
            aria-label="Pagina 69"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[11px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-black/5"
          >
            69
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(69, p + 1))}
            aria-label="Pagina successiva"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#6b746c] hover:cursor-pointer hover:bg-black/5"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section>
        <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
          IMPOSTAZIONI LOG
        </div>
        <p className="mt-2 text-[11px] font-medium text-[#6b746c]">
          Configura quali attività devono essere registrate.
        </p>

        <div className="mt-4 rounded-xl border border-black/10 bg-white px-5 py-5">
          <div className="text-[12px] font-semibold text-[#1f2b20]">
            Tipi di attività da registrare
          </div>

          <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {ACTIVITY_TYPES.map((t) => {
              const checked = enabledTypes.has(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleType(t.id)}
                  className="inline-flex items-center gap-2.5 text-left hover:cursor-pointer"
                >
                  <CheckSquare checked={checked} />
                  <span className="text-[12px] font-medium text-[#1f2b20]">
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
