import type { ExerciseType } from "@drizzle/schema";
import { createAsync, useAction } from "@solidjs/router";
import { createSignal } from "solid-js";
import { createExercises, deleteExercise, getExercises } from "@/api";
import type { Exercise } from "@/api/types";
import { ExerciseRow } from "@/components/pages/library/exercise-row";
import { AddCardButton } from "@/components/ui/add-card-button";
import { CardList } from "@/components/ui/card-list";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FormDialog } from "@/components/ui/form-dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { isBuiltIn } from "@/lib/built-in-exercises";

const typeOptions: { label: string; value: ExerciseType }[] = [
  { label: "Strength", value: "strength" },
  { label: "Cardio", value: "cardio" },
  { label: "Flexibility", value: "flexibility" },
];

export function ExercisesTab() {
  const exercises = createAsync(() => getExercises());
  const createExercise = useAction(createExercises);
  const removeExercise = useAction(deleteExercise);
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [exerciseToDelete, setExerciseToDelete] = createSignal<Exercise>();

  const sortedExercises = () =>
    exercises()?.toSorted(
      (a, b) => Number(isBuiltIn(b.type)) - Number(isBuiltIn(a.type)),
    );

  const handleNewClick = () => setDialogOpen(true);
  const handleDeleteClose = () => setExerciseToDelete(undefined);

  function handleConfirmDelete() {
    const exercise = exerciseToDelete();
    if (exercise) return removeExercise(exercise.id);
  }

  return (
    <>
      <AddCardButton onClick={handleNewClick}>New exercise</AddCardButton>
      <CardList
        each={sortedExercises()}
        fallback="No exercises yet."
        class="-mx-4 gap-0 divide-y divide-gray-200"
      >
        {(exercise) => (
          <ExerciseRow exercise={exercise} onDelete={setExerciseToDelete} />
        )}
      </CardList>
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
