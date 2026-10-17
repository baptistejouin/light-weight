import { For, Show } from "solid-js";
import type { Workout } from "@/api/types";
import { Card, CardHeader } from "@/components/ui/card";
import { formatStepTargets } from "@/lib/format";

export function WorkoutCard(props: { workout: Workout }) {
  return (
    <Card as="li">
      <CardHeader title={props.workout.name} />
      <Show when={props.workout.description}>
        <p class="text-black/60 text-sm">{props.workout.description}</p>
      </Show>
      <ol class="mt-2 flex flex-col gap-1">
        <For each={props.workout.steps}>
          {(step, i) => (
            <li class="text-sm">
              {i() + 1}. {step.exerciseName}
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
