import { Show } from "solid-js";
import type { WorkoutRecord } from "@/api/types";
import { Card, CardHeader } from "@/components/ui/card";
import { formatDate } from "@/lib/date";
import { formatDuration, recordName } from "@/lib/format";
import { recordKindLabel } from "@/lib/record-kind";

export function RecordCard(props: { record: WorkoutRecord }) {
  const source = () => props.record.exerciseName || props.record.workoutName;
  const duration = () => formatDuration(props.record.duration);

  return (
    <Card as="li">
      <CardHeader
        title={recordName(props.record)}
        badge={
          recordKindLabel[props.record.exerciseName ? "activity" : "workout"]
        }
      />
      <p class="text-black/60 text-sm">
        {formatDate(props.record.performedAt)}
        <Show when={duration()}>
          {" · "}
          {duration()}
        </Show>
      </p>
      <Show when={props.record.title && source()}>
        <p class="text-black/60 text-xs">{source()}</p>
      </Show>
      <Show when={props.record.notes}>
        <p class="mt-1 text-black/70 text-sm">{props.record.notes}</p>
      </Show>
    </Card>
  );
}
