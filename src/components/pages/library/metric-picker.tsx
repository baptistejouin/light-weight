import { type Metric, metrics } from "@drizzle/schema";
import { For } from "solid-js";
import { fieldLabelClass } from "@/components/ui/input";
import { metricLabels, sortMetrics } from "@/lib/exercise-targets";
import { cn } from "@/lib/utils";

interface MetricPickerProps {
  name: string;
  value: Metric[];
  onChange: (value: Metric[]) => void;
}

export function MetricPicker(props: MetricPickerProps) {
  const isSelected = (metric: Metric) => props.value.includes(metric);

  function toggle(metric: Metric) {
    if (isSelected(metric) && props.value.length === 1) return;
    props.onChange(
      isSelected(metric)
        ? props.value.filter((m) => m !== metric)
        : sortMetrics([...props.value, metric]),
    );
  }

  const chipClass = (metric: Metric) =>
    cn(
      "h-8 cursor-pointer rounded-md px-3 font-medium text-sm transition-colors",
      isSelected(metric)
        ? "bg-black text-white"
        : "bg-gray-100 text-gray-500 hover:bg-gray-200",
    );

  return (
    <fieldset class="flex flex-col gap-1.5">
      <legend class={cn(fieldLabelClass, "mb-1.5")}>Tracks</legend>
      <div class="flex flex-wrap gap-1.5">
        <For each={metrics}>
          {(metric) => (
            <button
              type="button"
              aria-pressed={isSelected(metric)}
              onClick={() => toggle(metric)}
              class={chipClass(metric)}
            >
              {metricLabels[metric]}
            </button>
          )}
        </For>
      </div>
      <For each={props.value}>
        {(metric) => <input type="hidden" name={props.name} value={metric} />}
      </For>
    </fieldset>
  );
}
