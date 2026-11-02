import type { Temporal } from "@js-temporal/polyfill";
import { cn } from "@/lib/utils";

const levelClasses = [
  "bg-gray-100 text-gray-500",
  "bg-activity-1 text-activity-1-foreground",
  "bg-activity-2 text-activity-2-foreground",
  "bg-activity-3 text-activity-3-foreground",
];

interface DayBadgeProps {
  day: Temporal.PlainDate;
  isToday: boolean;
  sessions: number;
  class?: string;
}

export function DayBadge(props: DayBadgeProps) {
  const level = () => Math.min(props.sessions, levelClasses.length - 1);

  return (
    <div
      class={cn(
        "inline-flex aspect-square items-center justify-center rounded-md",
        levelClasses[level()],
        props.isToday && "font-semibold ring-2 ring-current/40 ring-inset",
        props.isToday && level() === 0 && "text-gray-700",
        props.class,
      )}
    >
      {props.day.day}
    </div>
  );
}
