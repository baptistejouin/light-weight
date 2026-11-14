import type { ExerciseType } from "@drizzle/schema";
import type { DurationUnit } from "@/lib/duration";

export type TargetField =
  | "targetSets"
  | "targetReps"
  | "targetWeightKg"
  | "targetDurationSeconds";

export type Targets = Partial<Record<TargetField, number>>;

const targetFieldsByType: Record<ExerciseType, TargetField[]> = {
  strength: ["targetSets", "targetReps", "targetWeightKg"],
  cardio: ["targetDurationSeconds"],
  flexibility: ["targetSets", "targetDurationSeconds"],
  rest: ["targetDurationSeconds"],
};

export const targetDurationUnits: DurationUnit[] = [
  "hours",
  "minutes",
  "seconds",
];

type NumericTargetField = Exclude<TargetField, "targetDurationSeconds">;

export const targetPickerConfig: Record<
  NumericTargetField,
  { label: string; unit: string; max: number; step: number }
> = {
  targetSets: { label: "Target sets", unit: "sets", max: 20, step: 1 },
  targetReps: { label: "Target reps", unit: "reps", max: 100, step: 1 },
  targetWeightKg: { label: "Target weight", unit: "kg", max: 300, step: 0.25 },
};

export function targetFieldsFor(exerciseType: ExerciseType) {
  return targetFieldsByType[exerciseType] ?? [];
}

export function pickTargets(
  targets: Targets,
  exerciseType: ExerciseType,
): Targets {
  return Object.fromEntries(
    targetFieldsFor(exerciseType).map((field) => [field, targets[field]]),
  );
}
