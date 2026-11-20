import { createAsync, useAction } from "@solidjs/router";
import { createMemo, createSignal } from "solid-js";
import {
  createWorkout,
  deleteWorkout,
  getExercises,
  getOrCreateRestExercise,
  getWorkouts,
} from "@/api";
import type { Workout } from "@/api/types";
import { LibraryToolbar } from "@/components/pages/library/library-toolbar";
import { StepBuilder } from "@/components/pages/library/step-builder";
import type { Step } from "@/components/pages/library/step-row";
import { WorkoutCard } from "@/components/pages/library/workout-card";
import { CardList } from "@/components/ui/card-list";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FormDialog } from "@/components/ui/form-dialog";
import { Input } from "@/components/ui/input";
import { SearchEmptyState } from "@/components/ui/search-empty-state";
import { createDebouncedSearch, filterByName } from "@/lib/debounced-search";
import { pickTargets } from "@/lib/exercise-targets";

export function WorkoutsTab() {
  const { query, searchTerm, setQuery } = createDebouncedSearch();
  const workouts = createAsync(() => getWorkouts());
  const exercises = createAsync(() => getExercises());
  const restExercise = createAsync(() => getOrCreateRestExercise());

  const submitWorkout = useAction(createWorkout);
  const removeWorkout = useAction(deleteWorkout);
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [workoutToDelete, setWorkoutToDelete] = createSignal<Workout>();
  const [steps, setSteps] = createSignal<Step[]>([]);

  function openDialog() {
    setSteps([]);
    setDialogOpen(true);
  }

  const matchingWorkouts = createMemo(() =>
    filterByName(workouts(), searchTerm()),
  );

  const handleDeleteClose = () => setWorkoutToDelete(undefined);

  function handleConfirmDelete() {
    const workout = workoutToDelete();
    if (workout) return removeWorkout(workout.id);
  }

  function handleSubmit(formData: FormData) {
    if (steps().length === 0) {
      return new Error("Add at least one exercise or rest step");
    }

    formData.set(
      "steps",
      JSON.stringify(
        steps().map((s) => ({
          exerciseId: s.exerciseId,
          ...pickTargets(s, s.exerciseMetrics),
        })),
      ),
    );
    return submitWorkout(formData);
  }

  return (
    <>
      <div class="flex flex-col gap-4">
        <LibraryToolbar
          searchLabel="Search workouts"
          query={query()}
          onQueryChange={setQuery}
          addLabel="New workout"
          onAdd={openDialog}
        />
        <CardList
          each={matchingWorkouts()}
          fallback={
            <SearchEmptyState
              searchTerm={searchTerm()}
              emptyLabel="No workouts yet."
            />
          }
        >
          {(workout) => (
            <WorkoutCard workout={workout} onDelete={setWorkoutToDelete} />
          )}
        </CardList>
      </div>
      <FormDialog
        open={dialogOpen()}
        onClose={() => setDialogOpen(false)}
        title="New Workout"
        onSubmit={handleSubmit}
      >
        <Input name="name" label="Name" required />
        <Input name="description" label="Description" />
        <StepBuilder
          steps={steps()}
          onChange={setSteps}
          exercises={exercises()}
          restExercise={restExercise()}
        />
      </FormDialog>
      <ConfirmDialog
        open={!!workoutToDelete()}
        onClose={handleDeleteClose}
        title="Delete workout?"
        confirmLabel="Delete"
        pendingLabel="Deleting..."
        onConfirm={handleConfirmDelete}
      >
        "{workoutToDelete()?.name}" will be permanently removed.
      </ConfirmDialog>
    </>
  );
}
