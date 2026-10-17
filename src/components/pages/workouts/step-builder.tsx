import { For, Show } from "solid-js";
import type { Exercise } from "@/api/types";
import { type Step, StepRow } from "@/components/pages/workouts/step-row";
import { cn } from "@/lib/utils";

interface StepBuilderProps {
  steps: Step[];
  onChange: (steps: Step[]) => void;
  exercises?: Exercise[];
  restExercise?: Exercise;
}

export function StepBuilder(props: StepBuilderProps) {
  function addStep(exercise: Exercise) {
    props.onChange([
      ...props.steps,
      {
        key: crypto.randomUUID(),
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        exerciseType: exercise.type,
      },
    ]);
  }

  function removeStep(key: string) {
    props.onChange(props.steps.filter((s) => s.key !== key));
  }

  function moveStep(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= props.steps.length) return;
    const next = [...props.steps];
    [next[index], next[target]] = [next[target], next[index]];
    props.onChange(next);
  }

  function updateStep(key: string, patch: Partial<Step>) {
    props.onChange(
      props.steps.map((s) => (s.key === key ? { ...s, ...patch } : s)),
    );
  }

  return (
    <>
      <div class="flex flex-col gap-1">
        <p class="font-medium text-black/70 text-xs">Add step</p>
        <div class="flex flex-wrap gap-1">
          <For each={props.exercises}>
            {(exercise) => (
              <AddStepButton onClick={() => addStep(exercise)}>
                {exercise.name}
              </AddStepButton>
            )}
          </For>
          <Show when={props.restExercise}>
            {(rest) => (
              <AddStepButton dashed onClick={() => addStep(rest())}>
                Rest
              </AddStepButton>
            )}
          </Show>
        </div>
      </div>

      <ol class="flex flex-col gap-2">
        <For each={props.steps}>
          {(step, i) => (
            <StepRow
              step={step}
              index={i()}
              isFirst={i() === 0}
              isLast={i() === props.steps.length - 1}
              onMove={(direction) => moveStep(i(), direction)}
              onRemove={() => removeStep(step.key)}
              onUpdate={(patch) => updateStep(step.key, patch)}
            />
          )}
        </For>
      </ol>
    </>
  );
}

function AddStepButton(props: {
  onClick: () => void;
  dashed?: boolean;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      class={cn(
        "rounded-full border border-primary/40 px-3 py-1 text-primary text-xs",
        props.dashed && "border-dashed",
      )}
    >
      + {props.children}
    </button>
  );
}
