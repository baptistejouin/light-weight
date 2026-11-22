import type { ExerciseType, Metric } from "@drizzle/schema";
import { For, type JSX, Show } from "solid-js";
import { ExerciseIcon } from "@/components/pages/library/exercise-icon";
import { TargetPicker } from "@/components/pages/library/target-picker";
import { DashedOutline } from "@/components/ui/dashed-outline";
import { SwipeActions } from "@/components/ui/swipe-actions";
import {
  type TargetField,
  type Targets,
  targetFieldsFor,
  targetMin,
} from "@/lib/exercise-targets";
import type { DragSession } from "@/lib/long-press-drag";
import { createSortableItem } from "@/lib/sortable-list";
import { cn } from "@/lib/utils";

export interface Step extends Targets {
  key: string;
  exerciseId: string;
  exerciseName: string;
  exerciseType: ExerciseType;
  exerciseBuiltIn: boolean;
  exerciseMetrics: Metric[];
}

interface StepRowProps {
  step: Step;
  dragging: boolean;
  animated: boolean;
  style?: JSX.CSSProperties;
  onDragStart: (clientY: number) => DragSession;
  onMove: (direction: -1 | 1) => void;
  onDuplicate: () => void;
  onRemove: () => void;
  onUpdate: (patch: Partial<Step>) => void;
}

export function StepRow(props: StepRowProps) {
  let rowRef!: HTMLDivElement;
  const fields = () => targetFieldsFor(props.step.exerciseMetrics);
  const builtIn = () => props.step.exerciseBuiltIn;

  const actions = () => [
    { label: "Duplicate", onSelect: props.onDuplicate },
    { label: "Delete", variant: "danger" as const, onSelect: props.onRemove },
  ];

  const targetUpdater = (field: TargetField) => (value: number) =>
    props.onUpdate({ [field]: value || undefined });

  const { handleHandlePointerDown, handleHandleKeyDown } = createSortableItem({
    item: () => rowRef,
    onDragStart: (clientY) => props.onDragStart(clientY),
    onMove: (direction) => props.onMove(direction),
  });

  return (
    <li
      style={props.style}
      class={cn(
        "@container relative select-none rounded-xl [-webkit-touch-callout:none]",
        props.dragging && "z-10 scale-[1.02] shadow-lg",
        props.animated && "transition-transform duration-200 ease-out",
      )}
    >
      <SwipeActions
        actions={actions()}
        class={cn("rounded-xl", !builtIn() && "border border-gray-200")}
      >
        <div ref={rowRef} class="flex items-center gap-3 @md:py-4 py-3 pr-3">
          <button
            type="button"
            aria-label={`Reorder ${props.step.exerciseName}`}
            data-reorder-handle
            onPointerDown={handleHandlePointerDown}
            onKeyDown={handleHandleKeyDown}
            class="group flex cursor-grab items-center self-stretch pl-3 outline-none active:cursor-grabbing"
          >
            <span class="flex size-10 items-center justify-center rounded-lg bg-gray-100 text-black outline-focus group-focus-visible:outline-2">
              <ExerciseIcon
                exerciseType={props.step.exerciseType}
                class="size-5"
              />
            </span>
          </button>
          <div class="flex min-w-0 flex-1 @md:flex-row flex-col @md:items-center @md:gap-3 gap-2">
            <span class="min-w-0 @md:flex-1 truncate font-medium text-base text-black">
              {props.step.exerciseName}
            </span>
            <div class="flex @md:shrink-0 flex-wrap @md:flex-nowrap items-center gap-1">
              <For each={fields()}>
                {(field) => (
                  <TargetPicker
                    field={field}
                    variant="compact"
                    value={props.step[field] ?? targetMin(field)}
                    onChange={targetUpdater(field)}
                  />
                )}
              </For>
            </div>
          </div>
        </div>
      </SwipeActions>
      <Show when={builtIn()}>
        <DashedOutline />
      </Show>
    </li>
  );
}
