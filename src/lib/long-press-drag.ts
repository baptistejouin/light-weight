const longPressDelay = 400;
const moveTolerance = 8;

export interface DragSession {
  move: (clientY: number) => void;
  end: () => void;
  cancel: () => void;
}

export function listenLongPressDrag(
  el: HTMLElement,
  start: (clientY: number) => DragSession,
) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let session: DragSession | undefined;
  let originX = 0;
  let originY = 0;

  const cancelPress = () => clearTimeout(timer);

  const onTouchStart = (e: TouchEvent) => {
    cancelPress();
    if (e.touches.length !== 1) return;
    originX = e.touches[0].clientX;
    originY = e.touches[0].clientY;
    timer = setTimeout(() => {
      session = start(originY);
      navigator.vibrate?.(10);
    }, longPressDelay);
  };

  // Once picked up, the touch belongs to the reorder, not to scroll or swipe
  const onTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    if (session) {
      e.preventDefault();
      e.stopPropagation();
      session.move(touch.clientY);
    } else if (
      Math.hypot(touch.clientX - originX, touch.clientY - originY) >
      moveTolerance
    ) {
      cancelPress();
    }
  };

  const onTouchEnd = (e: TouchEvent) => {
    cancelPress();
    if (!session) return;
    if (e.cancelable) e.preventDefault();
    session.end();
    session = undefined;
  };

  const onTouchCancel = () => {
    cancelPress();
    session?.cancel();
    session = undefined;
  };

  el.addEventListener("touchstart", onTouchStart, { passive: true });
  el.addEventListener("touchmove", onTouchMove, { passive: false });
  el.addEventListener("touchend", onTouchEnd);
  el.addEventListener("touchcancel", onTouchCancel);
  return () => {
    cancelPress();
    session?.cancel();
    el.removeEventListener("touchstart", onTouchStart);
    el.removeEventListener("touchmove", onTouchMove);
    el.removeEventListener("touchend", onTouchEnd);
    el.removeEventListener("touchcancel", onTouchCancel);
  };
}
