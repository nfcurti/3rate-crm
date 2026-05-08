import { LucideIcon } from "lucide-react";

export function AlertCard({
  title,
  description,
  icon: Icon,
  tone = "green",
  actionLabel,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  tone?: "green" | "amber" | "red";
  actionLabel?: string;
}) {
  const toneStyles =
    tone === "green"
      ? {
          wrap: "bg-[#e7f6ea] text-[#1f2b20]",
          iconWrap: "bg-[#38A169] text-white",
          border: "border-[#5DBE54]/25",
        }
      : tone === "amber"
        ? {
            wrap: "bg-[#fff4e5] text-[#1f2b20]",
            iconWrap: "bg-[#b45309] text-white",
            border: "border-[#f59e0b]/25",
          }
        : {
            wrap: "bg-[#fdecec] text-[#1f2b20]",
            iconWrap: "bg-[#E53E3E] text-white",
            border: "border-[#ef4444]/25",
          };

  return (
    <div
      className={`rounded-2xl border ${toneStyles.border} p-5 shadow-[0_12px_28px_rgba(16,24,16,0.06)] ${toneStyles.wrap}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-2xl shadow-sm ${toneStyles.iconWrap}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold">{title}</div>
          <div className="mt-1 text-[12px] font-medium text-black/55">
            {description}
          </div>
          {actionLabel ? (
            <button
              type="button"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/55 px-3 py-2 text-[11px] font-semibold text-[#1f2b20] ring-1 ring-black/5 hover:cursor-pointer hover:bg-white/75"
            >
              {actionLabel} <span aria-hidden>→</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

