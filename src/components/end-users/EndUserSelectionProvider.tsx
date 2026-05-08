"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import type { EndUserRow } from "./EndUsersTable";

type EndUserSelectionContextValue = {
  selectedIds: Set<string>;
  selectedById: Map<string, EndUserRow>;
  isSelected: (id: string) => boolean;
  toggle: (row: EndUserRow) => void;
  remove: (id: string) => void;
  clear: () => void;
  setAll: (rows: EndUserRow[], checked: boolean) => void;
};

const EndUserSelectionContext =
  createContext<EndUserSelectionContextValue | null>(null);

export function EndUserSelectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [selectedById, setSelectedById] = useState<Map<string, EndUserRow>>(
    () => new Map(),
  );

  const value = useMemo<EndUserSelectionContextValue>(() => {
    function isSelected(id: string) {
      return selectedIds.has(id);
    }

    function toggle(row: EndUserRow) {
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

    function setAll(rows: EndUserRow[], checked: boolean) {
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
    <EndUserSelectionContext.Provider value={value}>
      {children}
    </EndUserSelectionContext.Provider>
  );
}

export function useEndUserSelection() {
  const ctx = useContext(EndUserSelectionContext);
  if (!ctx) {
    throw new Error(
      "useEndUserSelection must be used within EndUserSelectionProvider",
    );
  }
  return ctx;
}
