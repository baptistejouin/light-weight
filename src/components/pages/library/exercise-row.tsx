import { Show } from "solid-js";
import type { Exercise } from "@/api/types";
import { BuiltInIcon } from "@/components/pages/library/built-in-icon";
import { CardHeader } from "@/components/ui/card";
import { SwipeActions } from "@/components/ui/swipe-actions";
import { getBuiltInExercise } from "@/lib/built-in-exercises";
import { cn } from "@/lib/utils";

interface ExerciseRowProps {
  exercise: Exercise;
  onDelete: (exercise: Exercise) => void;
}

export function ExerciseRow(props: ExerciseRowProps) {
  const builtIn = () => getBuiltInExercise(props.exercise.type);

  const actions = () =>
    builtIn()
      ? []
      : [
          {
            label: "Delete",
            variant: "danger" as const,
            onSelect: () => props.onDelete(props.exercise),
          },
        ];

  const description = () =>
    builtIn()?.description ?? props.exercise.description;

  const title = (
    <span class={cn("flex items-center gap-2", builtIn() && "text-black/60")}>
      <Show when={builtIn()}>
        <BuiltInIcon exerciseType={props.exercise.type} class="size-4" />
      </Show>
      {props.exercise.name}
    </span>
  );

  return (
    <li>
      <SwipeActions actions={actions()}>
        <div
          class={cn("flex flex-col gap-1 px-4 py-4", builtIn() && "bg-gray-50")}
        >
          <CardHeader
            title={title}
            badge={builtIn() ? "Built-in" : props.exercise.type}
          />
          <Show when={description()}>
            <p class="text-black/60 text-sm">{description()}</p>
          </Show>
        </div>
      </SwipeActions>
    </li>
  );
}
