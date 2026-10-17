import { Temporal } from "@js-temporal/polyfill";
import { createMemo, For } from "solid-js";
import { cn } from "@/lib/utils";

interface CalendarProps {
  activityHistory: Temporal.PlainDate[];
}

export function Calendar(props: CalendarProps) {
  const today = Temporal.Now.plainDateISO();
  const firstDay = today.with({ day: 1 });
  const daysInMonth = firstDay.daysInMonth;
  const startOffset = firstDay.dayOfWeek - 1; // 0=Mon, 6=Sun

  const cols = ["M", "T", "W", "T", "F", "S", "S"];

  // Not destructured: props must stay reactive to update when records load
  const activityCountsByDay = createMemo(() => {
    const counts = new Map<number, number>();
    for (const d of props.activityHistory) {
      if (d.month !== today.month || d.year !== today.year) continue;
      counts.set(d.day, (counts.get(d.day) ?? 0) + 1);
    }
    return counts;
  });

  const numWeeks = Math.ceil((startOffset + daysInMonth) / 7);

  const weeks = Array.from({ length: numWeeks }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const day = w * 7 + d - startOffset + 1;
      return day >= 1 && day <= daysInMonth ? day : null;
    }),
  );

  return (
    <table class="flex w-full min-w-50 table-fixed flex-col text-sm">
      <thead class="flex flex-1">
        <tr class="flex flex-1">
          <For each={cols}>
            {(col) => <th class="flex-1 p-2 text-muted-foreground">{col}</th>}
          </For>
        </tr>
      </thead>
      <tbody class="flex flex-1 flex-col">
        <For each={weeks}>
          {(week) => (
            <tr class="flex flex-1">
              <For each={week}>
                {(day) => {
                  const isToday = day === today.day;
                  const isActivity = () =>
                    day !== null && (activityCountsByDay().get(day) ?? 0) > 0;
                  return (
                    <td class="flex flex-1 p-1 text-xl">
                      {/*TODO: more activity means darker color (based on periode selected)*/}
                      <div
                        class={cn(
                          "inline-flex aspect-square w-full items-center justify-center rounded-md",
                          {
                            "bg-gray-100 text-gray-500": day,
                            "bg-green-300 text-green-800": isActivity(),
                            "border-2": isToday,
                            "border-black text-black": isToday,
                            "border-green-800": isToday && isActivity(),
                          },
                        )}
                      >
                        {day}
                      </div>
                    </td>
                  );
                }}
              </For>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  );
}
