/**
 * Returns "YYYY-MM" for a given Date (or now by default).
 */
export function toMonthYear(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/**
 * Returns a human-readable month+year like "March 2026".
 */
export function formatMonthYear(monthYear: string): string {
  const [year, month] = monthYear.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/**
 * Navigate month by delta (-1 or +1), returns new "YYYY-MM".
 */
export function shiftMonth(monthYear: string, delta: number): string {
  const [year, month] = monthYear.split("-").map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  return toMonthYear(date);
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a date string like "2026-03-04" -> "Mar 4"
 */
export function formatShortDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
