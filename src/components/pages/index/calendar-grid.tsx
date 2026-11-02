import { Temporal } from "@js-temporal/polyfill";
import { For, Show } from "solid-js";
import { DayBadge } from "@/components/pages/index/day-badge";
import { weekdayInitials } from "@/lib/date";
import type { RecordsByDay } from "@/lib/records";

interface CalendarGridProps {
  weeks: (Temporal.PlainDate | null)[][];
  recordsByDay: RecordsByDay;
}

export function CalendarGrid(props: CalendarGridProps) {
  const today = Temporal.Now.plainDateISO();

  const sessionsOn = (day: Temporal.PlainDate) =>
    props.recordsByDay.get(day.toString())?.length ?? 0;

  return (
    <table class="flex w-full min-w-50 table-fixed flex-col text-sm">
      <thead class="flex flex-1">
        <tr class="flex flex-1">
          <For each={weekdayInitials}>
            {(col) => <th class="flex-1 p-2 text-muted-foreground">{col}</th>}
          </For>
        </tr>
      </thead>
      <tbody class="flex flex-1 flex-col">
        <For each={props.weeks}>
          {(week) => (
            <tr class="flex flex-1">
              <For each={week}>
                {(day) => (
                  <td class="flex flex-1 p-1 text-xl">
                    <Show when={day}>
                      {(day) => (
                        <DayBadge
                          day={day()}
                          isToday={day().equals(today)}
                          sessions={sessionsOn(day())}
                          class="w-full"
                        />
                      )}
                    </Show>
                  </td>
                )}
              </For>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  );
}
