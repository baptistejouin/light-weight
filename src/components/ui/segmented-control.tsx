import { For, Show } from "solid-js";
import { cn } from "@/lib/utils";

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
  const selectedIndex = () =>
    props.items.findIndex((item) => item.value === props.value);

  const isDividerHidden = (index: number) =>
    index === 0 || index === selectedIndex() || index - 1 === selectedIndex();

  const indicatorStyle = () => ({
    width: `calc((100% - 0.5rem) / ${props.items.length})`,
    transform: `translateX(${selectedIndex() * 100}%)`,
  });

  return (
    <div
      class={cn(
        "relative isolate grid w-full auto-cols-fr grid-flow-col rounded-lg bg-gray-100 p-1",
        props.class,
      )}
    >
      <Show when={selectedIndex() !== -1}>
        <div
          class="absolute inset-y-1 left-1 rounded-md bg-white shadow-sm transition-transform duration-200 ease-out motion-reduce:transition-none"
          style={indicatorStyle()}
        />
      </Show>
      <For each={props.items}>
        {(item, index) => (
          <button
            type="button"
            onClick={() => props.onChange(item.value)}
            class={cn(
              "relative cursor-pointer px-4 py-1.5 font-medium text-sm transition-colors",
              "before:absolute before:top-1/2 before:left-0 before:-z-10 before:h-4 before:w-px before:-translate-y-1/2 before:bg-gray-300 before:transition-opacity",
              isDividerHidden(index()) && "before:opacity-0",
              props.value === item.value
                ? "text-black"
                : "text-gray-400 hover:text-gray-600",
            )}
          >
            {item.label}
          </button>
        )}
      </For>
    </div>
  );
}
