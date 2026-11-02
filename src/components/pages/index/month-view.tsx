import { Temporal } from "@js-temporal/polyfill";
import { createMemo, createSignal } from "solid-js";
import { CalendarGrid } from "@/components/pages/index/calendar-grid";
import { PeriodSummary } from "@/components/pages/index/period-summary";
import { Select } from "@/components/ui/select";
import { monthWeeks } from "@/lib/date";
import { formatMonthName } from "@/lib/format";
import { firstRecordDay, type RecordsByDay } from "@/lib/records";

interface MonthViewProps {
  recordsByDay: RecordsByDay;
}

const monthOptions = Array.from({ length: 12 }, (_, i) => ({
  label: formatMonthName(i + 1),
  value: String(i + 1),
}));

export function MonthView(props: MonthViewProps) {
  const today = Temporal.Now.plainDateISO();
  const [month, setMonth] = createSignal(today.with({ day: 1 }));

  const yearOptions = createMemo(() => {
    const firstYear = firstRecordDay(props.recordsByDay)?.year ?? today.year;
    return Array.from({ length: today.year - firstYear + 1 }, (_, i) => {
      const year = String(today.year - i);
      return { label: year, value: year };
    });
  });

  const weeks = createMemo(() => monthWeeks(month()));
  const days = () =>
    weeks()
      .flat()
      .filter((day) => day !== null);
  const isCurrentMonth = () =>
    month().year === today.year && month().month === today.month;
  const summaryLabel = () =>
    isCurrentMonth()
      ? "This month"
      : month().toLocaleString("en", { month: "long", year: "numeric" });

  const handleMonthChange = (value: string) =>
    setMonth((current) => current.with({ month: Number(value) }));
  const handleYearChange = (value: string) =>
    setMonth((current) => current.with({ year: Number(value) }));

  return (
    <div class="flex flex-col gap-2">
      <div class="mb-2 flex flex-wrap items-baseline gap-x-2 px-1 text-gray-400">
        Activity in
        <Select
          name="month"
          label="Month"
          variant="inline"
          options={monthOptions}
          value={String(month().month)}
          onChange={handleMonthChange}
        />
        <Select
          name="year"
          label="Year"
          variant="inline"
          options={yearOptions()}
          value={String(month().year)}
          onChange={handleYearChange}
        />
      </div>
      <CalendarGrid weeks={weeks()} recordsByDay={props.recordsByDay} />
      <PeriodSummary
        label={summaryLabel()}
        days={days()}
        recordsByDay={props.recordsByDay}
      />
    </div>
  );
}
