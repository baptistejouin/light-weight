import { Show } from "solid-js";
import type { WorkoutRecord } from "@/api/types";
import { CalendarIcon, WeightIcon } from "@/components/icons";
import { formatDaysAgo } from "@/lib/date";
import { recordName } from "@/lib/format";

export function HeaderSummary(props: { lastRecord?: WorkoutRecord }) {
  return (
    <h3 class="mt-6 font-bold text-2xl">
      <Show
        when={props.lastRecord}
        fallback={
          <span class="text-gray-400">No workout yet, log your first one!</span>
        }
      >
        {(record) => (
          <>
            <span class="text-gray-400">Your last workout was </span>
            <span class="text-black">
              <WeightIcon /> {recordName(record())}
            </span>
            <span class="text-gray-400">, and it was </span>
            <span class="text-black">
              <CalendarIcon /> {formatDaysAgo(record().performedAt)}
            </span>
          </>
        )}
      </Show>
    </h3>
  );
}
