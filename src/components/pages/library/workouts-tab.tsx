import { createAsync, useAction } from "@solidjs/router";
import { createSignal } from "solid-js";
import {
  createWorkout,
  deleteWorkout,
  getExercises,
  getOrCreateRestExercise,
  getWorkouts,
} from "@/api";
import type { Workout } from "@/api/types";
import { StepBuilder } from "@/components/pages/library/step-builder";
import type { Step } from "@/components/pages/library/step-row";
import { WorkoutCard } from "@/components/pages/library/workout-card";
import { AddCardButton } from "@/components/ui/add-card-button";
import { CardList } from "@/components/ui/card-list";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FormDialog } from "@/components/ui/form-dialog";
import { Input } from "@/components/ui/input";
import { pickTargets } from "@/lib/exercise-targets";

export function WorkoutsTab() {
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
          ...pickTargets(s, s.exerciseType),
        })),
      ),
    );
    return submitWorkout(formData);
  }

  return (
    <>
      <AddCardButton onClick={openDialog}>New workout</AddCardButton>
      <CardList each={workouts()} fallback="No workouts yet.">
        {(workout) => (
          <WorkoutCard workout={workout} onDelete={setWorkoutToDelete} />
        )}
      </CardList>
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
