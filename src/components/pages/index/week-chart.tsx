import type { Temporal } from "@js-temporal/polyfill";
import { createMemo, For, Show } from "solid-js";
import type { WorkoutRecord } from "@/api/types";
import { formatDuration, recordName } from "@/lib/format";
import type { RecordsByDay } from "@/lib/records";

interface WeekChartProps {
  days: Temporal.PlainDate[];
  recordsByDay: RecordsByDay;
}

interface DaySessions {
  day: Temporal.PlainDate;
  sessions: WorkoutRecord[];
  total: number;
}

const labelSpace = "1.25rem";

export function WeekChart(props: WeekChartProps) {
  const columns = createMemo<DaySessions[]>(() =>
    props.days.map((day) => {
      const sessions = (props.recordsByDay.get(day.toString()) ?? [])
        .filter((record) => record.duration)
        .reverse();
      const total = sessions.reduce((sum, r) => sum + (r.duration ?? 0), 0);
      return { day, sessions, total };
    }),
  );
  const maxTotal = () => Math.max(0, ...columns().map((c) => c.total));

  const barStyle = (total: number) => ({
    height: `calc((100% - ${labelSpace}) * ${total / maxTotal()})`,
  });
  const segmentStyle = (record: WorkoutRecord) => ({
    "flex-grow": record.duration ?? 0,
  });
  const segmentLabel = (record: WorkoutRecord) =>
    `${recordName(record)} · ${formatDuration(record.duration)}`;

  return (
    <Show when={maxTotal() > 0}>
      <ol class="grid min-h-40 flex-1 grid-cols-7 border-gray-200 border-b">
        <For each={columns()}>
          {(column) => (
            <li class="flex flex-col items-center justify-end gap-1 px-1">
              <Show when={column.total > 0}>
                <span class="text-black text-xs leading-4">
                  {formatDuration(column.total, { short: true })}
                </span>
                <div
                  class="flex w-full flex-col-reverse gap-0.5 overflow-hidden rounded-t-md"
                  style={barStyle(column.total)}
                >
                  <For each={column.sessions}>
                    {(record) => (
                      <div
                        role="img"
                        title={segmentLabel(record)}
                        aria-label={segmentLabel(record)}
                        class="basis-0 bg-gray-300"
                        style={segmentStyle(record)}
                      />
                    )}
                  </For>
                </div>
              </Show>
            </li>
          )}
        </For>
      </ol>
    </Show>
  );
}
