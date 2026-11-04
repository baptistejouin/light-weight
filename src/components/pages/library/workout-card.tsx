import { For, Show } from "solid-js";
import type { Workout } from "@/api/types";
import { TrashIcon } from "@/components/icons";
import { StepLabel } from "@/components/pages/library/step-label";
import { Card, CardHeader } from "@/components/ui/card";
import { isBuiltIn } from "@/lib/built-in-exercises";
import { formatStepTargets } from "@/lib/format";
import { cn } from "@/lib/utils";

interface WorkoutCardProps {
  workout: Workout;
  onDelete: (workout: Workout) => void;
}

export function WorkoutCard(props: WorkoutCardProps) {
  const handleDelete = () => props.onDelete(props.workout);

  return (
    <Card as="li">
      <CardHeader
        title={props.workout.name}
        action={
          <button
            type="button"
            onClick={handleDelete}
            aria-label={`Delete ${props.workout.name}`}
            class="-mr-1 cursor-pointer rounded-full p-1 text-black/40 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <TrashIcon aria-hidden="true" class="size-4" />
          </button>
        }
      />
      <Show when={props.workout.description}>
        <p class="text-black/60 text-sm">{props.workout.description}</p>
      </Show>
      <ol class="mt-2 flex flex-col gap-1">
        <For each={props.workout.steps}>
          {(step, i) => (
            <li
              class={cn(
                "text-sm",
                isBuiltIn(step.exerciseType) &&
                  "flex items-center gap-1 text-black/50 italic",
              )}
            >
              <StepLabel
                index={i()}
                name={step.exerciseName}
                exerciseType={step.exerciseType}
              />
              <Show when={formatStepTargets(step)}>
                {(targets) => (
                  <>
                    {" "}
                    <span class="text-primary text-xs">{targets()}</span>
                  </>
                )}
              </Show>
            </li>
          )}
        </For>
      </ol>
    </Card>
  );
}
