"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import type { VendorRow } from "./VendorsTable";

type VendorSelectionContextValue = {
  selectedIds: Set<string>;
  selectedById: Map<string, VendorRow>;
  isSelected: (id: string) => boolean;
  toggle: (row: VendorRow) => void;
  remove: (id: string) => void;
  clear: () => void;
  setAll: (rows: VendorRow[], checked: boolean) => void;
};

const VendorSelectionContext = createContext<VendorSelectionContextValue | null>(
  null,
);

export function VendorSelectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [selectedById, setSelectedById] = useState<Map<string, VendorRow>>(
    () => new Map(),
  );

  const value = useMemo<VendorSelectionContextValue>(() => {
    function isSelected(id: string) {
      return selectedIds.has(id);
    }

    function toggle(row: VendorRow) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(row.id)) next.delete(row.id);
        else next.add(row.id);
        return next;
      });
      setSelectedById((prev) => {
        const next = new Map(prev);
        if (next.has(row.id)) next.delete(row.id);
        else next.set(row.id, row);
        return next;
      });
    }

    function remove(id: string) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setSelectedById((prev) => {
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
    }

    function clear() {
      setSelectedIds(new Set());
      setSelectedById(new Map());
    }

    function setAll(rows: VendorRow[], checked: boolean) {
      if (!checked) {
        clear();
        return;
      }
      setSelectedIds(new Set(rows.map((r) => r.id)));
      setSelectedById(new Map(rows.map((r) => [r.id, r] as const)));
    }

    return {
      selectedIds,
      selectedById,
      isSelected,
      toggle,
      remove,
      clear,
      setAll,
    };
  }, [selectedById, selectedIds]);

  return (
    <VendorSelectionContext.Provider value={value}>
      {children}
    </VendorSelectionContext.Provider>
  );
}

export function useVendorSelection() {
  const ctx = useContext(VendorSelectionContext);
  if (!ctx) {
    throw new Error("useVendorSelection must be used within VendorSelectionProvider");
  }
  return ctx;
}

