/** Strict calendar dates; Date.parse alone silently normalizes e.g. February 31. */
export function parseCalendarDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value ? date : null;
}

export function localDateInput(now = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function approximateMoonPhase(value: string) {
  const date = parseCalendarDate(value);
  if (!date || date.getUTCFullYear() < 1900 || date.getUTCFullYear() > 2100) return null;
  // Mean synodic period, not an ephemeris. Evaluate every date at UTC midnight.
  const days = (date.getTime() - Date.UTC(2000, 0, 6, 18, 14)) / 86_400_000;
  const cycle = 29.530588853;
  const age = ((days % cycle) + cycle) % cycle;
  const label = age < 1.8 || age > 27.7 ? "new moon window"
    : age < 6.8 ? "waxing crescent" : age < 9.8 ? "first quarter"
    : age < 13.8 ? "waxing gibbous" : age < 16.8 ? "full moon window"
    : age < 21.8 ? "waning gibbous" : age < 24.8 ? "last quarter" : "waning crescent";
  return { label, age };
}
