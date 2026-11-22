import type { ExerciseType } from "@drizzle/schema";
import { createMemo, createSignal, createUniqueId, For, Show } from "solid-js";
import { Portal } from "solid-js/web";
import type { Exercise } from "@/api/types";
import { ExerciseLabel } from "@/components/pages/library/exercise-icon";
import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DrawerDialog } from "@/components/ui/drawer-dialog";
import { SearchEmptyState } from "@/components/ui/search-empty-state";
import { SearchField } from "@/components/ui/search-field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { filterByName } from "@/lib/debounced-search";

type TypeFilter = Exclude<ExerciseType, "rest"> | "all";

const typeFilters: { label: string; value: TypeFilter }[] = [
  { label: "All", value: "all" },
  { label: "Strength", value: "strength" },
  { label: "Cardio", value: "cardio" },
  { label: "Flex", value: "flexibility" },
];

interface StepPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (exercise: Exercise) => void;
  exercises?: Exercise[];
  recentIds: string[];
}

export function StepPicker(props: StepPickerProps) {
  const titleId = createUniqueId();
  const [query, setQuery] = createSignal("");
  const [typeFilter, setTypeFilter] = createSignal<TypeFilter>("all");

  const pickable = createMemo(
    () => props.exercises?.filter((e) => !e.builtIn) ?? [],
  );

  const matches = createMemo(() => {
    const type = typeFilter();
    return (
      filterByName(pickable(), query())?.filter(
        (e) => type === "all" || e.type === type,
      ) ?? []
    );
  });

  const recent = createMemo(() => {
    if (query() || typeFilter() !== "all") return [];
    const byId = new Map(pickable().map((e) => [e.id, e]));
    return props.recentIds.flatMap((id) => byId.get(id) ?? []);
  });

  function handleClose() {
    setQuery("");
    setTypeFilter("all");
    props.onClose();
  }

  function handleSelect(exercise: Exercise) {
    props.onSelect(exercise);
    handleClose();
  }

  return (
    <Portal>
      <DrawerDialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby={titleId}
        class="h-[80dvh]"
      >
        <DialogHeader id={titleId}>Add exercise</DialogHeader>
        <DialogContent class="flex flex-col gap-3">
          <SearchField
            label="Search exercises"
            placeholder="Search exercises"
            value={query()}
            onValueChange={setQuery}
            class="flex-none"
          />
          <SegmentedControl
            items={typeFilters}
            value={typeFilter()}
            onChange={setTypeFilter}
          />
          <Show when={recent().length > 0}>
            <ExerciseGroup
              title="Recent"
              exercises={recent()}
              onSelect={handleSelect}
            />
          </Show>
          <Show
            when={matches().length > 0}
            fallback={
              <SearchEmptyState
                searchTerm={query().trim()}
                emptyLabel="No exercises match."
              />
            }
          >
            <ExerciseGroup
              title={recent().length > 0 ? "All exercises" : undefined}
              exercises={matches()}
              onSelect={handleSelect}
            />
          </Show>
        </DialogContent>
      </DrawerDialog>
    </Portal>
  );
}

interface ExerciseGroupProps {
  title?: string;
  exercises: Exercise[];
  onSelect: (exercise: Exercise) => void;
}

function ExerciseGroup(props: ExerciseGroupProps) {
  return (
    <section class="flex flex-col">
      <Show when={props.title}>
        <h3 class="pb-1 font-medium text-black/50 text-xs">{props.title}</h3>
      </Show>
      <ul class="flex flex-col divide-y divide-gray-100">
        <For each={props.exercises}>
          {(exercise) => (
            <li>
              <button
                type="button"
                onClick={() => props.onSelect(exercise)}
                class="flex w-full cursor-pointer items-center justify-between gap-2 rounded-md py-3 text-left text-black transition-colors hover:text-primary"
              >
                <ExerciseLabel exercise={exercise} />
                <span class="text-primary text-xs capitalize">
                  {exercise.type}
                </span>
              </button>
            </li>
          )}
        </For>
      </ul>
    </section>
  );
}
