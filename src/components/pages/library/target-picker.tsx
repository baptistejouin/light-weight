import { Show } from "solid-js";
import { DurationPicker } from "@/components/ui/duration-picker";
import { NumberPicker } from "@/components/ui/number-picker";
import {
  type TargetField,
  targetDurationMinSeconds,
  targetDurationUnits,
  targetPickerConfig,
} from "@/lib/exercise-targets";

interface TargetPickerProps {
  field: TargetField;
  label?: string;
  name?: string;
  value?: number;
  onChange?: (value: number) => void;
  variant?: "outline" | "compact";
}

export function TargetPicker(props: TargetPickerProps) {
  const numericField = () =>
    props.field === "targetDurationSeconds" ? undefined : props.field;

  return (
    <Show
      when={numericField()}
      fallback={
        <DurationPicker
          label={props.label ?? "Target duration"}
          units={targetDurationUnits}
          min={targetDurationMinSeconds}
          name={props.name}
          value={props.value}
          onChange={props.onChange}
          variant={props.variant}
        />
      }
    >
      {(field) => (
        <NumberPicker
          {...targetPickerConfig[field()]}
          label={props.label ?? targetPickerConfig[field()].label}
          name={props.name}
          value={props.value}
          onChange={props.onChange}
          variant={props.variant}
        />
      )}
    </Show>
  );
}
