import { For, Show } from "solid-js";
import type { Workout } from "@/api/types";
import { CardHeader } from "@/components/ui/card";
import { SwipeDeleteRow } from "@/components/ui/swipe-delete-row";
import { formatTargets } from "@/lib/exercise-targets";
import { pluralize } from "@/lib/format";
import { cn } from "@/lib/utils";

interface WorkoutRowProps {
  workout: Workout;
  onDelete: (workout: Workout) => void;
}

export function WorkoutRow(props: WorkoutRowProps) {
  const stepCount = () =>
    pluralize(props.workout.steps.length, { one: "step", other: "steps" });
  const handleDelete = () => props.onDelete(props.workout);

  return (
    <SwipeDeleteRow onDelete={handleDelete}>
      <CardHeader title={props.workout.name} badge={stepCount()} />
      <Show when={props.workout.description}>
        <p class="text-black/60 text-sm">{props.workout.description}</p>
      </Show>
      <ol class="mt-1 flex flex-col gap-0.5 text-sm">
        <For each={props.workout.steps}>
          {(step) => (
            <li class="flex items-baseline justify-between gap-3">
              <span
                class={cn(
                  "truncate text-black/70",
                  step.exerciseBuiltIn && "text-gray-400",
                )}
              >
                {step.exerciseName}
              </span>
              <span class="shrink-0 text-gray-400 text-xs tabular-nums">
                {formatTargets(step, step.exerciseMetrics)}
              </span>
            </li>
          )}
        </For>
      </ol>
    </SwipeDeleteRow>
  );
}
