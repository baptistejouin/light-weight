import { For } from "solid-js";
import { cn } from "~/lib/utils";

interface SegmentedControlItem<T extends string> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T extends string> {
  items: SegmentedControlItem<T>[];
  value: T;
  onChange: (value: T) => void;
  class?: string;
}

export function SegmentedControl<T extends string>(
  props: SegmentedControlProps<T>,
) {
  return (
    <div
      class={cn(
        "flex items-center rounded-lg bg-gray-100 p-1 gap-0.5 w-full",
        props.class,
      )}
    >
      <For each={props.items}>
        {(item, index) => (
          <>
            {index() > 0 && props.value !== item.value && props.items[index() - 1].value !== props.value && (
              <div class="w-px h-4 bg-gray-300 shrink-0" />
            )}
            <button
              onClick={() => props.onChange(item.value)}
              class={cn(
                "flex-1 px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer",
                props.value === item.value
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-400 hover:text-gray-600",
              )}
            >
              {item.label}
            </button>
          </>
        )}
      </For>
    </div>
  );
}
