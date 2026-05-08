"use client";

import { Check, ChevronDown } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export type DropdownOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

type DropdownSize = "sm" | "md";

export type DropdownProps = {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  size?: DropdownSize;
  /** Background color (CSS color value) for the trigger and menu. */
  bg?: string;
  /** Text color (CSS color value) for the trigger and menu items. */
  text?: string;
  /** Border color (CSS color value) for the trigger and menu. */
  border?: string;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
};

const sizeClasses: Record<DropdownSize, string> = {
  sm: "h-8 px-2 text-[11px] rounded-md",
  md: "h-10 px-3 text-[12px] rounded-lg",
};

const menuRadius: Record<DropdownSize, string> = {
  sm: "rounded-md",
  md: "rounded-lg",
};

const optionPadding: Record<DropdownSize, string> = {
  sm: "px-2 py-1.5 text-[11px]",
  md: "px-3 py-2 text-[12px]",
};

export function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Seleziona...",
  size = "md",
  bg = "#ffffff",
  text = "#1f2b20",
  border = "rgba(0,0,0,0.10)",
  className = "",
  ariaLabel,
  disabled = false,
  name,
  id,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();
  const buttonId = id ?? `${listboxId}-trigger`;

  const selectedIndex = useMemo(
    () => options.findIndex((o) => o.value === value),
    [options, value],
  );

  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null;

  const closeMenu = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent | TouchEvent) {
      if (!wrapperRef.current) return;
      if (wrapperRef.current.contains(e.target as Node)) return;
      closeMenu();
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open, closeMenu]);

  useEffect(() => {
    if (!open) return;
    const initial = selectedIndex >= 0 ? selectedIndex : 0;
    setActiveIndex(initial);
  }, [open, selectedIndex]);

  useEffect(() => {
    if (!open || activeIndex < 0 || !menuRef.current) return;
    const item = menuRef.current.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`,
    );
    item?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  function handleSelect(idx: number) {
    const option = options[idx];
    if (!option || option.disabled) return;
    onChange(option.value);
    closeMenu();
    buttonRef.current?.focus();
  }

  function moveActive(delta: number) {
    if (options.length === 0) return;
    setActiveIndex((prev) => {
      const start = prev < 0 ? (delta > 0 ? -1 : 0) : prev;
      let next = start;
      for (let i = 0; i < options.length; i += 1) {
        next = (next + delta + options.length) % options.length;
        if (!options[next]?.disabled) return next;
      }
      return prev;
    });
  }

  function onTriggerKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      moveActive(e.key === "ArrowDown" ? 1 : -1);
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (open) {
        if (activeIndex >= 0) handleSelect(activeIndex);
      } else {
        setOpen(true);
      }
      return;
    }

    if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        closeMenu();
      }
      return;
    }

    if (e.key === "Tab" && open) {
      closeMenu();
    }
  }

  const triggerStyle: CSSProperties = {
    backgroundColor: bg,
    color: text,
    borderColor: border,
  };

  const menuStyle: CSSProperties = {
    backgroundColor: bg,
    color: text,
    borderColor: border,
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        id={buttonId}
        name={name}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-label={ariaLabel}
        onClick={() => !disabled && setOpen((v) => !v)}
        onKeyDown={onTriggerKeyDown}
        style={triggerStyle}
        className={`inline-flex w-full items-center justify-between gap-2 border font-medium outline-none transition-colors hover:cursor-pointer focus:ring-2 focus:ring-[#5DBE54]/20 disabled:cursor-not-allowed disabled:opacity-60 ${sizeClasses[size]}`}
      >
        <span className="min-w-0 flex-1 truncate text-left">
          {selectedOption ? (
            selectedOption.label
          ) : (
            <span className="text-[#9aa39a]">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          aria-hidden
          className={`h-4 w-4 flex-none text-[#6b746c] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <ul
          ref={menuRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={buttonId}
          tabIndex={-1}
          style={menuStyle}
          className={`absolute left-0 right-0 z-50 mt-1 max-h-64 overflow-auto border py-1 shadow-[0_18px_40px_rgba(16,24,16,0.12)] ${menuRadius[size]}`}
        >
          {options.map((option, idx) => {
            const isSelected = option.value === value;
            const isActive = idx === activeIndex;
            return (
              <li
                key={option.value}
                data-index={idx}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled || undefined}
                onMouseEnter={() =>
                  !option.disabled ? setActiveIndex(idx) : undefined
                }
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(idx);
                }}
                className={`flex items-center justify-between gap-2 font-medium transition-colors ${optionPadding[size]} ${
                  option.disabled
                    ? "cursor-not-allowed opacity-50"
                    : "hover:cursor-pointer"
                } ${isActive && !option.disabled ? "bg-black/[0.04]" : ""} ${
                  isSelected ? "font-semibold" : ""
                }`}
              >
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
                {isSelected ? (
                  <Check
                    aria-hidden
                    className="h-3.5 w-3.5 flex-none text-[#214e3a]"
                  />
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
