import { expect, test } from "vitest";
import { approximateMoonPhase, localDateInput, parseCalendarDate } from "@/lib/astronomy/dates";
test.each(["", "invalid", "2026-02-29", "2026-04-31", "2026-13-01", "2026-1-01"])("rejects invalid calendar date %s", (date) => {
  expect(parseCalendarDate(date)).toBeNull(); expect(approximateMoonPhase(date)).toBeNull();
});
test("handles leap days and year boundaries without normalization", () => {
  expect(parseCalendarDate("2024-02-29")?.getUTCDate()).toBe(29);
  expect(parseCalendarDate("2026-12-31")?.getUTCMonth()).toBe(11);
  expect(parseCalendarDate("2027-01-01")?.getUTCMonth()).toBe(0);
});
test("initial date uses the device's calendar fields, not ISO UTC", () => {
  const local = new Date(2026, 0, 1, 0, 1);
  expect(localDateInput(local)).toBe("2026-01-01");
});
test("phase remains finite before and after the reference and bounded by the mean cycle", () => {
  for (const date of ["1900-01-01", "2000-01-06", "2024-02-29", "2100-12-31"]) {
    const phase = approximateMoonPhase(date)!;
    expect(phase.age).toBeGreaterThanOrEqual(0); expect(phase.age).toBeLessThan(29.531);
  }
  expect(approximateMoonPhase("1899-12-31")).toBeNull();
});
