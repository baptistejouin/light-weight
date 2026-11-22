import { Show } from "solid-js";
import type { Exercise } from "@/api/types";
import { ExerciseLabel } from "@/components/pages/library/exercise-icon";
import { CardHeader } from "@/components/ui/card";
import { SwipeDeleteRow } from "@/components/ui/swipe-delete-row";

interface ExerciseRowProps {
  exercise: Exercise;
  onDelete: (exercise: Exercise) => void;
}

export function ExerciseRow(props: ExerciseRowProps) {
  const handleDelete = () => props.onDelete(props.exercise);

  return (
    <SwipeDeleteRow
      onDelete={handleDelete}
      deleteDisabled={props.exercise.builtIn}
    >
      <CardHeader
        title={<ExerciseLabel exercise={props.exercise} />}
        badge={props.exercise.type}
      />
      <Show when={props.exercise.description}>
        <p class="text-black/60 text-sm">{props.exercise.description}</p>
      </Show>
    </SwipeDeleteRow>
  );
}
