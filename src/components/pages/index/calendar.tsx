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
    <table class="text-sm w-full min-w-50 flex flex-col table-fixed">
      <thead class="flex-1 flex">
        <tr class="flex-1 flex">
          <For each={cols}>
            {(col) => <th class="flex-1 p-2 text-muted-foreground">{col}</th>}
          </For>
        </tr>
      </thead>
      <tbody class="flex flex-col flex-1">
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
                    <td class="p-1 flex-1 flex">
                      <div
                        class={cn(
                          "text-gray-500 inline-flex justify-center items-center rounded-md w-full aspect-square",
                          {
                            "bg-gray-100": day,
                            "bg-green-300": isActivity,
                            "bg-gray-300 text-black border-dashed border-black border-2": isToday,
                          },
                        )}
                      >
                        {isActivity && (
                          <span class="text-green-800 font-semibold tabular-nums">
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
