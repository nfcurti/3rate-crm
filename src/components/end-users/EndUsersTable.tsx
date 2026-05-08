"use client";

import { Eye, MoreVertical, RefreshCcw, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { StatusPill } from "@/components/vendors/StatusPill";
import { useEndUserSelection } from "./EndUserSelectionProvider";

export type EndUserStatus = "Attivo" | "Inattivo" | "Bloccato" | "Pending";

export type EndUserRow = {
  id: string;
  name: string;
  userId: string;
  tier: "Premium" | "Standard";
  email: string;
  phone: string;
  registeredAt: string;
  orders: number;
  totalValue: string;
  status: EndUserStatus;
};

function statusTone(status: EndUserStatus): "green" | "amber" | "red" | "gray" {
  if (status === "Attivo") return "green";
  if (status === "Pending") return "amber";
  if (status === "Bloccato") return "red";
  return "gray";
}

export function EndUsersTable({
  rows,
  viewHrefBuilder = (row) => `/end-users/${encodeURIComponent(row.id)}`,
}: {
  rows: EndUserRow[];
  viewHrefBuilder?: (row: EndUserRow) => string;
}) {
  const { selectedIds, isSelected, toggle, setAll } = useEndUserSelection();
  const masterCheckboxRef = useRef<HTMLInputElement | null>(null);

  const allChecked = useMemo(() => {
    if (rows.length === 0) return false;
    return rows.every((r) => selectedIds.has(r.id));
  }, [rows, selectedIds]);

  const someChecked = useMemo(() => {
    return rows.some((r) => selectedIds.has(r.id)) && !allChecked;
  }, [rows, selectedIds, allChecked]);

  useEffect(() => {
    if (!masterCheckboxRef.current) return;
    masterCheckboxRef.current.indeterminate = someChecked;
  }, [someChecked]);

  function rowTint(status: EndUserStatus) {
    if (status === "Pending") return "bg-[#FEF9C3]/35";
    if (status === "Bloccato") return "bg-[#fdecec]/30";
    return "";
  }

  return (
    <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
          LISTA UTENTI
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-[#6b746c] hover:cursor-pointer hover:bg-black/5"
            aria-label="Aggiorna"
          >
            <RefreshCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-[#6b746c] hover:cursor-pointer hover:bg-black/5"
            aria-label="Filtri"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
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
                  checked={allChecked}
                  ref={masterCheckboxRef}
                  onChange={(e) => {
                    setAll(rows, e.target.checked);
                  }}
                  aria-label="Seleziona tutti"
                />
              </th>
              <th className="py-4 pr-4">UTENTE</th>
              <th className="py-4 pr-4">CONTATTI</th>
              <th className="py-4 pr-4">DATA REGISTRAZIONE</th>
              <th className="py-4 pr-4 text-right">ORDINI</th>
              <th className="py-4 pr-4 text-right">VALORE TOTALE</th>
              <th className="py-4 pr-4 text-center">STATO</th>
              <th className="w-[92px] px-5 py-4 text-right">AZIONI</th>
            </tr>
          </thead>

          <tbody className="text-[12px] text-[#1f2b20]">
            {rows.map((row) => (
              <tr
                key={row.id}
                className={`border-b border-black/5 transition-colors ${rowTint(row.status)} hover:bg-black/[0.02]`}
              >
                <td className="w-[44px] px-5 py-5 align-middle">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-black/10"
                    checked={isSelected(row.id)}
                    onChange={() => {
                      toggle(row);
                    }}
                    aria-label={`Seleziona ${row.name}`}
                  />
                </td>

                <td className="py-5 pr-4 align-middle">
                  <div className="text-[11px] font-semibold">{row.name}</div>
                  <div className="mt-1 text-[10px] font-medium text-[#9aa39a]">
                    Cliente {row.tier}
                  </div>
                  <div className="mt-0.5 text-[10px] font-medium text-[#9aa39a]">
                    #{row.userId}
                  </div>
                </td>

                <td className="py-5 pr-4 align-middle">
                  <div className="text-[11px] font-medium">{row.email}</div>
                  <div className="mt-1 text-[10px] font-medium text-[#9aa39a]">
                    {row.phone}
                  </div>
                </td>

                <td className="py-5 pr-4 align-middle text-[11px] font-medium text-[#1f2b20]">
                  {row.registeredAt}
                </td>

                <td className="py-5 pr-4 align-middle text-right text-[11px] font-semibold">
                  {row.orders}
                </td>

                <td className="py-5 pr-4 align-middle text-right text-[11px] font-semibold">
                  {row.totalValue}
                </td>

                <td className="py-5 pr-4 align-middle text-center">
                  <StatusPill tone={statusTone(row.status)}>
                    {row.status}
                  </StatusPill>
                </td>

                <td className="px-5 py-5 align-middle">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={viewHrefBuilder(row)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-[#6b746c] hover:cursor-pointer hover:bg-black/5"
                      aria-label="Vedi"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
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
    </div>
  );
}
