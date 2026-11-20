import type { ExerciseType, Metric } from "@drizzle/schema";
import { For, Match, Switch } from "solid-js";
import { StepLabel } from "@/components/pages/library/step-label";
import { DurationPicker } from "@/components/ui/duration-picker";
import { NumberPicker } from "@/components/ui/number-picker";
import { isBuiltIn } from "@/lib/built-in-exercises";
import {
  type TargetField,
  type Targets,
  targetDurationUnits,
  targetFieldsFor,
  targetPickerConfig,
} from "@/lib/exercise-targets";
import { cn } from "@/lib/utils";

export interface Step extends Targets {
  key: string;
  exerciseId: string;
  exerciseName: string;
  exerciseType: ExerciseType;
  exerciseMetrics: Metric[];
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
  const fields = () => targetFieldsFor(props.step.exerciseMetrics);
  const builtIn = () => isBuiltIn(props.step.exerciseType);

  const targetUpdater = (field: TargetField) => (value: number) =>
    props.onUpdate({ [field]: value || undefined });

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
      <div class="flex flex-wrap items-center gap-2">
        <For each={fields()}>
          {(field) => (
            <Switch>
              <Match when={field === "targetDurationSeconds"}>
                <DurationPicker
                  label="Target duration"
                  units={targetDurationUnits}
                  variant="compact"
                  value={props.step.targetDurationSeconds ?? 0}
                  onChange={targetUpdater("targetDurationSeconds")}
                />
              </Match>
              <Match when={field !== "targetDurationSeconds" && field}>
                {(numericField) => (
                  <NumberPicker
                    {...targetPickerConfig[numericField()]}
                    variant="compact"
                    value={props.step[numericField()] ?? 0}
                    onChange={targetUpdater(numericField())}
                  />
                )}
              </Match>
            </Switch>
          )}
        </For>
      </div>
    </li>
  );
}
