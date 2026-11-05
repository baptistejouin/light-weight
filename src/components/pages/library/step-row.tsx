import type { ExerciseType } from "@drizzle/schema";
import { For } from "solid-js";
import { StepLabel } from "@/components/pages/library/step-label";
import { TargetInput } from "@/components/pages/library/target-input";
import { isBuiltIn } from "@/lib/built-in-exercises";
import {
  type TargetField,
  type Targets,
  targetFieldsFor,
  targetInputConfig,
} from "@/lib/exercise-targets";
import { cn } from "@/lib/utils";

export interface Step extends Targets {
  key: string;
  exerciseId: string;
  exerciseName: string;
  exerciseType: ExerciseType;
}

interface StepRowProps {
  step: Step;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
  onUpdate: (patch: Partial<Step>) => void;
}

export function StepRow(props: StepRowProps) {
  const fields = () => targetFieldsFor(props.step.exerciseType);
  const builtIn = () => isBuiltIn(props.step.exerciseType);

  function updateTarget(field: TargetField, value: number | undefined) {
    props.onUpdate({ [field]: value });
  }

  return (
    <li
      class={cn(
        "flex flex-col gap-1 rounded-xl border border-primary/20 p-2",
        builtIn() && "border-dashed bg-gray-50",
      )}
    >
      <div class="flex items-center justify-between">
        <p
          class={cn(
            "flex items-center gap-1 font-medium text-sm",
            builtIn() && "text-black/60",
          )}
        >
          <StepLabel
            index={props.index}
            name={props.step.exerciseName}
            exerciseType={props.step.exerciseType}
          />
        </p>
        <div class="flex gap-1">
          <button
            type="button"
            onClick={() => props.onMove(-1)}
            disabled={props.isFirst}
            aria-label="Move up"
            class="disabled:opacity-30"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => props.onMove(1)}
            disabled={props.isLast}
            aria-label="Move down"
            class="disabled:opacity-30"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={props.onRemove}
            aria-label="Remove step"
          >
            ×
          </button>
        </div>
      </div>
      <div class="flex gap-2">
        <For each={fields()}>
          {(field) => (
            <TargetInput
              {...targetInputConfig[field]}
              value={props.step[field]}
              onChange={(value) => updateTarget(field, value)}
            />
          )}
        </For>
      </div>
    </li>
  );
}
