export type TargetField =
  | "targetSets"
  | "targetReps"
  | "targetWeight"
  | "targetDuration";

export type Targets = Partial<Record<TargetField, number>>;

const targetFieldsByType: Record<string, TargetField[]> = {
  strength: ["targetSets", "targetReps", "targetWeight"],
  cardio: ["targetDuration"],
  flexibility: ["targetSets", "targetDuration"],
  rest: ["targetDuration"],
};

export const targetInputConfig: Record<
  TargetField,
  { placeholder: string; step: string; class?: string }
> = {
  targetSets: { placeholder: "sets", step: "1" },
  targetReps: { placeholder: "reps", step: "1" },
  targetWeight: { placeholder: "kg", step: "0.5" },
  targetDuration: { placeholder: "seconds", step: "1", class: "w-20" },
};

export function targetFieldsFor(exerciseType: string) {
  return targetFieldsByType[exerciseType] ?? [];
}

export function pickTargets(targets: Targets, exerciseType: string): Targets {
  return Object.fromEntries(
    targetFieldsFor(exerciseType).map((field) => [field, targets[field]]),
  );
}
