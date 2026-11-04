import { Temporal } from "@js-temporal/polyfill";
import { createMemo } from "solid-js";
import { CalendarGrid } from "@/components/pages/index/calendar-grid";
import { WeekChart } from "@/components/pages/index/week-chart";
import { Select } from "@/components/ui/select";
import { startOfWeek, weekDays } from "@/lib/date";
import { formatWeekRange } from "@/lib/format";
import { earliestWeek } from "@/lib/period";
import { firstRecordDay, type RecordsByDay } from "@/lib/records";

interface WeekViewProps {
  anchor: Temporal.PlainDate;
  onAnchorChange: (anchor: Temporal.PlainDate) => void;
  recordsByDay: RecordsByDay;
}

export function WeekView(props: WeekViewProps) {
  const currentWeek = startOfWeek(Temporal.Now.plainDateISO());
  const week = () => startOfWeek(props.anchor);

  const weekOptions = createMemo(() => {
    const earliest = earliestWeek(firstRecordDay(props.recordsByDay));
    const options = [];
    for (
      let start = currentWeek;
      Temporal.PlainDate.compare(start, earliest) >= 0;
      start = start.subtract({ weeks: 1 })
    ) {
      options.push({
        label: start.equals(currentWeek) ? "this week" : formatWeekRange(start),
        value: start.toString(),
      });
    }
    return options;
  });

  const days = createMemo(() => weekDays(props.anchor));

  const handleWeekChange = (value: string) =>
    props.onAnchorChange(Temporal.PlainDate.from(value));

  return (
    <div class="flex flex-1 flex-col gap-3">
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
    </div>
  );
}
