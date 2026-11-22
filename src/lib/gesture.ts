import type { EventTypes, UserDragConfig } from "@use-gesture/vanilla";
import { onCleanup, onMount } from "solid-js";

// iOS Safari cancels pointer events when it claims a touch for scrolling,
// so touch screens use touch events and can block scroll once locked
export const dragConfig = {
  threshold: 8,
  pointer: { touch: true, keys: false, capture: false },
  eventOptions: { passive: false },
} satisfies UserDragConfig;

export function createGesture(create: () => { destroy: () => void }) {
  onMount(() => {
    const gesture = create();
    onCleanup(() => gesture.destroy());
  });
}

export const isMouse = (event: EventTypes["drag"]) =>
  "pointerType" in event && event.pointerType === "mouse";

export function blockScroll(event: Event) {
  if (event.type === "touchmove" && event.cancelable) event.preventDefault();
}
