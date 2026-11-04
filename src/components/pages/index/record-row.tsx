import { Show } from "solid-js";
import type { WorkoutRecord } from "@/api/types";
import { CardHeader } from "@/components/ui/card";
import { SwipeActions } from "@/components/ui/swipe-actions";
import { formatDate, formatDuration, recordName } from "@/lib/format";
import { recordKindLabel } from "@/lib/record-kind";

interface RecordRowProps {
  record: WorkoutRecord;
  onDelete: (record: WorkoutRecord) => void;
}

export function RecordRow(props: RecordRowProps) {
  const source = () => props.record.exerciseName || props.record.workoutName;
  const duration = () => formatDuration(props.record.duration);

  const actions = [
    {
      label: "Delete",
      variant: "danger" as const,
      onSelect: () => props.onDelete(props.record),
    },
  ];

  return (
    <li>
      <SwipeActions actions={actions}>
        <div class="flex flex-col gap-1 px-4 py-4">
          <CardHeader
            title={recordName(props.record)}
            badge={
              recordKindLabel[
                props.record.exerciseName ? "activity" : "workout"
              ]
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
            <p class="mt-1 text-black/70 text-sm leading-relaxed">
              {props.record.notes}
            </p>
          </Show>
        </div>
      </SwipeActions>
    </li>
  );
}
