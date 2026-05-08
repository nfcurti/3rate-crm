"use client";

import { ChevronRight, MoreVertical, Search } from "lucide-react";
import Link from "next/link";
import { Topbar } from "@/components/layout/Topbar";

type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Attivo" | "Sospeso";
};

const STAFF_USERS_DEMO: StaffUser[] = [
  {
    id: "ADM-001",
    name: "Admin Principale",
    email: "admin@3rate.com",
    role: "Super Admin",
    status: "Attivo",
  },
  {
    id: "ADM-014",
    name: "Giulia Bianchi",
    email: "giulia.bianchi@3rate.com",
    role: "Amministrazione",
    status: "Attivo",
  },
  {
    id: "SUP-003",
    name: "Marco Conti",
    email: "marco.conti@3rate.com",
    role: "Supporto",
    status: "Attivo",
  },
  {
    id: "SUP-009",
    name: "Sara Neri",
    email: "sara.neri@3rate.com",
    role: "Supporto",
    status: "Sospeso",
  },
];

function StatusPill({ status }: { status: StaffUser["status"] }) {
  const cls =
    status === "Attivo"
      ? "bg-[#e7f6ea] text-[#38A169]"
      : "bg-[#fdecec] text-[#E53E3E]";
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold ${cls}`}>
      {status}
    </span>
  );
}

export default function StaffUsersPage() {
  return (
    <>
      <Topbar
        title={null}
        breadcrumb={
          <span className="inline-flex items-center gap-2">
            <Link href="/settings" className="hover:cursor-pointer hover:underline">
              Impostazioni
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-[#6b746c]">Utenti staff</span>
          </span>
        }
      />

      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <section className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa39a]" />
              <input
                placeholder="Cerca utente staff per nome o email..."
                className="h-7 w-full rounded-lg border border-black/10 bg-white pl-11 pr-4 text-[12px] font-medium text-[#1f2b20] outline-none placeholder:text-[#c0c6c0] focus:border-[#5DBE54] focus:ring-4 focus:ring-[#5DBE54]/15"
              />
            </div>
            <button
              type="button"
              className="inline-flex h-7 items-center justify-center rounded-lg border border-black/10 bg-white px-4 text-[11px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-black/5"
            >
              Tutti i ruoli
            </button>
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
          <div className="px-6 py-4">
            <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
              UTENTI STAFF
            </div>
          </div>
          <div className="h-px w-full bg-black/5" />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left">
              <thead className="bg-[#f6f7f6] text-[10px] font-semibold tracking-wide text-[#9aa39a]">
                <tr className="border-b border-black/5">
                  <th className="px-6 py-3">UTENTE</th>
                  <th className="py-3 pr-4">EMAIL</th>
                  <th className="py-3 pr-4">RUOLO</th>
                  <th className="py-3 pr-4 text-center">STATO</th>
                  <th className="w-[92px] px-6 py-3 text-right">AZIONI</th>
                </tr>
              </thead>
              <tbody className="text-[12px] text-[#1f2b20]">
                {STAFF_USERS_DEMO.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-black/5 transition-colors hover:bg-black/[0.02]"
                  >
                    <td className="px-6 py-4 align-middle">
                      <div className="text-[11px] font-semibold text-[#1f2b20]">
                        {u.name}
                      </div>
                      <div className="mt-1 text-[10px] font-medium text-[#9aa39a]">
                        {u.id}
                      </div>
                    </td>
                    <td className="py-4 pr-4 align-middle text-[11px] font-medium">
                      {u.email}
                    </td>
                    <td className="py-4 pr-4 align-middle">
                      <span className="inline-flex items-center rounded-full bg-[#f2f4f2] px-3 py-1 text-[10px] font-semibold text-[#1f2b20]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 pr-4 align-middle text-center">
                      <StatusPill status={u.status} />
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          aria-label={`Azioni ${u.name}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-[#6b746c] hover:cursor-pointer hover:bg-black/5"
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
        </section>
      </div>
    </>
  );
}

