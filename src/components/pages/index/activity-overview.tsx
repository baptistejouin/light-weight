import { Temporal } from "@js-temporal/polyfill";
import { createMemo, createSignal, Match, Switch } from "solid-js";
import { MonthView } from "@/components/pages/index/month-view";
import { PeriodSummary } from "@/components/pages/index/period-summary";
import { RecordList } from "@/components/pages/index/record-list";
import { WeekView } from "@/components/pages/index/week-view";
import {
  earliestMonth,
  earliestWeek,
  monthPeriod,
  weekPeriod,
} from "@/lib/period";
import {
  firstRecordDay,
  type RecordsByDay,
  recordsInDays,
} from "@/lib/records";
import { createHorizontalSwipe } from "@/lib/swipe";

interface ActivityOverviewProps {
  timeScale: string;
  recordsByDay: RecordsByDay;
}

export function ActivityOverview(props: ActivityOverviewProps) {
  const [selected, setAnchor] = createSignal(Temporal.Now.plainDateISO());

  let viewArea: HTMLDivElement | undefined;

  const isWeek = () => props.timeScale === "week";
  const periodOf = (date: Temporal.PlainDate) =>
    isWeek() ? weekPeriod(date) : monthPeriod(date);
  const earliest = createMemo(() => {
    const first = firstRecordDay(props.recordsByDay);
    return isWeek() ? earliestWeek(first) : earliestMonth(first);
  });
  // Keep the anchor reachable after switching scale or deleting old records
  const anchor = createMemo(() =>
    Temporal.PlainDate.compare(selected(), earliest()) < 0
      ? earliest()
      : selected(),
  );
  const period = createMemo(() => periodOf(anchor()));
  const records = createMemo(() =>
    recordsInDays(props.recordsByDay, period().days),
  );

  function shiftPeriod(direction: 1 | -1) {
    const next = anchor().add(
      isWeek() ? { weeks: direction } : { months: direction },
    );
    const { days } = periodOf(next);
    const today = Temporal.Now.plainDateISO();

    if (Temporal.PlainDate.compare(days[0], today) > 0) return;
    if (Temporal.PlainDate.compare(days[days.length - 1], earliest()) < 0)
      return;
    setAnchor(next);
  }

  createHorizontalSwipe(() => viewArea, {
    onSwipeLeft: () => shiftPeriod(1),
    onSwipeRight: () => shiftPeriod(-1),
  });

  return (
    <div class="flex min-h-0 flex-1 flex-col gap-3">
      <div ref={viewArea} class="flex flex-1 flex-col">
        <Switch>
          <Match when={props.timeScale === "week"}>
            <WeekView
              anchor={anchor()}
              onAnchorChange={setAnchor}
              recordsByDay={props.recordsByDay}
            />
          </Match>
          <Match when={props.timeScale === "month"}>
            <MonthView
              anchor={anchor()}
              onAnchorChange={setAnchor}
              recordsByDay={props.recordsByDay}
            />
          </Match>
        </Switch>
      </div>
      <PeriodSummary label={period().label} records={records()} />
      <RecordList records={records()} />
    </div>
  );
}
