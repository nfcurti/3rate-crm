import { TrendingDown, TrendingUp } from "lucide-react";

export function KpiCard({
  label,
  value,
  delta,
  deltaTone = "green",
}: {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "green" | "red" | "gray";
}) {
  const cls =
    deltaTone === "green"
      ? "bg-[#e7f6ea] text-[#38A169]"
      : deltaTone === "red"
        ? "bg-[#fdecec] text-[#E53E3E]"
        : "bg-[#f2f4f2] text-[#6b746c]";

  return (
    <div className="rounded-lg bg-white px-5 py-6 shadow-[0_12px_28px_rgba(16,24,16,0.06)]">
      <div className="text-xs font-medium tracking-wide text-[#6B7280]">
        {label}
      </div>
      <div className="mt-1 flex items-end justify-between gap-3">
        <div className="text-3xl font-bold leading-tight text-[#1f2b20]">
          {value}
        </div>
        {delta ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${cls}`}
          >
            {deltaTone === "green" ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : deltaTone === "red" ? (
              <TrendingDown className="h-3.5 w-3.5" />
            ) : null}
            {delta}
          </span>
        ) : null}
      </div>
    </div>
  );
}

