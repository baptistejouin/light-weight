import { For } from "solid-js";
import { TargetInput } from "@/components/pages/workouts/target-input";
import {
  type TargetField,
  type Targets,
  targetFieldsFor,
  targetInputConfig,
} from "@/lib/exercise-targets";

export interface Step extends Targets {
  key: string;
  exerciseId: string;
  exerciseName: string;
  exerciseType: string;
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

  function updateTarget(field: TargetField, value: number | undefined) {
    props.onUpdate({ [field]: value });
  }

  return (
    <li class="flex flex-col gap-1 rounded-xl border border-primary/20 p-2">
      <div class="flex items-center justify-between">
        <p class="font-medium text-sm">
          {props.index + 1}. {props.step.exerciseName}
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
