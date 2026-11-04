import { Temporal } from "@js-temporal/polyfill";
import { startOfWeek, weekDays } from "@/lib/date";
import { formatWeekRange } from "@/lib/format";

export interface Period {
  days: Temporal.PlainDate[];
  label: string;
}

export function weekPeriod(anchor: Temporal.PlainDate): Period {
  const start = startOfWeek(anchor);
  const isCurrent = start.equals(startOfWeek(Temporal.Now.plainDateISO()));
  return {
    days: weekDays(anchor),
    label: isCurrent ? "This week" : formatWeekRange(start),
  };
}

export function monthPeriod(anchor: Temporal.PlainDate): Period {
  const today = Temporal.Now.plainDateISO();
  const isCurrent = anchor.year === today.year && anchor.month === today.month;
  return {
    days: Array.from({ length: anchor.daysInMonth }, (_, i) =>
      anchor.with({ day: i + 1 }),
    ),
    label: isCurrent
      ? "This month"
      : anchor.toLocaleString("en", { month: "long", year: "numeric" }),
  };
}

const maxWeeksBack = 51;

export function earliestWeek(firstDay: Temporal.PlainDate | undefined) {
  const currentWeek = startOfWeek(Temporal.Now.plainDateISO());
  const oldest = currentWeek.subtract({ weeks: maxWeeksBack });
  const first = startOfWeek(firstDay ?? currentWeek);
  return Temporal.PlainDate.compare(first, oldest) > 0 ? first : oldest;
}

export function earliestMonth(firstDay: Temporal.PlainDate | undefined) {
  const year = (firstDay ?? Temporal.Now.plainDateISO()).year;
  return Temporal.PlainDate.from({ year, month: 1, day: 1 });
}
