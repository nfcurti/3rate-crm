"use client";

import { Eye, MoreVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { StatusPill } from "./StatusPill";
import { useVendorSelection } from "./VendorSelectionProvider";

export type VendorRow = {
  id: string;
  name: string;
  vendorId: string;
  vat: string;
  email: string;
  phone: string;
  region: string;
  status: "Attivo" | "Sospeso" | "Bloccato";
  volume30d: string;
  products: number;
};

function StatusTone(status: VendorRow["status"]) {
  if (status === "Attivo") return "green";
  if (status === "Sospeso") return "amber";
  return "red";
}

export function VendorsTable({
  rows,
  viewHrefBuilder = (row) => `/vendors/${encodeURIComponent(row.id)}`,
  onRemove,
}: {
  rows: VendorRow[];
  viewHrefBuilder?: (row: VendorRow) => string;
  onRemove?: (row: VendorRow) => void;
}) {
  const { selectedIds, isSelected, toggle, setAll, remove } = useVendorSelection();
  const [removeTarget, setRemoveTarget] = useState<VendorRow | null>(null);
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

  function rowTint(status: VendorRow["status"]) {
    if (status === "Sospeso") return "bg-[#FEF9C3]/35";
    if (status === "Bloccato") return "bg-[#fdecec]/30";
    return "";
  }

  return (
    <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
      <ConfirmationModal
        open={removeTarget !== null}
        onClose={() => setRemoveTarget(null)}
        title="Rimuovere questo venditore?"
        description={
          removeTarget ? (
            <>
              <span className="font-semibold text-[#1f2b20]">{removeTarget.name}</span>{" "}
              verrà rimosso dall&apos;elenco. Potrai aggiungerlo di nuovo in seguito.
            </>
          ) : undefined
        }
        confirmLabel="Rimuovi"
        onConfirm={() => {
          if (!removeTarget) return;
          remove(removeTarget.id);
          onRemove?.(removeTarget);
        }}
      />

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
              <th className="py-4 pr-4">VENDITORE</th>
              <th className="py-4 pr-4">CONTATTI</th>
              <th className="py-4 pr-4">STATO</th>
              <th className="py-4 pr-4 text-right">VOLUME (30G)</th>
              <th className="py-4 pr-4 text-right">PRODOTTI</th>
              <th className="w-[92px] px-5 py-4 text-right">AZIONI</th>
            </tr>
          </thead>

          <tbody className="text-[12px] text-[#1f2b20]">
            {rows.map((row) => (
              <tr
                key={row.id}
                className={`border-b border-black/5 transition-colors ${rowTint(row.status)} hover:bg-black/[0.02]`}
              >
                <td className="w-[44px] px-5 py-5 align-top">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-black/10"
                    checked={isSelected(row.id)}
                    onChange={(e) => {
                      toggle(row);
                    }}
                    aria-label={`Seleziona ${row.name}`}
                  />
                </td>

                <td className="py-5 pr-4 align-top">
                  <div className="text-[11px] font-semibold">{row.name}</div>
                  <div className="mt-1 text-[10px] font-medium text-[#9aa39a]">
                    ID: {row.vendorId} • P.IVA: {row.vat}
                  </div>
                </td>

                <td className="py-5 pr-4 align-top">
                  <div className="text-[11px] font-medium">{row.email}</div>
                  <div className="mt-1 text-[10px] font-medium text-[#9aa39a]">
                    {row.phone} • {row.region}
                  </div>
                </td>

                <td className="py-5 pr-4 align-top">
                  <StatusPill tone={StatusTone(row.status)}>{row.status}</StatusPill>
                </td>

                <td className="py-5 pr-4 align-top text-right text-[11px] font-semibold">
                  {row.volume30d}
                </td>

                <td className="py-5 pr-4 align-top text-right text-[11px] font-semibold text-[#1f2b20]">
                  {row.products.toLocaleString("it-IT")}
                </td>

                <td className="px-5 py-5 align-top">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={viewHrefBuilder(row)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-[#6b746c] hover:cursor-pointer hover:bg-black/5"
                      aria-label="Vedi"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <DropdownMenu
                      align="right"
                      items={[
                        {
                          label: "Rimuovi",
                          danger: true,
                          icon: <Trash2 className="h-3.5 w-3.5" />,
                          onClick: () => {
                            setRemoveTarget(row);
                          },
                        },
                      ]}
                    >
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-[#6b746c] hover:cursor-pointer hover:bg-black/5"
                        aria-label="Altro"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenu>
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
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-[#1f2b20] text-[11px] font-semibold hover:cursor-pointer hover:bg-black/5"
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

