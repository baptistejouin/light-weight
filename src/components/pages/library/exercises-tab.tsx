import type { ExerciseType } from "@drizzle/schema";
import { createAsync, useAction } from "@solidjs/router";
import { createMemo, createSignal } from "solid-js";
import { createExercises, deleteExercise, getExercises } from "@/api";
import type { Exercise } from "@/api/types";
import { ExerciseRow } from "@/components/pages/library/exercise-row";
import { LibraryToolbar } from "@/components/pages/library/library-toolbar";
import { CardList } from "@/components/ui/card-list";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FormDialog } from "@/components/ui/form-dialog";
import { Input } from "@/components/ui/input";
import { SearchEmptyState } from "@/components/ui/search-empty-state";
import { Select } from "@/components/ui/select";
import { isBuiltIn } from "@/lib/built-in-exercises";
import { createDebouncedSearch, filterByName } from "@/lib/debounced-search";

const typeOptions: { label: string; value: ExerciseType }[] = [
  { label: "Strength", value: "strength" },
  { label: "Cardio", value: "cardio" },
  { label: "Flexibility", value: "flexibility" },
];

export function ExercisesTab() {
  const { query, searchTerm, setQuery } = createDebouncedSearch();
  const exercises = createAsync(() => getExercises());
  const createExercise = useAction(createExercises);
  const removeExercise = useAction(deleteExercise);
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [exerciseToDelete, setExerciseToDelete] = createSignal<Exercise>();

  const matchingExercises = createMemo(() =>
    filterByName(exercises(), searchTerm())?.toSorted(
      (a, b) => Number(isBuiltIn(b.type)) - Number(isBuiltIn(a.type)),
    ),
  );

  const openNewDialog = () => setDialogOpen(true);
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
          defaultValue="strength"
          options={typeOptions}
        />
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
