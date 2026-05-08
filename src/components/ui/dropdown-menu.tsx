"use client";

import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";

export type DropdownMenuItem = {
  label: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  /** Renders the item with the destructive red palette. */
  danger?: boolean;
  disabled?: boolean;
};

export type DropdownMenuProps = {
  items: DropdownMenuItem[];
  /** Trigger element. Receives onClick / aria attributes via cloneElement. */
  children: ReactElement;
  align?: "left" | "right";
  /** Menu width. Number = px, string = any CSS value, "auto" by default. */
  width?: number | string;
  bg?: string;
  text?: string;
  border?: string;
  className?: string;
};

type TriggerProps = {
  onClick: (e: MouseEvent<HTMLElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
  "aria-haspopup": "menu";
  "aria-expanded": boolean;
  "aria-controls"?: string;
};

export function DropdownMenu({
  items,
  children,
  align = "right",
  width,
  bg = "#ffffff",
  text = "#1f2b20",
  border = "rgba(0,0,0,0.10)",
  className = "",
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: globalThis.MouseEvent | TouchEvent) {
      if (!wrapperRef.current) return;
      if (wrapperRef.current.contains(e.target as Node)) return;
      close();
    }

    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") close();
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  if (!isValidElement(children)) {
    throw new Error("DropdownMenu requires a single React element as child.");
  }

  const triggerProps: TriggerProps = {
    onClick: (e) => {
      e.stopPropagation();
      e.preventDefault();
      setOpen((v) => !v);
    },
    onKeyDown: (e) => {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
      }
    },
    "aria-haspopup": "menu",
    "aria-expanded": open,
    "aria-controls": open ? menuId : undefined,
  };

  const trigger = cloneElement(children, triggerProps as Record<string, unknown>);

  const menuStyle: CSSProperties = {
    backgroundColor: bg,
    color: text,
    borderColor: border,
    width: typeof width === "number" ? `${width}px` : width,
  };

  return (
    <div ref={wrapperRef} className={`relative inline-block ${className}`}>
      {trigger}

      {open ? (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          style={menuStyle}
          className={`absolute z-50 mt-1 min-w-[180px] overflow-hidden rounded-xl border py-1 shadow-sm ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {items.map((item, idx) => {
            const disabled = item.disabled;
            return (
              <button
                key={idx}
                type="button"
                role="menuitem"
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  if (disabled) return;
                  item.onClick?.();
                  close();
                }}
                className={`flex w-full items-center gap-2 px-4 py-2 text-left text-[11px] font-semibold transition-colors ${
                  disabled
                    ? "cursor-not-allowed opacity-50"
                    : "hover:cursor-pointer"
                } ${
                  item.danger
                    ? "text-[#E53E3E] hover:bg-[#fdecec]"
                    : "text-[#1f2b20] hover:bg-black/5"
                }`}
              >
                {item.icon ? (
                  <span className="inline-flex h-4 w-4 flex-none items-center justify-center text-[#9aa39a]">
                    {item.icon}
                  </span>
                ) : null}
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
