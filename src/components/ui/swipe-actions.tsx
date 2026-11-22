import { Gesture } from "@use-gesture/vanilla";
import { createEffect, createSignal, For, type JSX, onCleanup } from "solid-js";
import { blockScroll, createGesture, dragConfig } from "@/lib/gesture";
import { cn } from "@/lib/utils";

type SwipeActionVariant = "danger" | "neutral";

interface SwipeAction {
  label: string;
  onSelect: () => void;
  variant?: SwipeActionVariant;
  disabled?: boolean;
}

const actionVariantClasses: Record<SwipeActionVariant, string> = {
  danger: "bg-red-600",
  neutral: "bg-gray-400",
};

interface SwipeActionsProps {
  actions: SwipeAction[];
  children: JSX.Element;
  class?: string;
}

export function SwipeActions(props: SwipeActionsProps) {
  let containerRef!: HTMLDivElement;
  let actionsRef!: HTMLDivElement;
  let contentRef!: HTMLDivElement;
  const [open, setOpen] = createSignal(false);
  const [dragOffset, setDragOffset] = createSignal<number | null>(null);

  let dragBase = 0;
  let suppressClick = false;

  const actionsWidth = () => actionsRef.offsetWidth;
  const offset = () => dragOffset() ?? (open() ? -actionsWidth() : 0);
  const clampOffset = (value: number) =>
    Math.min(0, Math.max(-actionsWidth(), value));
  const contentStyle = () => ({ transform: `translateX(${offset()}px)` });

  createEffect(() => {
    if (!open()) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    onCleanup(() => document.removeEventListener("pointerdown", onPointerDown));
  });

  function startDrag() {
    suppressClick = false;
    dragBase = offset();
  }

  function moveDrag(dx: number) {
    setDragOffset(clampOffset(dragBase + dx));
  }

  function endDrag() {
    const current = dragOffset();
    if (current !== null) {
      setOpen(current < -actionsWidth() / 2);
      suppressClick = true;
    }
    setDragOffset(null);
  }

  createGesture(
    () =>
      new Gesture(
        contentRef,
        {
          onDrag: ({ first, last, movement: [mx], event }) => {
            if (first) startDrag();
            blockScroll(event);
            moveDrag(mx);
            if (last) endDrag();
          },
          onWheel: ({ first, last, movement: [mx], event }) => {
            if (first) startDrag();
            event.preventDefault();
            moveDrag(-mx);
            if (last) endDrag();
          },
        },
        {
          eventOptions: dragConfig.eventOptions,
          drag: { ...dragConfig, axis: "x" },
          wheel: { axis: "x" },
        },
      ),
  );

  // The click ending a mouse drag must not close the row it just opened
  function handleClickCapture(e: MouseEvent) {
    if (!suppressClick && !open()) return;
    e.preventDefault();
    e.stopPropagation();
    if (suppressClick) suppressClick = false;
    else setOpen(false);
  }

  function handleFocusOut(e: FocusEvent) {
    if (!containerRef.contains(e.relatedTarget as Node)) setOpen(false);
  }

  function selectAction(action: SwipeAction) {
    setOpen(false);
    action.onSelect();
  }

  return (
    <div
      ref={containerRef}
      onFocusOut={handleFocusOut}
      class={cn("relative overflow-hidden", props.class)}
    >
      <div
        ref={actionsRef}
        onFocusIn={() => setOpen(true)}
        class="absolute inset-y-0 right-0 flex"
      >
        <For each={props.actions}>
          {(action) => (
            <button
              type="button"
              onClick={() => selectAction(action)}
              disabled={action.disabled}
              class={cn(
                "w-20 cursor-pointer font-medium text-sm text-white -outline-offset-2 disabled:cursor-not-allowed disabled:opacity-45",
                actionVariantClasses[action.variant ?? "neutral"],
              )}
            >
              {action.label}
            </button>
          )}
        </For>
      </div>
      <div
        ref={contentRef}
        on:click={{ handleEvent: handleClickCapture, capture: true }}
        style={contentStyle()}
        class={cn(
          "relative touch-pan-y bg-white",
          dragOffset() === null && "transition-transform duration-200",
        )}
      >
        {props.children}
      </div>
    </div>
  );
}
