import { Temporal } from "@js-temporal/polyfill";
import { createMemo } from "solid-js";
import { CalendarGrid } from "@/components/pages/index/calendar-grid";
import { Select } from "@/components/ui/select";
import { monthWeeks } from "@/lib/date";
import { formatMonthName } from "@/lib/format";
import { firstRecordDay, type RecordsByDay } from "@/lib/records";

interface MonthViewProps {
  anchor: Temporal.PlainDate;
  onAnchorChange: (anchor: Temporal.PlainDate) => void;
  recordsByDay: RecordsByDay;
}

const monthOptions = Array.from({ length: 12 }, (_, i) => ({
  label: formatMonthName(i + 1),
  value: String(i + 1),
}));

export function MonthView(props: MonthViewProps) {
  const today = Temporal.Now.plainDateISO();

  const yearOptions = createMemo(() => {
    const firstYear = firstRecordDay(props.recordsByDay)?.year ?? today.year;
    return Array.from({ length: today.year - firstYear + 1 }, (_, i) => {
      const year = String(today.year - i);
      return { label: year, value: year };
    });
  });

  const lastMonthOf = (year: number) =>
    year === today.year ? today.month : 12;
  const visibleMonthOptions = () =>
    monthOptions.slice(0, lastMonthOf(props.anchor.year));

  const weeks = createMemo(() => monthWeeks(props.anchor));

  const handleMonthChange = (value: string) =>
    props.onAnchorChange(props.anchor.with({ month: Number(value), day: 1 }));

  function handleYearChange(value: string) {
    const year = Number(value);
    const month = Math.min(props.anchor.month, lastMonthOf(year));
    props.onAnchorChange(props.anchor.with({ year, month, day: 1 }));
  }

  return (
    <div class="flex flex-col gap-3">
      <div class="mb-2 flex flex-wrap items-baseline gap-x-2 px-1 text-gray-400">
        Activity in
        <Select
          name="month"
          label="Month"
          variant="inline"
          options={visibleMonthOptions()}
          value={String(props.anchor.month)}
          onChange={handleMonthChange}
        />
        <Select
          name="year"
          label="Year"
          variant="inline"
          options={yearOptions()}
          value={String(props.anchor.year)}
          onChange={handleYearChange}
        />
      </div>
      <CalendarGrid weeks={weeks()} recordsByDay={props.recordsByDay} />
    </div>
  );
}
