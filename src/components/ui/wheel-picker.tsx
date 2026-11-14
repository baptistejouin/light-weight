import {
  createEffect,
  createMemo,
  For,
  on,
  onCleanup,
  onMount,
  untrack,
} from "solid-js";
import { cn } from "@/lib/utils";

const itemHeight = 40;
const visibleItems = 3;
const settleDelay = 120;
const pageSize = 5;

interface WheelPickerProps {
  label: string;
  values: number[];
  value: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
}

export function WheelPicker(props: WheelPickerProps) {
  let listRef!: HTMLDivElement;
  let settle: ReturnType<typeof setTimeout> | undefined;

  const format = (value: number) => props.format?.(value) ?? String(value);
  const initialValue = untrack(() => props.value);
  const options = createMemo(() =>
    props.values.includes(initialValue)
      ? props.values
      : [...props.values, initialValue].toSorted((a, b) => a - b),
  );
  const selectedIndex = () => Math.max(0, options().indexOf(props.value));
  const lastIndex = () => options().length - 1;
  const clampIndex = (index: number) =>
    Math.min(lastIndex(), Math.max(0, index));
  const scrolledIndex = () =>
    clampIndex(Math.round(listRef.scrollTop / itemHeight));

  const sideHeight = `${itemHeight * Math.floor(visibleItems / 2)}px`;
  const listStyle = {
    height: `${itemHeight * visibleItems}px`,
    "padding-block": sideHeight,
  };
  const fadeStyle = { height: sideHeight };
  const itemStyle = { height: `${itemHeight}px` };

  function scrollToIndex(index: number, behavior: ScrollBehavior) {
    listRef.scrollTo({ top: index * itemHeight, behavior });
  }

  onMount(() => scrollToIndex(selectedIndex(), "instant"));
  onCleanup(() => clearTimeout(settle));

  createEffect(
    on(
      selectedIndex,
      (index) => {
        if (scrolledIndex() !== index) scrollToIndex(index, "smooth");
      },
      { defer: true },
    ),
  );

  function selectIndex(index: number) {
    const value = options()[clampIndex(index)];
    if (value !== props.value) props.onChange(value);
  }

  function handleScroll() {
    clearTimeout(settle);
    settle = setTimeout(() => selectIndex(scrolledIndex()), settleDelay);
  }

  const keySteps: Record<string, (index: number) => number> = {
    ArrowUp: (index) => index - 1,
    ArrowDown: (index) => index + 1,
    PageUp: (index) => index - pageSize,
    PageDown: (index) => index + pageSize,
    Home: () => 0,
    End: () => lastIndex(),
  };

  function handleKeyDown(e: KeyboardEvent) {
    const step = keySteps[e.key];
    if (!step) return;
    e.preventDefault();
    selectIndex(step(selectedIndex()));
  }

  return (
    <div class="relative flex-1">
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-0 top-1/2 h-10 -translate-y-1/2 rounded-xl bg-gray-100"
      />
      <div
        aria-hidden="true"
        style={fadeStyle}
        class="pointer-events-none absolute inset-x-0 top-0 z-10 bg-linear-to-b from-white to-transparent"
      />
      <div
        aria-hidden="true"
        style={fadeStyle}
        class="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-white to-transparent"
      />
      <div
        ref={listRef}
        role="spinbutton"
        tabIndex={0}
        aria-label={props.label}
        aria-valuemin={options()[0]}
        aria-valuemax={options()[lastIndex()]}
        aria-valuenow={props.value}
        aria-valuetext={format(props.value)}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        style={listStyle}
        class="relative snap-y snap-mandatory overflow-y-auto overscroll-contain rounded-xl outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-primary"
      >
        <For each={options()}>
          {(value) => (
            <div
              aria-hidden="true"
              onClick={() => props.onChange(value)}
              style={itemStyle}
              class={cn(
                "flex cursor-pointer snap-center items-center justify-center tabular-nums transition-colors",
                value === props.value
                  ? "font-medium text-black"
                  : "text-gray-400",
              )}
            >
              {format(value)}
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
