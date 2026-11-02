import type { Temporal } from "@js-temporal/polyfill";
import { createMemo, Show } from "solid-js";
import { formatDuration } from "@/lib/format";
import type { RecordsByDay } from "@/lib/records";

interface PeriodSummaryProps {
  label: string;
  days: Temporal.PlainDate[];
  recordsByDay: RecordsByDay;
}

export function PeriodSummary(props: PeriodSummaryProps) {
  const records = createMemo(() =>
    props.days.flatMap((day) => props.recordsByDay.get(day.toString()) ?? []),
  );
  const totalDuration = () =>
    formatDuration(
      records().reduce((sum, record) => sum + (record.duration ?? 0), 0),
    );
  const sessionsLabel = () =>
    `${records().length} ${records().length === 1 ? "session" : "sessions"}`;

  return (
    <p class="px-1 text-gray-400 text-sm">
      {props.label}: <span class="text-black">{sessionsLabel()}</span>
      <Show when={totalDuration()}>
        {" · "}
        <span class="text-black">{totalDuration()}</span>
      </Show>
    </p>
  );
}
