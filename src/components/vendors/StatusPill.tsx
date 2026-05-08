export function StatusPill({
  children,
  tone = "green",
}: {
  children: React.ReactNode;
  tone?: "green" | "amber" | "red" | "gray";
}) {
  const cls =
    tone === "green"
      ? "bg-[#e7f6ea] text-[#38A169]"
      : tone === "amber"
        ? "bg-[#FEF9C3] text-[#D69E2E]"
        : tone === "red"
          ? "bg-[#fdecec] text-[#E53E3E]"
          : "bg-[#f2f4f2] text-[#6b746c]";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-semibold ${cls}`}
    >
      {children}
    </span>
  );
}

