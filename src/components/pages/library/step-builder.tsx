import {
  createMemo,
  createSignal,
  createUniqueId,
  Index,
  Show,
} from "solid-js";
import type { Exercise, Workout } from "@/api/types";
import { PlusIcon, TimerIcon } from "@/components/icons";
import { StepPicker } from "@/components/pages/library/step-picker";
import { type Step, StepRow } from "@/components/pages/library/step-row";
import { Button } from "@/components/ui/button";
import { isBuiltIn } from "@/lib/built-in-exercises";
import {
  exerciseDefaultTargets,
  pickTargets,
  type Targets,
} from "@/lib/exercise-targets";
import { createSortableList } from "@/lib/sortable-list";
import { cn } from "@/lib/utils";

const recentLimit = 5;

interface StepBuilderProps {
  steps: Step[];
  onChange: (steps: Step[]) => void;
  exercises?: Exercise[];
  restExercise?: Exercise;
  workouts?: Workout[];
}

export function StepBuilder(props: StepBuilderProps) {
  let listRef!: HTMLOListElement;
  const [pickerOpen, setPickerOpen] = createSignal(false);
  const sortable = createSortableList({
    list: () => listRef,
    onReorder: moveStepTo,
  });

  const savedSteps = createMemo(() =>
    (props.workouts ?? [])
      .toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .flatMap((w) => w.steps),
  );

  const savedTargets = createMemo(() => {
    const targets = new Map<string, Targets>();
    for (const step of savedSteps()) {
      if (!targets.has(step.exerciseId)) {
        targets.set(step.exerciseId, pickTargets(step, step.exerciseMetrics));
      }
    }
    return targets;
  });

  const recentIds = createMemo(() =>
    [
      ...new Set(
        savedSteps()
          .filter((s) => !isBuiltIn(s.exerciseType))
          .map((s) => s.exerciseId),
      ),
    ].slice(0, recentLimit),
  );

  function defaultTargets(exercise: Exercise) {
    const draft = props.steps.findLast((s) => s.exerciseId === exercise.id);
    if (draft) return pickTargets(draft, exercise.metrics);
    return savedTargets().get(exercise.id) ?? exerciseDefaultTargets(exercise);
  }

  function addStep(exercise: Exercise) {
    const key = createUniqueId();
    props.onChange([
      ...props.steps,
      {
        ...defaultTargets(exercise),
        key,
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        exerciseType: exercise.type,
        exerciseMetrics: exercise.metrics,
      },
    ]);
    requestAnimationFrame(() =>
      listRef.lastElementChild?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      }),
    );
  }

  const openPicker = () => setPickerOpen(true);

  function addRest() {
    if (props.restExercise) addStep(props.restExercise);
  }

  function duplicateStep(index: number) {
    const next = [...props.steps];
    next.splice(index + 1, 0, {
      ...props.steps[index],
      key: createUniqueId(),
    });
    props.onChange(next);
  }

  function removeStep(key: string) {
    props.onChange(props.steps.filter((s) => s.key !== key));
  }

  function moveStepTo(from: number, to: number) {
    if (to < 0 || to >= props.steps.length || to === from) return;
    const next = [...props.steps];
    const [step] = next.splice(from, 1);
    next.splice(to, 0, step);
    props.onChange(next);
  }

  // Rows are rendered by index, so focus has to follow the moved step
  function moveStepWithKeyboard(from: number, to: number) {
    if (to < 0 || to >= props.steps.length) return;
    moveStepTo(from, to);
    requestAnimationFrame(() =>
      listRef.children[to]
        ?.querySelector<HTMLElement>("[data-reorder-handle]")
        ?.focus(),
    );
  }

  function updateStep(key: string, patch: Partial<Step>) {
    props.onChange(
      props.steps.map((s) => (s.key === key ? { ...s, ...patch } : s)),
    );
  }

  return (
    <div class="flex flex-col gap-2">
      <p class="font-medium text-black/70 text-xs">Steps</p>
      <Show when={props.steps.length === 0}>
        <p class="rounded-lg bg-gray-50 px-3 py-4 text-center text-black/50">
          Add exercises and rests to build your workout.
        </p>
      </Show>
      <ol
        ref={listRef}
        class={cn(
          "flex flex-col gap-2",
          sortable.isDragging() && "select-none",
        )}
      >
        <Index each={props.steps}>
          {(step, i) => (
            <StepRow
              step={step()}
              dragging={sortable.isItemDragging(i)}
              animated={sortable.isItemAnimated(i)}
              style={sortable.itemStyle(i)}
              onDragStart={(clientY) => sortable.startDrag(i, clientY)}
              onMove={(direction) => moveStepWithKeyboard(i, i + direction)}
              onDuplicate={() => duplicateStep(i)}
              onRemove={() => removeStep(step().key)}
              onUpdate={(patch) => updateStep(step().key, patch)}
            />
          )}
        </Index>
      </ol>
      <div class="flex gap-2">
        <Button
          type="button"
          variant="dashed"
          class="flex-1"
          onClick={openPicker}
        >
          <PlusIcon aria-hidden="true" />
          Add exercise
        </Button>
        <Show when={props.restExercise}>
          <Button type="button" variant="dashed" onClick={addRest}>
            <TimerIcon aria-hidden="true" />
            Rest
          </Button>
        </Show>
      </div>
      <StepPicker
        open={pickerOpen()}
        onClose={() => setPickerOpen(false)}
        onSelect={addStep}
        exercises={props.exercises}
        recentIds={recentIds()}
      />
    </div>
  );
}
