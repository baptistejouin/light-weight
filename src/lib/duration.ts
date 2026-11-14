export type DurationUnit = "hours" | "minutes" | "seconds";

export const durationUnits: Record<
  DurationUnit,
  { seconds: number; max: number; label: string; narrow: string }
> = {
  hours: { seconds: 3600, max: 23, label: "Hours", narrow: "h" },
  minutes: { seconds: 60, max: 59, label: "Minutes", narrow: "m" },
  seconds: { seconds: 1, max: 59, label: "Seconds", narrow: "s" },
};

export type DurationParts = Partial<Record<DurationUnit, number>>;

export function splitDuration(
  totalSeconds: number,
  units: DurationUnit[],
): DurationParts {
  let rest = totalSeconds;
  return Object.fromEntries(
    units.map((unit) => {
      const { seconds } = durationUnits[unit];
      const value = Math.floor(rest / seconds);
      rest -= value * seconds;
      return [unit, value];
    }),
  );
}

export function joinDuration(parts: DurationParts) {
  return Object.entries(parts).reduce(
    (sum, [unit, value]) =>
      sum + (value ?? 0) * durationUnits[unit as DurationUnit].seconds,
    0,
  );
}

const durationFormat = new Intl.DurationFormat("en", { style: "narrow" });

export function formatDuration(
  totalSeconds: number | null,
  units: DurationUnit[] = ["hours", "minutes"],
) {
  if (!totalSeconds) return null;
  const smallest = durationUnits[units[units.length - 1]];
  const rounded =
    Math.round(totalSeconds / smallest.seconds) * smallest.seconds;
  return (
    durationFormat.format(splitDuration(rounded, units)) ||
    `0${smallest.narrow}`
  );
}
