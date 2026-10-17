import { parseOptionalInt } from "@/lib/format";
import { cn } from "@/lib/utils";

interface TargetInputProps {
  placeholder: string;
  value?: number;
  onChange: (value: number | undefined) => void;
  class?: string;
}

// Small number input for a step target (sets, reps, seconds)
export function TargetInput(props: TargetInputProps) {
  return (
    <input
      type="number"
      min="1"
      placeholder={props.placeholder}
      value={props.value ?? ""}
      onInput={(e) => props.onChange(parseOptionalInt(e.currentTarget.value))}
      class={cn(
        "w-16 rounded-full px-2 py-1 text-xs outline outline-primary/50",
        props.class,
      )}
    />
  );
}
