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
  targetDistanceM: {
    label: "Target distance",
    unit: "m",
    max: 50000,
    step: 100,
  },
};

export function sortMetrics(selected: Metric[]) {
  return metrics.filter((metric) => selected.includes(metric));
}

export function targetFieldsFor(exerciseMetrics: Metric[]) {
  return exerciseMetrics.map((metric) => targetFieldByMetric[metric]);
}

export function pickTargets(
  targets: NullableTargets,
  exerciseMetrics: Metric[],
): Targets {
  return Object.fromEntries(
    targetFieldsFor(exerciseMetrics).map((field) => [
      field,
      targets[field] ?? undefined,
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
  return targetFieldsFor(exerciseMetrics)
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
