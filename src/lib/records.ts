import { Temporal } from "@js-temporal/polyfill";
import type { WorkoutRecord } from "@/api/types";
import { toPlainDate } from "@/lib/date";

export type RecordsByDay = Map<string, WorkoutRecord[]>;

export function groupRecordsByDay(records: WorkoutRecord[]): RecordsByDay {
  const byDay: RecordsByDay = new Map();
  for (const record of records) {
    const key = toPlainDate(new Date(record.performedAt)).toString();
    const dayRecords = byDay.get(key);
    if (dayRecords) dayRecords.push(record);
    else byDay.set(key, [record]);
  }
  return byDay;
}

export function firstRecordDay(recordsByDay: RecordsByDay) {
  const [first] = [...recordsByDay.keys()].sort();
  return first ? Temporal.PlainDate.from(first) : undefined;
}

export function recordsInDays(
  recordsByDay: RecordsByDay,
  days: Temporal.PlainDate[],
) {
  return days
    .toReversed()
    .flatMap((day) => recordsByDay.get(day.toString()) ?? []);
}
