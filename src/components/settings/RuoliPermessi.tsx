"use client";

import { MoreVertical } from "lucide-react";
import { Fragment, useState } from "react";

type RoleId = "super-admin" | "amministrazione" | "venditore" | "supporto";

type Cell = "granted" | "available" | "na";

type PermissionRow = {
  id: string;
  label: string;
  visualizza: Cell;
  crea: Cell;
  modifica: Cell;
  elimina: Cell;
};

type PermissionSection = {
  id: string;
  title: string;
  rows: PermissionRow[];
};

const ROLES: { id: RoleId; label: string; count: number }[] = [
  { id: "super-admin", label: "SUPER ADMIN", count: 1 },
  { id: "amministrazione", label: "AMMINISTRAZIONE", count: 5 },
  { id: "venditore", label: "VENDITORE", count: 123 },
  { id: "supporto", label: "SUPPORTO", count: 8 },
];

const PERMISSIONS: PermissionSection[] = [
  {
    id: "dashboard",
    title: "DASHBOARD",
    rows: [
      {
        id: "dashboard",
        label: "Dashboard",
        visualizza: "granted",
        crea: "na",
        modifica: "na",
        elimina: "na",
      },
    ],
  },
  {
    id: "venditori",
    title: "GESTIONE VENDITORI",
    rows: [
      {
        id: "lista-venditori",
        label: "Lista venditori",
        visualizza: "granted",
        crea: "granted",
        modifica: "granted",
        elimina: "available",
      },
      {
        id: "profilo-venditore",
        label: "Profilo venditore dettagliato",
        visualizza: "granted",
        crea: "na",
        modifica: "granted",
        elimina: "na",
      },
      {
        id: "prodotti-venditore",
        label: "Gestione prodotti venditore",
        visualizza: "granted",
        crea: "available",
        modifica: "granted",
        elimina: "available",
      },
      {
        id: "transazioni-venditore",
        label: "Transazioni",
        visualizza: "granted",
        crea: "na",
        modifica: "na",
        elimina: "na",
      },
      {
        id: "payout",
        label: "Payout",
        visualizza: "granted",
        crea: "na",
        modifica: "na",
        elimina: "na",
      },
    ],
  },
  {
    id: "utenti",
    title: "GESTIONE UTENTI",
    rows: [
      {
        id: "lista-utenti",
        label: "Lista utenti",
        visualizza: "granted",
        crea: "granted",
        modifica: "granted",
        elimina: "available",
      },
      {
        id: "profilo-utente",
        label: "Profilo utente dettagliato",
        visualizza: "granted",
        crea: "na",
        modifica: "granted",
        elimina: "na",
      },
      {
        id: "ordini",
        label: "Ordini",
        visualizza: "granted",
        crea: "na",
        modifica: "na",
        elimina: "na",
      },
      {
        id: "pagamenti",
        label: "Pagamenti",
        visualizza: "granted",
        crea: "na",
        modifica: "na",
        elimina: "na",
      },
    ],
  },
  {
    id: "transazioni",
    title: "TRANSAZIONI E VENDITE",
    rows: [
      {
        id: "tutte-transazioni",
        label: "Tutte le transazioni",
        visualizza: "granted",
        crea: "na",
        modifica: "granted",
        elimina: "available",
      },
      {
        id: "rimborsi",
        label: "Rimborsi e controversie",
        visualizza: "granted",
        crea: "na",
        modifica: "granted",
        elimina: "available",
      },
    ],
  },
  {
    id: "bonifici",
    title: "BONIFICI E RICONCILIAZIONE",
    rows: [
      {
        id: "lista-bonifici",
        label: "Lista bonifici",
        visualizza: "granted",
        crea: "na",
        modifica: "granted",
        elimina: "available",
      },
      {
        id: "riconciliazione",
        label: "Riconciliazione manuale",
        visualizza: "granted",
        crea: "na",
        modifica: "granted",
        elimina: "available",
      },
    ],
  },
  {
    id: "impostazioni",
    title: "IMPOSTAZIONI SISTEMA",
    rows: [
      {
        id: "commissioni-config",
        label: "Commissioni & Configurazioni",
        visualizza: "granted",
        crea: "na",
        modifica: "available",
        elimina: "na",
      },
      {
        id: "provider-api",
        label: "Provider & API",
        visualizza: "granted",
        crea: "na",
        modifica: "available",
        elimina: "na",
      },
      {
        id: "ruoli-permessi",
        label: "Ruoli & Permessi",
        visualizza: "granted",
        crea: "na",
        modifica: "available",
        elimina: "na",
      },
      {
        id: "log-attivita",
        label: "Log Attività",
        visualizza: "granted",
        crea: "na",
        modifica: "na",
        elimina: "available",
      },
    ],
  },
];

type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const STAFF_USERS: StaffUser[] = [
  {
    id: "u1",
    name: "Marco Rossi",
    email: "marco.rossi@3rate.it",
    role: "Super Admin - ADM-001",
  },
  {
    id: "u2",
    name: "Laura Bianchi",
    email: "laura.bianchi@3rate.it",
    role: "Amministratore - AMS-006",
  },
  {
    id: "u3",
    name: "Giuseppe Verdi",
    email: "giuseppe.verdi@3rate.it",
    role: "Supporto - SPT-003",
  },
  {
    id: "u4",
    name: "Sofia Romano",
    email: "sofia.romano@3rate.it",
    role: "Amministratore - AMS-005",
  },
  {
    id: "u5",
    name: "Alessandro Conti",
    email: "alessandro.conti@3rate.it",
    role: "Supporto - SPT-005",
  },
];

function PermissionCell({ value }: { value: Cell }) {
  if (value === "granted") {
    return (
      <span
        aria-hidden
        className="inline-block h-4 w-4 rounded-sm bg-[#214e3a]"
      />
    );
  }
  if (value === "available") {
    return (
      <span
        aria-hidden
        className="inline-block h-4 w-4 rounded-sm border border-black/20"
      />
    );
  }
  return (
    <span aria-hidden className="text-[12px] font-medium text-[#9aa39a]">
      —
    </span>
  );
}

export function RuoliPermessiContent() {
  const [role, setRole] = useState<RoleId>("amministrazione");
  const activeRoleLabel =
    ROLES.find((r) => r.id === role)?.label.toLowerCase() ?? "";
  const formattedRoleLabel =
    activeRoleLabel.charAt(0).toUpperCase() + activeRoleLabel.slice(1);

  return (
    <div>
      <div className="px-6 py-6">
        <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
          GESTIONE RUOLI
        </div>
        <p className="mt-2 text-[11px] font-medium text-[#6b746c]">
          Configura i ruoli e le autorizzazioni per gli utenti staff che
          accedono al pannello amministrazione
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {ROLES.map((r) => {
            const active = role === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`rounded-xl bg-white px-4 py-4 text-left transition-colors hover:cursor-pointer ${
                  active
                    ? "border-2 border-[#1f2b20]"
                    : "border border-black/10 hover:border-black/20"
                }`}
              >
                <div className="text-[11px] font-semibold tracking-wide text-[#1f2b20]">
                  {r.label}
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-medium text-[#9aa39a]">
                    Utenti attivi
                  </span>
                  <span className="text-[14px] font-semibold text-[#1f2b20]">
                    {r.count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-6 rounded-xl border border-black/10 bg-[#F9FAFB]">
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
            PERMESSI
          </div>
          <button
            type="button"
            className="inline-flex h-8 items-center rounded-lg bg-[#214e3a] px-3 text-[11px] font-semibold text-white hover:cursor-pointer hover:bg-[#1a3f2e]"
          >
            {formattedRoleLabel}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="text-[10px] font-semibold tracking-wide text-[#1f2b20]">
                <th className="px-5 py-3">Aree e funzionalità</th>
                <th className="px-3 py-3 text-center">Visualizza</th>
                <th className="px-3 py-3 text-center">Crea</th>
                <th className="px-3 py-3 text-center">Modifica</th>
                <th className="px-3 py-3 text-center">Elimina</th>
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map((section, sectionIdx) => (
                <Fragment key={section.id}>
                  <tr className="bg-[#F5F7F9]">
                    <td
                      colSpan={5}
                      className={`px-5 text-[10px] font-semibold tracking-wide text-[#1f2b20] ${
                        sectionIdx === 0 ? "py-3" : "pb-3 pt-4"
                      }`}
                    >
                      {section.title}
                    </td>
                  </tr>
                  {section.rows.map((row, rowIdx) => (
                    <tr
                      key={`${section.id}-${row.id}`}
                      className={
                        rowIdx === 0 ? "" : "border-t border-black/5"
                      }
                    >
                      <td className="py-4 pl-10 pr-5 text-[11px] font-medium text-[#1f2b20]">
                        {row.label}
                      </td>
                      <td className="px-3 py-4 text-center">
                        <PermissionCell value={row.visualizza} />
                      </td>
                      <td className="px-3 py-4 text-center">
                        <PermissionCell value={row.crea} />
                      </td>
                      <td className="px-3 py-4 text-center">
                        <PermissionCell value={row.modifica} />
                      </td>
                      <td className="px-3 py-4 text-center">
                        <PermissionCell value={row.elimina} />
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 gap-3 px-5 py-4 sm:grid-cols-3">
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-black/10 bg-white px-3 text-[11px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-black/5"
          >
            Seleziona tutto
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-black/10 bg-white px-3 text-[11px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-black/5"
          >
            Deseleziona tutto
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-[#214e3a] px-3 text-[11px] font-semibold text-white hover:cursor-pointer hover:bg-[#1a3f2e]"
          >
            Applica
          </button>
        </div>
      </div>

      <div className="mx-6 mb-6 mt-4 rounded-xl border-l-4 border-[#F3DFB2] bg-[#FFFBEB] px-5 py-4">
        <div className="text-[11px] font-semibold tracking-wide text-[#1f2b20]">
          AUDIT TRAIL ATTIVO
        </div>
        <p className="mt-1.5 text-[11px] font-medium text-[#1f2b20]">
          Tutte le modifiche ai permessi vengono registrate e sono tracciabili
          nella sezione Log attività.
        </p>
      </div>
    </div>
  );
}

export function StaffUsersCard() {
  return (
    <div className="rounded-xl border border-black/10 bg-white shadow-sm">
      <div className="px-6 py-5">
        <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
          UTENTI STAFF
        </div>
      </div>
      <div className="h-px w-full bg-black/5" />

      <ul className="px-6 py-2">
        {STAFF_USERS.map((u) => {
          const initials = u.name
            .split(" ")
            .map((p: string) => p[0])
            .filter(Boolean)
            .slice(0, 2)
            .join("")
            .toUpperCase();
          return (
            <li
              key={u.id}
              className="flex items-center justify-between gap-3 border-b border-black/5 py-3 last:border-b-0"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#214e3a] text-[12px] font-semibold text-white">
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-[12px] font-semibold text-[#1f2b20]">
                    {u.name}
                  </div>
                  <div className="truncate text-[11px] font-medium text-[#9aa39a]">
                    {u.email}
                  </div>
                </div>
              </div>

              <div className="flex flex-none items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-[#f2f4f2] px-3 py-1 text-[10px] font-semibold text-[#1f2b20]">
                  {u.role}
                </span>
                <button
                  type="button"
                  aria-label={`Azioni ${u.name}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#6b746c] hover:cursor-pointer hover:bg-black/5"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="px-6 pb-5 pt-2">
        <button
          type="button"
          className="inline-flex h-9 w-full items-center justify-center rounded-lg border border-black/10 bg-white px-3 text-[11px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-black/5"
        >
          Vedi tutti gli utenti staff
        </button>
      </div>
    </div>
  );
}
