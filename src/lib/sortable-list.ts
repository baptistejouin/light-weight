import { batch, createSignal, onCleanup, onMount } from "solid-js";
import { type DragSession, listenLongPressDrag } from "@/lib/long-press-drag";

interface DragState {
  index: number;
  target: number;
  dy: number;
}

interface SortableListOptions {
  list: () => HTMLElement;
  onReorder: (from: number, to: number) => void;
}

export function createSortableList(options: SortableListOptions) {
  let dragShift = 0;
  const [drag, setDrag] = createSignal<DragState>();
  const [dropping, setDropping] = createSignal(false);

  function startDrag(index: number, startY: number): DragSession {
    const list = options.list();
    const rects = [...list.children].map((el) => el.getBoundingClientRect());
    const midpoints = rects.map((r) => r.top + r.height / 2);
    dragShift =
      rects[index].height + (rects[1] ? rects[1].top - rects[0].bottom : 0);
    setDrag({ index, target: index, dy: 0 });

    return {
      move(clientY) {
        const dy = clientY - startY;
        const center = midpoints[index] + dy;
        let target = index;
        midpoints.forEach((mid, i) => {
          if (i > index && center > mid) target = i;
          if (i < index && center < mid && target >= index) target = i;
        });
        setDrag({ index, target, dy });
      },
      end() {
        const state = drag();
        if (!state) return;
        batch(() => {
          setDropping(true);
          setDrag(undefined);
          if (state.target !== state.index) {
            options.onReorder(state.index, state.target);
          }
        });
        // Commit the reordered layout before transitions come back
        list.getBoundingClientRect();
        setDropping(false);
      },
      cancel() {
        setDrag(undefined);
      },
    };
  }

  function offset(index: number) {
    const state = drag();
    if (!state) return 0;
    if (index === state.index) return state.dy;
    if (state.index < index && index <= state.target) return -dragShift;
    if (state.target <= index && index < state.index) return dragShift;
    return 0;
  }

  const isDragging = () => !!drag();
  const isItemDragging = (index: number) => drag()?.index === index;
  const isItemAnimated = (index: number) =>
    drag()?.index !== index && !dropping();

  const itemStyle = (index: number) => {
    const dy = offset(index);
    return dy ? { transform: `translateY(${dy}px)` } : undefined;
  };

  return { startDrag, isDragging, isItemDragging, isItemAnimated, itemStyle };
}

interface SortableItemOptions {
  item: () => HTMLElement;
  onDragStart: (clientY: number) => DragSession;
  onMove: (direction: -1 | 1) => void;
}

export function createSortableItem(options: SortableItemOptions) {
  onMount(() => {
    onCleanup(listenLongPressDrag(options.item(), options.onDragStart));
  });

  function handleHandlePointerDown(e: PointerEvent) {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    const session = options.onDragStart(e.clientY);
    const handleMove = (moveEvent: PointerEvent) =>
      session.move(moveEvent.clientY);
    const stopListening = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleEnd);
      window.removeEventListener("pointercancel", handleCancel);
    };
    const handleEnd = () => {
      stopListening();
      session.end();
    };
    const handleCancel = () => {
      stopListening();
      session.cancel();
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleEnd);
    window.addEventListener("pointercancel", handleCancel);
  }

  function handleHandleKeyDown(e: KeyboardEvent) {
    if (e.key === "ArrowUp") options.onMove(-1);
    else if (e.key === "ArrowDown") options.onMove(1);
    else return;
    e.preventDefault();
  }

  return { handleHandlePointerDown, handleHandleKeyDown };
}
