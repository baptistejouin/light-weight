import { createAsync, type RouteDefinition, useAction } from "@solidjs/router";
import { createSignal, For } from "solid-js";
import { createExercises, getExercises, getUser } from "@/api";
import { ExerciseCard } from "@/components/pages/exercise/exercise-card";
import { QueryBoundary } from "@/components/ui/error-message";
import { FormDialog } from "@/components/ui/form-dialog";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";

export const route = {
  preload() {
    getUser();
    getExercises();
  },
} satisfies RouteDefinition;

export default function Exercise() {
  const exercises = createAsync(() => getExercises());
  const createExercise = useAction(createExercises);
  const [dialogOpen, setDialogOpen] = createSignal(false);

  return (
    <div class="flex flex-1 flex-col gap-4">
      <PageHeader title="Exercises" onNew={() => setDialogOpen(true)} />
      <QueryBoundary>
        <ul class="flex flex-col gap-2">
          <For each={exercises()} fallback={<p>No exercises yet.</p>}>
            {(exercise) => <ExerciseCard exercise={exercise} />}
          </For>
        </ul>
      </QueryBoundary>
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
          options={[
            { label: "Strength", value: "strength" },
            { label: "Cardio", value: "cardio" },
            { label: "Flexibility", value: "flexibility" },
          ]}
        />
      </FormDialog>
    </div>
  );
}
