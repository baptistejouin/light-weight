import { Match, Switch } from "solid-js";
import { MonthView } from "@/components/pages/index/month-view";
import { WeekView } from "@/components/pages/index/week-view";
import type { RecordsByDay } from "@/lib/records";

interface ActivityOverviewProps {
  timeScale: string;
  recordsByDay: RecordsByDay;
}

export function ActivityOverview(props: ActivityOverviewProps) {
  return (
    <div class="flex min-h-0 flex-1 flex-col">
      <Switch>
        <Match when={props.timeScale === "week"}>
          <WeekView recordsByDay={props.recordsByDay} />
        </Match>
        <Match when={props.timeScale === "month"}>
          <MonthView recordsByDay={props.recordsByDay} />
        </Match>
      </Switch>
    </div>
  );
}
