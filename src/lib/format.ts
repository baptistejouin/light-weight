import { Temporal } from "@js-temporal/polyfill";
import { toPlainDate } from "@/lib/date";

export function recordName(record: {
  title: string | null;
  exerciseName: string | null;
  workoutName: string | null;
}) {
  return record.title || record.exerciseName || record.workoutName;
}

export function formatDate(value: Date | string) {
  return new Date(value).toLocaleString("en", {
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

export function formatMonthName(month: number) {
  return Temporal.PlainDate.from({ year: 2000, month, day: 1 }).toLocaleString(
    "en",
    { month: "long" },
  );
}

export function formatWeekRange(start: Temporal.PlainDate) {
  const end = start.add({ days: 6 });
  const format = (day: Temporal.PlainDate) =>
    day.toLocaleString("en", { month: "short", day: "numeric" });
  return `${format(start)} – ${format(end)}, ${end.year}`;
}

const pluralRules = new Intl.PluralRules("en");

export function pluralize(
  count: number,
  forms: Partial<Record<Intl.LDMLPluralRule, string>> & { other: string },
) {
  return `${count} ${forms[pluralRules.select(count)] ?? forms.other}`;
}
