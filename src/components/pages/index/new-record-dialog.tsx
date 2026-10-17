import { useAction } from "@solidjs/router";
import { createEffect, createSignal, on, Show } from "solid-js";
import { createRecord } from "@/api";
import type { Exercise, Workout } from "@/api/types";
import { FormDialog } from "@/components/ui/form-dialog";
import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Select } from "@/components/ui/select";
import { nowForDatetimeLocal } from "@/lib/date";

interface NewRecordDialogProps {
  open: boolean;
  onClose: () => void;
  exercises: Exercise[];
  workouts: Workout[];
}

export function NewRecordDialog(props: NewRecordDialogProps) {
  const [kind, setKind] = createSignal<"activity" | "workout">("activity");
  const submitRecord = useAction(createRecord);

  createEffect(
    on(
      () => props.open,
      (open) => open && setKind("activity"),
    ),
  );

  function handleSubmit(formData: FormData) {
    formData.set("kind", kind());
    return submitRecord(formData);
  }

  return (
    <FormDialog
      open={props.open}
      onClose={props.onClose}
      title="New Record"
      onSubmit={handleSubmit}
    >
      <SegmentedControl
        items={[
          { label: "Activity", value: "activity" },
          { label: "Workout", value: "workout" },
        ]}
        value={kind()}
        onChange={setKind}
      />

      <Show when={kind() === "activity"}>
        <Select
          name="exerciseId"
          required
          options={props.exercises
            .filter((e) => e.type !== "rest")
            .map((e) => ({ label: e.name, value: e.id }))}
        />
      </Show>
      <Show when={kind() === "workout"}>
        <Select
          name="workoutId"
          required
          options={props.workouts.map((w) => ({ label: w.name, value: w.id }))}
        />
      </Show>

      <Input name="title" />
      <Input name="description" />
      <Input
        type="datetime-local"
        name="startedAt"
        required
        defaultValue={nowForDatetimeLocal()}
      />
      <Input
        type="number"
        min="1"
        name="durationMinutes"
        placeholder="Duration (minutes)"
        required
      />
    </FormDialog>
  );
}
