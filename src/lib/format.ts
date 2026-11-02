import { Temporal } from "@js-temporal/polyfill";
import { toPlainDate } from "@/lib/date";

export function recordName(record: {
  title: string | null;
  exerciseName: string | null;
  workoutName: string | null;
}) {
  return record.title || record.exerciseName || record.workoutName;
}

export function formatDuration(
  seconds: number | null,
  options: { short?: boolean } = {},
) {
  if (!seconds) return null;
  const minutes = Math.round(seconds / 60);
  return options.short ? `${minutes}m` : `${minutes} min`;
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

export function formatDate(value: Date | string) {
  return new Date(value).toLocaleString("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const relativeDays = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function formatDaysAgo(value: Date | string) {
  const days = toPlainDate(new Date(value)).until(
    Temporal.Now.plainDateISO(),
  ).days;
  return relativeDays.format(-days, "day");
}

export function formatMonthName(month: number) {
  return Temporal.PlainDate.from({ year: 2000, month, day: 1 }).toLocaleString(
    "en",
    { month: "long" },
  );
}

export function formatWeekRange(start: Temporal.PlainDate) {
  const end = start.add({ days: 6 });
  const format = (day: Temporal.PlainDate) =>
    day.toLocaleString("en", { month: "short", day: "numeric" });
  return `${format(start)} – ${format(end)}, ${end.year}`;
}
