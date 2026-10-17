import { createAsync, useAction } from "@solidjs/router";
import { Show } from "solid-js";
import { createRecord, getExercises, getWorkouts } from "@/api";
import { FormDialog } from "@/components/ui/form-dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { nowForDatetimeLocal } from "@/lib/date";
import { type RecordKind, recordKindLabel } from "@/lib/record-kind";

interface NewRecordDialogProps {
  open: boolean;
  kind: RecordKind;
  onClose: () => void;
}

export function NewRecordDialog(props: NewRecordDialogProps) {
  const exercises = createAsync(() => getExercises());
  const workouts = createAsync(() => getWorkouts());
  const submitRecord = useAction(createRecord);

  const exerciseOptions = () => {
    const list = exercises();
    if (!list) return [];
    return list
      .filter((e) => e.type !== "rest")
      .map((e) => ({ label: e.name, value: e.id }));
  };

  const workoutOptions = () => {
    const list = workouts();
    if (!list) return [];
    return list.map((w) => ({ label: w.name, value: w.id }));
  };

  function handleSubmit(formData: FormData) {
    formData.set("kind", props.kind);
    return submitRecord(formData);
  }

  return (
    <FormDialog
      open={props.open}
      onClose={props.onClose}
      title={`New ${recordKindLabel[props.kind]} Record`}
      onSubmit={handleSubmit}
    >
      <Show when={props.kind === "activity"}>
        <Select
          name="exerciseId"
          label="Exercise"
          required
          options={exerciseOptions()}
        />
      </Show>
      <Show when={props.kind === "workout"}>
        <Select
          name="workoutId"
          label="Workout"
          required
          options={workoutOptions()}
        />
      </Show>

      <Input name="title" label="Title" />
      <Input name="description" label="Notes" />
      <Input
        type="datetime-local"
        name="startedAt"
        label="Started at"
        required
        defaultValue={nowForDatetimeLocal()}
      />
      <Input
        type="number"
        min="1"
        name="durationMinutes"
        label="Duration (minutes)"
        required
      />
    </FormDialog>
  );
}
