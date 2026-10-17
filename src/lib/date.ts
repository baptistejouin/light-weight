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

export function formatDate(value: Date | string) {
  return new Date(value).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const relativeDays = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function formatDaysAgo(value: Date | string) {
  const days = toPlainDate(new Date(value)).until(
    Temporal.Now.plainDateISO(),
  ).days;
  return relativeDays.format(-days, "day");
}
