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
        "flex w-full items-center gap-0.5 rounded-lg bg-gray-100 p-1",
        props.class,
      )}
    >
      <For each={props.items}>
        {(item, index) => (
          <>
            {index() > 0 &&
              props.value !== item.value &&
              props.items[index() - 1].value !== props.value && (
                <div class="h-4 w-px shrink-0 bg-gray-300" />
              )}
            <button
              onClick={() => props.onChange(item.value)}
              class={cn(
                "flex-1 cursor-pointer rounded-md px-4 py-1.5 font-medium text-sm transition-colors",
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
