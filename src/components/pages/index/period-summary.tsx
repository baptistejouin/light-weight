import { Show } from "solid-js";
import type { WorkoutRecord } from "@/api/types";
import { formatDuration } from "@/lib/duration";

interface PeriodSummaryProps {
  label: string;
  records: WorkoutRecord[];
}

export function PeriodSummary(props: PeriodSummaryProps) {
  const totalDuration = () =>
    formatDuration(
      props.records.reduce(
        (sum, record) => sum + (record.durationSeconds ?? 0),
        0,
      ),
    );
  const sessionsLabel = () =>
    `${props.records.length} ${props.records.length === 1 ? "session" : "sessions"}`;

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
