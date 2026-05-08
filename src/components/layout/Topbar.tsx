"use client";

import { Bell } from "lucide-react";

export function Topbar({
  title,
  breadcrumb,
}: {
  title: React.ReactNode;
  breadcrumb?: React.ReactNode;
}) {
  return (
    <div className="bg-white">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 py-4 pl-20 pr-6 lg:pl-6">
        <div className="flex min-w-0 items-center gap-4">
          <div className="min-w-0">
            {breadcrumb ? (
              <div className="truncate text-[11px] font-semibold text-[#9aa39a]">
                {breadcrumb}
              </div>
            ) : null}
            {title ? (
              <h1 className="truncate text-xl font-semibold tracking-tight text-[#111827]">
                {title}
              </h1>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1f2b20] hover:cursor-pointer hover:bg-black/5"
            aria-label="Notifiche"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span
              aria-hidden
              className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ef4444]"
            />
          </button>
        </div>
      </header>
    </div>
  );
}

