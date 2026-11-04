import { onCleanup, onMount } from "solid-js";

const axisLockThreshold = 8;
const swipeThreshold = 50;

export function createAxisLock() {
  let origin: { x: number; y: number; axis?: "x" | "y" } | null = null;

  return {
    start(x: number, y: number) {
      origin = { x, y };
    },
    // Horizontal distance once the gesture is locked to the x axis, else null
    move(x: number, y: number) {
      if (!origin) return null;
      const dx = x - origin.x;
      const dy = y - origin.y;
      if (!origin.axis) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < axisLockThreshold) {
          return null;
        }
        origin.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }
      return origin.axis === "x" ? dx : null;
    },
    end() {
      origin = null;
    },
  };
}

interface TouchDragHandlers {
  onStart?: () => void;
  onMove?: (dx: number) => void;
  // dx is null when the touch never locked to the x axis or was cancelled
  onEnd: (dx: number | null) => void;
}

export function listenHorizontalTouchDrag(
  el: HTMLElement,
  handlers: TouchDragHandlers,
) {
  const lock = createAxisLock();
  let lastDx: number | null = null;

  const onTouchStart = (e: TouchEvent) => {
    lastDx = null;
    if (e.touches.length !== 1) {
      lock.end();
      return;
    }
    lock.start(e.touches[0].clientX, e.touches[0].clientY);
    handlers.onStart?.();
  };

  const onTouchMove = (e: TouchEvent) => {
    const dx = lock.move(e.touches[0].clientX, e.touches[0].clientY);
    if (dx === null) return;
    lastDx = dx;
    if (e.cancelable) e.preventDefault();
    handlers.onMove?.(dx);
  };

  const finish = (dx: number | null) => {
    lock.end();
    lastDx = null;
    handlers.onEnd(dx);
  };
  const onTouchEnd = () => finish(lastDx);
  const onTouchCancel = () => finish(null);

  el.addEventListener("touchstart", onTouchStart, { passive: true });
  el.addEventListener("touchmove", onTouchMove, { passive: false });
  el.addEventListener("touchend", onTouchEnd);
  el.addEventListener("touchcancel", onTouchCancel);
  return () => {
    el.removeEventListener("touchstart", onTouchStart);
    el.removeEventListener("touchmove", onTouchMove);
    el.removeEventListener("touchend", onTouchEnd);
    el.removeEventListener("touchcancel", onTouchCancel);
  };
}

interface SwipeHandlers {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export function createHorizontalSwipe(
  element: () => HTMLElement | undefined,
  handlers: SwipeHandlers,
) {
  onMount(() => {
    const el = element();
    if (!el) return;
    const stop = listenHorizontalTouchDrag(el, {
      onEnd: (dx) => {
        if (dx === null) return;
        if (dx <= -swipeThreshold) handlers.onSwipeLeft();
        else if (dx >= swipeThreshold) handlers.onSwipeRight();
      },
    });
    onCleanup(stop);
  });
}
