import { Temporal } from "@js-temporal/polyfill";

export function toPlainDate(date: Date) {
  return Temporal.PlainDate.from({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  });
}

export function nowForDatetimeLocal() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const weekdayInitials = ["M", "T", "W", "T", "F", "S", "S"];

export function startOfWeek(date: Temporal.PlainDate) {
  return date.subtract({ days: date.dayOfWeek - 1 });
}

export function weekDays(date: Temporal.PlainDate) {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, i) => start.add({ days: i }));
}

export function monthWeeks(date: Temporal.PlainDate) {
  const last = date.with({ day: date.daysInMonth });
  const weeks: (Temporal.PlainDate | null)[][] = [];
  for (
    let start = startOfWeek(date.with({ day: 1 }));
    Temporal.PlainDate.compare(start, last) <= 0;
    start = start.add({ weeks: 1 })
  ) {
    weeks.push(
      weekDays(start).map((day) => (day.month === date.month ? day : null)),
    );
  }
  return weeks;
}
