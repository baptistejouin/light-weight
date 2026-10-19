import { cn } from "@/lib/utils";

interface TargetInputProps {
  placeholder: string;
  value?: number;
  onChange: (value: number | undefined) => void;
  step: string;
  class?: string;
}

export function TargetInput(props: TargetInputProps) {
  function handleInput(e: InputEvent & { currentTarget: HTMLInputElement }) {
    const value = e.currentTarget.valueAsNumber;
    props.onChange(Number.isNaN(value) ? undefined : value);
  }

  return (
    <input
      type="number"
      min="1"
      step={props.step}
      placeholder={props.placeholder}
      value={props.value ?? ""}
      onInput={handleInput}
      class={cn(
        "w-16 rounded-full px-2 py-1 text-xs outline outline-primary/50",
        props.class,
      )}
    />
  );
}
