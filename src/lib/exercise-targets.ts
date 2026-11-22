import type { ExerciseType, Metric } from "@drizzle/schema";
import { metrics } from "@drizzle/schema";
import { type DurationUnit, formatDuration } from "@/lib/duration";

export type TargetField =
  | "targetSets"
  | "targetReps"
  | "targetWeightKg"
  | "targetDurationSeconds"
  | "targetDistanceM";

export type Targets = Partial<Record<TargetField, number>>;
type NullableTargets = Partial<Record<TargetField, number | null>>;

const targetFieldByMetric: Record<Metric, TargetField> = {
  sets: "targetSets",
  reps: "targetReps",
  weight: "targetWeightKg",
  duration: "targetDurationSeconds",
  distance: "targetDistanceM",
};

export const metricLabels: Record<Metric, string> = {
  sets: "Sets",
  reps: "Reps",
  weight: "Weight",
  duration: "Duration",
  distance: "Distance",
};

// Only pre-fills the new exercise form; each exercise stores its own metrics
export const defaultMetricsByType: Record<ExerciseType, Metric[]> = {
  strength: ["sets", "reps", "weight"],
  cardio: ["duration"],
  flexibility: ["sets", "duration"],
  rest: ["duration"],
};

export const targetDurationUnits: DurationUnit[] = ["minutes", "seconds"];

type NumericTargetField = Exclude<TargetField, "targetDurationSeconds">;

export const targetDurationMinSeconds = 1;

export const targetPickerConfig: Record<
  NumericTargetField,
  { label: string; unit: string; min: number; max: number; step: number }
> = {
  targetSets: { label: "Target sets", unit: "sets", min: 1, max: 20, step: 1 },
  targetReps: { label: "Target reps", unit: "reps", min: 1, max: 100, step: 1 },
  targetWeightKg: {
    label: "Target weight",
    unit: "kg",
    min: 0,
    max: 300,
    step: 0.25,
  },
  targetDistanceM: {
    label: "Target distance",
    unit: "m",
    min: 100,
    max: 50000,
    step: 100,
  },
};

export function targetMin(field: TargetField) {
  return field === "targetDurationSeconds"
    ? targetDurationMinSeconds
    : targetPickerConfig[field].min;
}

export function sortMetrics(selected: Metric[]) {
  return metrics.filter((metric) => selected.includes(metric));
}

// Both are logged to get a pace, but a target aims for only one of them
export type GoalField = "targetDistanceM" | "targetDurationSeconds";

export const goalOptions: { label: string; value: GoalField }[] = [
  { label: "Distance", value: "targetDistanceM" },
  { label: "Time", value: "targetDurationSeconds" },
];

export function hasGoalChoice(exerciseMetrics: Metric[]) {
  return (
    exerciseMetrics.includes("distance") && exerciseMetrics.includes("duration")
  );
}

export function goalOf(targets: NullableTargets): GoalField {
  return targets.targetDurationSeconds && !targets.targetDistanceM
    ? "targetDurationSeconds"
    : "targetDistanceM";
}

export function otherGoal(goal: GoalField): GoalField {
  return goal === "targetDistanceM"
    ? "targetDurationSeconds"
    : "targetDistanceM";
}

export function targetFieldsFor(
  exerciseMetrics: Metric[],
  goal: GoalField = "targetDistanceM",
) {
  const fields = exerciseMetrics.map((metric) => targetFieldByMetric[metric]);
  if (!hasGoalChoice(exerciseMetrics)) return fields;
  return fields.filter((field) => field !== otherGoal(goal));
}

export function pickTargets(
  targets: NullableTargets,
  exerciseMetrics: Metric[],
): Targets {
  return Object.fromEntries(
    targetFieldsFor(exerciseMetrics, goalOf(targets)).map((field) => [
      field,
      targets[field] ?? undefined,
    ]),
  );
}

export function withMinimumTargets(
  targets: Targets,
  exerciseMetrics: Metric[],
): Targets {
  return Object.fromEntries(
    targetFieldsFor(exerciseMetrics, goalOf(targets)).map((field) => [
      field,
      targets[field] ?? (targetMin(field) || undefined),
    ]),
  );
}

function formatTarget(field: TargetField, value: number | null | undefined) {
  if (!value) return null;
  if (field === "targetDurationSeconds") {
    return formatDuration(value, targetDurationUnits);
  }
  return `${value} ${targetPickerConfig[field].unit}`;
}

export function formatTargets(
  targets: NullableTargets,
  exerciseMetrics: Metric[],
) {
  return targetFieldsFor(exerciseMetrics, goalOf(targets))
    .map((field) => formatTarget(field, targets[field]))
    .filter(Boolean)
    .join(" · ");
}

export function exerciseDefaultTargets(exercise: {
  metrics: Metric[];
  defaultTargets: Targets | null;
}): Targets {
  return pickTargets(exercise.defaultTargets ?? {}, exercise.metrics);
}
