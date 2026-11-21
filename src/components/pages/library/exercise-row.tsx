import { Show } from "solid-js";
import type { Exercise } from "@/api/types";
import { ExerciseLabel } from "@/components/pages/library/exercise-icon";
import { CardHeader } from "@/components/ui/card";
import { SwipeDeleteRow } from "@/components/ui/swipe-delete-row";
import { getBuiltInExercise } from "@/lib/built-in-exercises";

interface ExerciseRowProps {
  exercise: Exercise;
  onDelete: (exercise: Exercise) => void;
}

export function ExerciseRow(props: ExerciseRowProps) {
  const builtIn = () => getBuiltInExercise(props.exercise.type);

  const description = () =>
    builtIn()?.description ?? props.exercise.description;

  const handleDelete = () => props.onDelete(props.exercise);

  return (
    <SwipeDeleteRow onDelete={handleDelete} deleteDisabled={!!builtIn()}>
      <CardHeader
        title={<ExerciseLabel exercise={props.exercise} />}
        badge={props.exercise.type}
      />
      <Show when={description()}>
        <p class="text-black/60 text-sm">{description()}</p>
      </Show>
    </SwipeDeleteRow>
  );
}
