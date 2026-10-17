import { Show } from "solid-js";
import { TargetInput } from "@/components/pages/workouts/target-input";

export interface Step {
  key: string;
  exerciseId: string;
  exerciseName: string;
  exerciseType: string;
  targetSets?: number;
  targetReps?: number;
  targetDuration?: number;
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
        <Show when={props.step.exerciseType !== "rest"}>
          <TargetInput
            placeholder="sets"
            value={props.step.targetSets}
            onChange={(targetSets) => props.onUpdate({ targetSets })}
          />
          <TargetInput
            placeholder="reps"
            value={props.step.targetReps}
            onChange={(targetReps) => props.onUpdate({ targetReps })}
          />
        </Show>
        <TargetInput
          placeholder="seconds"
          class="w-20"
          value={props.step.targetDuration}
          onChange={(targetDuration) => props.onUpdate({ targetDuration })}
        />
      </div>
    </li>
  );
}
