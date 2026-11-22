import { DragGesture } from "@use-gesture/vanilla";
import {
  createEffect,
  createSignal,
  type JSX,
  onCleanup,
  splitProps,
  untrack,
} from "solid-js";
import { type DialogProps, DialogRoot } from "@/components/ui/dialog";
import { blockScroll, createGesture, dragConfig, isMouse } from "@/lib/gesture";
import { cn } from "@/lib/utils";

const DISMISS_DISTANCE_RATIO = 0.25;
const DISMISS_VELOCITY = 0.5;
const SNAP_BACK_TRANSITION = "translate 300ms cubic-bezier(0.32,0.72,0,1)";
const COVERED_SCALE = 0.94;
const COVERED_LIFT_PX = 8;

interface DrawerSheetProps {
  onClose: () => void;
  preventClose?: boolean;
  onDragProgress: (progress: number | undefined) => void;
  children: JSX.Element;
  class?: string;
}

function DrawerSheet(props: DrawerSheetProps) {
  let sheetRef!: HTMLDivElement;
  let scrollerRef!: HTMLDivElement;

  let offset = 0;
  let sheetHeight = 0;

  function setOffset(value: number, animate: boolean) {
    offset = value;
    sheetRef.style.transition = animate ? SNAP_BACK_TRANSITION : "none";
    sheetRef.style.translate = value ? `0 ${value}px` : "";
    props.onDragProgress(
      animate ? undefined : Math.min(1, value / sheetHeight),
    );
  }

  function canStartDrag(target: EventTarget | null) {
    if (props.preventClose) return false;
    if (!(target instanceof Element)) return false;
    if (target.closest("input[type=range], :popover-open")) return false;
    return !scrollerRef.contains(target) || scrollerRef.scrollTop <= 0;
  }

  function finishDrag(flicked: boolean) {
    const pastDistance = offset > sheetHeight * DISMISS_DISTANCE_RATIO;
    if (pastDistance || flicked) {
      props.onDragProgress(undefined);
      props.onClose();
    } else {
      setOffset(0, true);
    }
  }

  createGesture(
    () =>
      new DragGesture(
        sheetRef,
        ({
          first,
          last,
          canceled,
          movement: [, my],
          velocity: [, vy],
          direction: [, dy],
          event,
          cancel,
        }) => {
          if (first) {
            if (isMouse(event) || my < 0 || !canStartDrag(event.target)) {
              return cancel();
            }
            sheetHeight = sheetRef.offsetHeight;
          }
          if (canceled) return;
          blockScroll(event);
          if (last) finishDrag(dy > 0 && vy > DISMISS_VELOCITY);
          else setOffset(Math.max(0, my), false);
        },
        { ...dragConfig, threshold: 4, axis: "y" },
      ),
  );

  return (
    <div
      ref={sheetRef}
      tabIndex={-1}
      autofocus
      class={cn(
        "flex h-[85dvh] flex-col overflow-hidden rounded-t-3xl bg-white shadow-[0_-8px_30px_rgb(0_0_0/0.12)] outline-none",
        props.class,
      )}
    >
      <div
        aria-hidden="true"
        class="mx-auto mt-3 mb-1 h-1.5 w-10 shrink-0 rounded-full bg-black/15"
      />
      <div
        ref={scrollerRef}
        class="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)]"
      >
        {props.children}
      </div>
    </div>
  );
}

const [openDrawers, setOpenDrawers] = createSignal<symbol[]>([]);
const [drawerDrag, setDrawerDrag] = createSignal<{
  id: symbol;
  progress: number;
}>();

export function DrawerDialog(props: DialogProps) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  const id = Symbol();
  // Captured at open so the backdrop doesn't flash darker while closing
  const [stacked, setStacked] = createSignal(false);

  const coveringDrawer = () => {
    const drawers = openDrawers();
    const index = drawers.indexOf(id);
    return index === -1 ? undefined : drawers[index + 1];
  };

  const stackStyle = (): JSX.CSSProperties | undefined => {
    const above = coveringDrawer();
    if (!above) return undefined;
    const drag = drawerDrag();
    const following = drag?.id === above;
    const progress = following ? drag.progress : 0;
    return {
      scale: String(COVERED_SCALE + (1 - COVERED_SCALE) * progress),
      translate: `0 ${-COVERED_LIFT_PX * (1 - progress)}px`,
      transition: following ? "none" : undefined,
    };
  };

  function handleDragProgress(progress: number | undefined) {
    setDrawerDrag(progress === undefined ? undefined : { id, progress });
  }

  createEffect(() => {
    if (!props.open) return;
    setStacked(untrack(openDrawers).length > 0);
    setOpenDrawers((drawers) => [...drawers, id]);
    onCleanup(() =>
      setOpenDrawers((drawers) => drawers.filter((d) => d !== id)),
    );
  });

  return (
    <DialogRoot
      {...rest}
      class={cn(
        "mx-auto mt-auto mb-0 max-h-none w-full max-w-lg overflow-visible bg-transparent p-0",
        "origin-top transition-[scale,translate] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
        stacked()
          ? "backdrop:bg-black/20"
          : "backdrop:bg-black/40 backdrop:backdrop-blur-sm",
        "open:slide-in-from-bottom-full open:animate-in open:duration-500 open:ease-[cubic-bezier(0.32,0.72,0,1)]",
        "backdrop:fade-in backdrop:animate-in backdrop:duration-500",
        "data-closing:slide-out-to-bottom-full data-closing:pointer-events-none data-closing:animate-out data-closing:fill-mode-forwards data-closing:duration-300",
        "data-closing:backdrop:fade-out data-closing:backdrop:animate-out data-closing:backdrop:fill-mode-forwards data-closing:backdrop:duration-300",
      )}
      style={stackStyle()}
    >
      <DrawerSheet
        class={local.class}
        onClose={props.onClose}
        preventClose={props.preventClose}
        onDragProgress={handleDragProgress}
      >
        {local.children}
      </DrawerSheet>
    </DialogRoot>
  );
}
