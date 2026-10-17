import { createAsync, type RouteDefinition, useAction } from "@solidjs/router";
import { createSignal, For } from "solid-js";
import {
  createWorkout,
  getExercises,
  getOrCreateRestExercise,
  getUser,
  getWorkouts,
} from "@/api";
import { StepBuilder } from "@/components/pages/workouts/step-builder";
import type { Step } from "@/components/pages/workouts/step-row";
import { WorkoutCard } from "@/components/pages/workouts/workout-card";
import { QueryBoundary } from "@/components/ui/error-message";
import { FormDialog } from "@/components/ui/form-dialog";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";

export const route = {
  preload() {
    getUser();
    getWorkouts();
    getExercises();
    getOrCreateRestExercise();
  },
} satisfies RouteDefinition;

export default function WorkoutsPage() {
  const workouts = createAsync(() => getWorkouts());
  const exercises = createAsync(() => getExercises(), { initialValue: [] });
  const restExercise = createAsync(() => getOrCreateRestExercise());

  const submitWorkout = useAction(createWorkout);
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [steps, setSteps] = createSignal<Step[]>([]);

  function openDialog() {
    setSteps([]);
    setDialogOpen(true);
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
          targetSets: s.targetSets,
          targetReps: s.targetReps,
          targetDuration: s.targetDuration,
        })),
      ),
    );
    return submitWorkout(formData);
  }

  return (
    <div class="flex flex-1 flex-col gap-4">
      <PageHeader title="Workouts" onNew={openDialog} />
      <QueryBoundary>
        <ul class="flex flex-col gap-2">
          <For each={workouts()} fallback={<p>No workouts yet.</p>}>
            {(workout) => <WorkoutCard workout={workout} />}
          </For>
        </ul>
      </QueryBoundary>
      <FormDialog
        open={dialogOpen()}
        onClose={() => setDialogOpen(false)}
        title="New Workout"
        onSubmit={handleSubmit}
      >
        <Input name="name" required />
        <Input name="description" />
        <StepBuilder
          steps={steps()}
          onChange={setSteps}
          exercises={exercises()}
          restExercise={restExercise()}
        />
      </FormDialog>
    </div>
  );
}
