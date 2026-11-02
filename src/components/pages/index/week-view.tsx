import { Temporal } from "@js-temporal/polyfill";
import { createMemo, createSignal } from "solid-js";
import { CalendarGrid } from "@/components/pages/index/calendar-grid";
import { PeriodSummary } from "@/components/pages/index/period-summary";
import { WeekChart } from "@/components/pages/index/week-chart";
import { Select } from "@/components/ui/select";
import { startOfWeek, weekDays } from "@/lib/date";
import { formatWeekRange } from "@/lib/format";
import { firstRecordDay, type RecordsByDay } from "@/lib/records";

interface WeekViewProps {
  recordsByDay: RecordsByDay;
}

const maxWeekOptions = 52;

export function WeekView(props: WeekViewProps) {
  const currentWeek = startOfWeek(Temporal.Now.plainDateISO());
  const [week, setWeek] = createSignal(currentWeek);

  const weekLabel = (start: Temporal.PlainDate) =>
    start.equals(currentWeek) ? "This week" : formatWeekRange(start);

  const weekOptions = createMemo(() => {
    const first = startOfWeek(
      firstRecordDay(props.recordsByDay) ?? currentWeek,
    );
    const options = [];
    for (
      let start = currentWeek;
      Temporal.PlainDate.compare(start, first) >= 0 &&
      options.length < maxWeekOptions;
      start = start.subtract({ weeks: 1 })
    ) {
      options.push({
        label: start.equals(currentWeek) ? "this week" : formatWeekRange(start),
        value: start.toString(),
      });
    }
    return options;
  });

  const days = createMemo(() => weekDays(week()));

  const handleWeekChange = (value: string) =>
    setWeek(Temporal.PlainDate.from(value));

  return (
    <div class="flex flex-1 flex-col gap-2">
      <div class="mb-2 flex flex-wrap items-baseline gap-x-2 px-1 text-gray-400">
        Activity for
        <Select
          name="week"
          label="Week"
          variant="inline"
          options={weekOptions()}
          value={week().toString()}
          onChange={handleWeekChange}
        />
      </div>
      <WeekChart days={days()} recordsByDay={props.recordsByDay} />
      <CalendarGrid weeks={[days()]} recordsByDay={props.recordsByDay} />
      <PeriodSummary
        label={weekLabel(week())}
        days={days()}
        recordsByDay={props.recordsByDay}
      />
    </div>
  );
}
