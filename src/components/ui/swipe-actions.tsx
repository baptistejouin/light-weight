import {
  createEffect,
  createSignal,
  For,
  type JSX,
  onCleanup,
  onMount,
} from "solid-js";
import { createAxisLock, listenHorizontalTouchDrag } from "@/lib/swipe";
import { cn } from "@/lib/utils";

type SwipeActionVariant = "danger" | "neutral";

interface SwipeAction {
  label: string;
  onSelect: () => void;
  variant?: SwipeActionVariant;
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

// Trackpad swipes have no "end" event, so settle after wheel events stop
const wheelSettleDelay = 150;

export function SwipeActions(props: SwipeActionsProps) {
  let root: HTMLDivElement | undefined;
  let actionsRef: HTMLDivElement | undefined;
  let content: HTMLDivElement | undefined;
  const [open, setOpen] = createSignal(false);
  const [dragOffset, setDragOffset] = createSignal<number | null>(null);

  const mouseDrag = createAxisLock();
  let dragBase = 0;
  let suppressClick = false;

  const actionsWidth = () => actionsRef?.offsetWidth ?? 0;
  const offset = () => dragOffset() ?? (open() ? -actionsWidth() : 0);
  const clampOffset = (value: number) =>
    Math.min(0, Math.max(-actionsWidth(), value));
  const contentStyle = () => ({ transform: `translateX(${offset()}px)` });

  createEffect(() => {
    if (!open()) return;
    const onPointerDown = (e: PointerEvent) => {
      if (root && !root.contains(e.target as Node)) setOpen(false);
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

  // iOS Safari cancels pointer events when it claims a touch for scrolling
  onMount(() => {
    if (!content) return;
    const el = content;
    const stopTouchDrag = listenHorizontalTouchDrag(el, {
      onStart: startDrag,
      onMove: moveDrag,
      onEnd: endDrag,
    });

    let wheelSettle: ReturnType<typeof setTimeout> | undefined;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      setDragOffset(clampOffset(offset() - e.deltaX));
      clearTimeout(wheelSettle);
      wheelSettle = setTimeout(endDrag, wheelSettleDelay);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    onCleanup(() => {
      stopTouchDrag();
      clearTimeout(wheelSettle);
      el.removeEventListener("wheel", onWheel);
    });
  });

  function handlePointerDown(e: PointerEvent) {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    mouseDrag.start(e.clientX, e.clientY);
    startDrag();
  }

  function handlePointerMove(e: PointerEvent) {
    if (e.pointerType !== "mouse") return;
    const dx = mouseDrag.move(e.clientX, e.clientY);
    if (dx === null) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    moveDrag(dx);
  }

  function handlePointerUp(e: PointerEvent) {
    if (e.pointerType !== "mouse") return;
    mouseDrag.end();
    endDrag();
  }

  // The click ending a mouse drag must not close the row it just opened
  function handleClickCapture(e: MouseEvent) {
    if (!suppressClick && !open()) return;
    e.preventDefault();
    e.stopPropagation();
    if (suppressClick) suppressClick = false;
    else setOpen(false);
  }

  function handleFocusOut(e: FocusEvent) {
    if (!root?.contains(e.relatedTarget as Node)) setOpen(false);
  }

  function selectAction(action: SwipeAction) {
    setOpen(false);
    action.onSelect();
  }

  return (
    <div
      ref={root}
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
              class={cn(
                "w-20 cursor-pointer font-medium text-sm text-white",
                actionVariantClasses[action.variant ?? "neutral"],
              )}
            >
              {action.label}
            </button>
          )}
        </For>
      </div>
      <div
        ref={content}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
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
