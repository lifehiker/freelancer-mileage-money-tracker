import { format, formatISO, isWithinInterval, parseISO, startOfMonth } from "date-fns";

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

export function formatNumber(value: number, maximumFractionDigits = 1) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(value || 0);
}

export function formatDate(date: Date | string) {
  const parsed = typeof date === "string" ? parseISO(date) : date;
  return format(parsed, "MMM d, yyyy");
}

export function formatDateInput(date: Date | string) {
  const parsed = typeof date === "string" ? parseISO(date) : date;
  return format(parsed, "yyyy-MM-dd");
}

export function toMonthKey(date = new Date()) {
  return format(date, "yyyy-MM");
}

export function getMonthRange(anchor = new Date()) {
  const start = startOfMonth(anchor);
  const end = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

export function getYearRange(anchor = new Date()) {
  const start = new Date(anchor.getFullYear(), 0, 1);
  const end = new Date(anchor.getFullYear(), 11, 31, 23, 59, 59, 999);
  return { start, end };
}

export function getRangeFromParams(searchParams: Record<string, string | string[] | undefined>) {
  const period = typeof searchParams.period === "string" ? searchParams.period : "month";
  const now = new Date();

  if (period === "year") {
    return { period, ...getYearRange(now) };
  }

  if (period === "custom") {
    const start = typeof searchParams.start === "string" ? parseISO(searchParams.start) : now;
    const end = typeof searchParams.end === "string" ? parseISO(searchParams.end) : now;
    return { period, start, end };
  }

  return { period: "month", ...getMonthRange(now) };
}

export function recordInRange<T extends { date: Date }>(record: T, start: Date, end: Date) {
  return isWithinInterval(record.date, { start, end });
}

export function slugToTitle(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function safeRedirectTarget(input: FormDataEntryValue | null, fallback: string) {
  if (typeof input !== "string" || !input.startsWith("/")) {
    return fallback;
  }
  return input;
}

export function absoluteUrl(pathname = "/") {
  return new URL(pathname, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").toString();
}

export function isoDate(date: Date) {
  return formatISO(date, { representation: "date" });
}
