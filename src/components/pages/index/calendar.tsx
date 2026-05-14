import { Temporal } from "@js-temporal/polyfill";
import { For } from "solid-js";
import { cn } from "~/lib/utils";

interface CalendarProps {
  activityHistory: Temporal.PlainDate[];
}
export function Calendar({ activityHistory }: CalendarProps) {
  const today = Temporal.Now.plainDateISO();
  const firstDay = today.with({ day: 1 });
  const daysInMonth = firstDay.daysInMonth;
  const startOffset = firstDay.dayOfWeek - 1; // 0=Mon, 6=Sun

  const cols = ["M", "T", "W", "T", "F", "S", "S"];

  const activityCountsByDay = new Map<number, number>();
  for (const d of activityHistory.filter(
    (x) => x.month === today.month && x.year === today.year,
  )) {
    activityCountsByDay.set(d.day, (activityCountsByDay.get(d.day) ?? 0) + 1);
  }

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
                  const activityCount =
                    day !== null ? (activityCountsByDay.get(day) ?? 0) : 0;
                  const isActivity = activityCount > 0;
                  return (
                    <td class="flex flex-1 p-1 text-xl">
                      <div
                        class={cn(
                          "inline-flex aspect-square w-full items-center justify-center rounded-md text-gray-500",
                          {
                            "bg-gray-100": day,
                            "bg-green-300": isActivity,
                            "border-2 border-black border-dashed bg-gray-300 text-black":
                              isToday,
                          },
                        )}
                      >
                        {isActivity && (
                          <span class="font-semibold text-green-800 tabular-nums">
                            {activityCount}
                          </span>
                        )}
                        {isToday && "T"}
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
