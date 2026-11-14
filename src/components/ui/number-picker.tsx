import { createMemo } from "solid-js";
import {
  PopoverField,
  type PopoverFieldVariant,
} from "@/components/ui/popover-field";
import { WheelPicker } from "@/components/ui/wheel-picker";
import { createFieldValue } from "@/lib/create-field-value";

interface NumberPickerProps {
  label: string;
  unit: string;
  max: number;
  min?: number;
  step?: number;
  name?: string;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  variant?: Exclude<PopoverFieldVariant, "inline">;
}

const roundToStep = (value: number) => Math.round(value * 1000) / 1000;

export function NumberPicker(props: NumberPickerProps) {
  const min = () => props.min ?? 0;
  const step = () => props.step ?? 1;
  const field = createFieldValue(props, min());
  let popoverRef!: HTMLDivElement;

  const values = createMemo(() =>
    Array.from(
      { length: Math.floor((props.max - min()) / step()) + 1 },
      (_, i) => roundToStep(min() + i * step()),
    ),
  );
  const valueLabel = () => `${field.value()} ${props.unit}`;

  function handleOpenChange(isOpen: boolean) {
    if (isOpen)
      popoverRef.querySelector<HTMLElement>("[role=spinbutton]")?.focus();
  }

  return (
    <PopoverField
      label={props.label}
      value={valueLabel()}
      popupRole="dialog"
      variant={props.variant}
      name={props.name}
      formValue={field.value()}
      lazy
      popoverClass="w-36"
      popoverRef={(el) => (popoverRef = el)}
      onOpenChange={handleOpenChange}
    >
      <fieldset aria-label={props.label} class="flex items-center gap-1">
        <WheelPicker
          label={props.label}
          values={values()}
          value={field.value()}
          onChange={field.setValue}
        />
        <span class="w-10 text-gray-500 text-sm">{props.unit}</span>
      </fieldset>
    </PopoverField>
  );
}
