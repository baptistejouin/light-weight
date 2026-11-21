import type { ExerciseType, Metric } from "@drizzle/schema";
import { createAsync, useAction } from "@solidjs/router";
import { createMemo, createSignal, For } from "solid-js";
import { createExercises, deleteExercise, getExercises } from "@/api";
import type { Exercise } from "@/api/types";
import { ExerciseRow } from "@/components/pages/library/exercise-row";
import { LibraryToolbar } from "@/components/pages/library/library-toolbar";
import { MetricPicker } from "@/components/pages/library/metric-picker";
import { TargetPicker } from "@/components/pages/library/target-picker";
import { CardList } from "@/components/ui/card-list";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FormDialog } from "@/components/ui/form-dialog";
import { Input } from "@/components/ui/input";
import { SearchEmptyState } from "@/components/ui/search-empty-state";
import { Select } from "@/components/ui/select";
import { isBuiltIn } from "@/lib/built-in-exercises";
import { createDebouncedSearch, filterByName } from "@/lib/debounced-search";
import {
  defaultMetricsByType,
  type TargetField,
  type Targets,
  targetFieldsFor,
} from "@/lib/exercise-targets";

const typeOptions: { label: string; value: ExerciseType }[] = [
  { label: "Strength", value: "strength" },
  { label: "Cardio", value: "cardio" },
  { label: "Flexibility", value: "flexibility" },
];

const startingTargetLabels: Record<TargetField, string> = {
  targetSets: "Starting sets",
  targetReps: "Starting reps",
  targetWeightKg: "Starting weight",
  targetDurationSeconds: "Starting duration",
  targetDistanceM: "Starting distance",
};

export function ExercisesTab() {
  const { query, searchTerm, setQuery } = createDebouncedSearch();
  const exercises = createAsync(() => getExercises());
  const createExercise = useAction(createExercises);
  const removeExercise = useAction(deleteExercise);
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [exerciseToDelete, setExerciseToDelete] = createSignal<Exercise>();
  const [exerciseType, setExerciseType] =
    createSignal<ExerciseType>("strength");
  const [exerciseMetrics, setExerciseMetrics] = createSignal<Metric[]>(
    defaultMetricsByType.strength,
  );

  const [startingTargets, setStartingTargets] = createSignal<Targets>({});

  const startingTargetFields = () => targetFieldsFor(exerciseMetrics());

  // Untouched pickers show their minimum but submit nothing
  const startingTargetName = (field: TargetField) =>
    startingTargets()[field] === undefined ? undefined : field;

  const startingTargetUpdater = (field: TargetField) => (value: number) =>
    setStartingTargets((targets) => ({ ...targets, [field]: value }));

  const matchingExercises = createMemo(() =>
    filterByName(exercises(), searchTerm())?.toSorted(
      (a, b) => Number(isBuiltIn(b.type)) - Number(isBuiltIn(a.type)),
    ),
  );

  function selectType(type: ExerciseType) {
    setExerciseType(type);
    setExerciseMetrics(defaultMetricsByType[type]);
    setStartingTargets({});
  }

  function openNewDialog() {
    selectType("strength");
    setDialogOpen(true);
  }

  const handleTypeChange = (value: string) => selectType(value as ExerciseType);
  const handleDeleteClose = () => setExerciseToDelete(undefined);

  function handleConfirmDelete() {
    const exercise = exerciseToDelete();
    if (exercise) return removeExercise(exercise.id);
  }

  return (
    <>
      <div class="flex flex-col gap-4">
        <LibraryToolbar
          searchLabel="Search exercises"
          query={query()}
          onQueryChange={setQuery}
          addLabel="New exercise"
          onAdd={openNewDialog}
        />
        <CardList
          each={matchingExercises()}
          fallback={
            <SearchEmptyState
              searchTerm={searchTerm()}
              emptyLabel="No exercises yet."
            />
          }
        >
          {(exercise) => (
            <ExerciseRow exercise={exercise} onDelete={setExerciseToDelete} />
          )}
        </CardList>
      </div>
      <FormDialog
        open={dialogOpen()}
        onClose={() => setDialogOpen(false)}
        title="New Exercise"
        onSubmit={createExercise}
      >
        <Input name="name" label="Name" required />
        <Input name="description" label="Description" />
        <Select
          name="type"
          label="Type"
          value={exerciseType()}
          onChange={handleTypeChange}
          options={typeOptions}
        />
        <MetricPicker
          name="metrics"
          value={exerciseMetrics()}
          onChange={setExerciseMetrics}
        />
        <For each={startingTargetFields()}>
          {(field) => (
            <TargetPicker
              field={field}
              label={startingTargetLabels[field]}
              name={startingTargetName(field)}
              value={startingTargets()[field]}
              onChange={startingTargetUpdater(field)}
            />
          )}
        </For>
      </FormDialog>
      <ConfirmDialog
        open={!!exerciseToDelete()}
        onClose={handleDeleteClose}
        title="Delete exercise?"
        confirmLabel="Delete"
        pendingLabel="Deleting..."
        onConfirm={handleConfirmDelete}
      >
        "{exerciseToDelete()?.name}" will be permanently removed.
      </ConfirmDialog>
    </>
  );
}
