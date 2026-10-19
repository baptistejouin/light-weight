export function recordName(record: {
  title: string | null;
  exerciseName: string | null;
  workoutName: string | null;
}) {
  return record.title || record.exerciseName || record.workoutName;
}

export function formatDuration(seconds: number | null) {
  if (!seconds) return null;
  const minutes = Math.round(seconds / 60);
  return `${minutes} min`;
}

export function formatStepTargets(step: {
  targetSets: number | null;
  targetReps: number | null;
  targetDuration: number | null;
  targetWeight: number | null;
}) {
  const parts: string[] = [];
  if (step.targetSets) parts.push(`${step.targetSets} sets`);
  if (step.targetReps) parts.push(`${step.targetReps} reps`);
  if (step.targetWeight) parts.push(`${step.targetWeight} kg`);
  if (step.targetDuration) parts.push(`${step.targetDuration}s`);
  return parts.join(" · ");
}
