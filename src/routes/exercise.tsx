import { createAsync, type RouteDefinition, useAction } from "@solidjs/router";
import { createSignal, ErrorBoundary, For, Show } from "solid-js";
import { createExercises, getExercises, getUser } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
  const [error, setError] = createSignal<Error | null>(null);
  const [pending, setPending] = createSignal(false);
  let formRef: HTMLFormElement | undefined;

  function openDialog() {
    setError(null);
    setDialogOpen(true);
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!formRef) return;

    setPending(true);
    const result = await createExercise(new FormData(formRef));
    setPending(false);

    if (result instanceof Error) {
      setError(result);
      return;
    }

    setError(null);
    formRef.reset();
    setDialogOpen(false);
  }

  return (
    <div class="flex flex-1 flex-col gap-4">
      <div class="flex items-center justify-between">
        <h2 class="font-bold text-2xl">Exercises</h2>
        <Button type="button" onClick={openDialog}>
          New
        </Button>
      </div>
      <ErrorBoundary
        fallback={(err) => (
          <p class="text-red-400 text-sm" role="alert">
            {err.message}
          </p>
        )}
      >
        <ul class="flex flex-col gap-2">
          <For each={exercises()} fallback={<p>No exercises yet.</p>}>
            {(exercise) => (
              <li class="rounded-2xl border border-primary/20 p-4">
                <div class="flex items-center justify-between">
                  <p class="font-semibold">{exercise.name}</p>
                  <span class="text-primary text-xs capitalize">
                    {exercise.type}
                  </span>
                </div>
                <Show when={exercise.description}>
                  <p class="text-black/60 text-sm">{exercise.description}</p>
                </Show>
              </li>
            )}
          </For>
        </ul>
      </ErrorBoundary>
      <Dialog
        open={dialogOpen()}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="dialog-title"
      >
        <form ref={formRef} onSubmit={handleSubmit}>
          <DialogHeader onClose={() => setDialogOpen(false)}>
            New Exercise
          </DialogHeader>
          <DialogContent class="flex flex-col gap-3">
            <Input name="name" required />
            <Input name="description" />
            <Select
              name="type"
              defaultValue="strength"
              options={[
                { label: "Strength", value: "strength" },
                { label: "Cardio", value: "cardio" },
                { label: "Flexibility", value: "flexibility" },
              ]}
            />
            <Show when={error()}>
              <p class="text-red-400 text-sm" role="alert">
                {error()?.message}
              </p>
            </Show>
          </DialogContent>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending()}>
              {pending() ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
