export type RegistrationDateFilter =
  | { mode: "none" }
  | { mode: "specific"; date: Date }
  | { mode: "range"; from: Date; to: Date }
  | { mode: "before"; date: Date }
  | { mode: "after"; date: Date };

const IT_MONTHS: Record<string, number> = {
  Gen: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  Mag: 4,
  Giu: 5,
  Lug: 6,
  Ago: 7,
  Set: 8,
  Ott: 9,
  Nov: 10,
  Dic: 11,
};

export function parseRegisteredAtItalian(s: string): Date | null {
  const parts = s.trim().split(/\s+/);
  if (parts.length !== 3) return null;
  const day = Number.parseInt(parts[0], 10);
  const mon = IT_MONTHS[parts[1]];
  const year = Number.parseInt(parts[2], 10);
  if (!Number.isFinite(day) || mon === undefined || !Number.isFinite(year)) return null;
  return new Date(year, mon, day);
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

export function formatDDMMYY(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}

export function formatRegistrationFilterLabel(f: RegistrationDateFilter): string {
  if (f.mode === "none") return "Data registrazione";
  switch (f.mode) {
    case "specific": {
      const a = formatDDMMYY(f.date);
      return `${a} - ${a}`;
    }
    case "range":
      return `${formatDDMMYY(f.from)} - ${formatDDMMYY(f.to)}`;
    case "before":
      return `… - ${formatDDMMYY(f.date)}`;
    case "after":
      return `${formatDDMMYY(f.date)} - …`;
    default:
      return "Data registrazione";
  }
}

export function rowMatchesRegistrationFilter(
  registeredAtLabel: string,
  f: RegistrationDateFilter,
): boolean {
  if (f.mode === "none") return true;
  const t = parseRegisteredAtItalian(registeredAtLabel);
  if (!t) return true;
  const day = startOfDay(t).getTime();
  switch (f.mode) {
    case "specific":
      return day === startOfDay(f.date).getTime();
    case "range": {
      const a = startOfDay(f.from).getTime();
      const b = endOfDay(f.to).getTime();
      return day >= a && day <= b;
    }
    case "before":
      return day <= endOfDay(f.date).getTime();
    case "after":
      return day >= startOfDay(f.date).getTime();
    default:
      return true;
  }
}

export function dateToInputValue(d: Date | null): string {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function inputValueToDate(s: string): Date | null {
  if (!s) return null;
  const [y, m, d] = s.split("-").map((x) => Number.parseInt(x, 10));
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;
  const dt = new Date(y, m - 1, d);
  if (
    dt.getFullYear() !== y ||
    dt.getMonth() !== m - 1 ||
    dt.getDate() !== d
  ) {
    return null;
  }
  return dt;
}
