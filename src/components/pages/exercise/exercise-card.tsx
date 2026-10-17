import { Show } from "solid-js";
import type { Exercise } from "@/api/types";
import { Card, CardHeader } from "@/components/ui/card";

export function ExerciseCard(props: { exercise: Exercise }) {
  return (
    <Card as="li">
      <CardHeader title={props.exercise.name} badge={props.exercise.type} />
      <Show when={props.exercise.description}>
        <p class="text-black/60 text-sm">{props.exercise.description}</p>
      </Show>
    </Card>
  );
}
