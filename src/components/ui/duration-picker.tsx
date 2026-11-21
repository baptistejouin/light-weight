import { For } from "solid-js";
import {
  PopoverField,
  type PopoverFieldVariant,
} from "@/components/ui/popover-field";
import { WheelPicker } from "@/components/ui/wheel-picker";
import { createFieldValue } from "@/lib/create-field-value";
import {
  type DurationUnit,
  durationUnits,
  formatDuration,
  joinDuration,
  splitDuration,
} from "@/lib/duration";

interface DurationPickerProps {
  label: string;
  units: DurationUnit[];
  name?: string;
  min?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (seconds: number) => void;
  variant?: Exclude<PopoverFieldVariant, "inline">;
}

const range = (max: number) => Array.from({ length: max + 1 }, (_, i) => i);

const wheelValues: Record<DurationUnit, number[]> = {
  hours: range(durationUnits.hours.max),
  minutes: range(durationUnits.minutes.max),
  seconds: range(durationUnits.seconds.max),
};

const formatTwoDigits = (value: number) => String(value).padStart(2, "0");

export function DurationPicker(props: DurationPickerProps) {
  const min = () => props.min ?? 0;
  const field = createFieldValue(props, min());
  let popoverRef!: HTMLDivElement;

  const parts = () => splitDuration(field.value(), props.units);
  const smallestUnit = () => props.units[props.units.length - 1];
  const valueLabel = () =>
    formatDuration(field.value(), props.units) ??
    `0${durationUnits[smallestUnit()].narrow}`;

  function setPart(unit: DurationUnit, value: number) {
    field.setValue(
      Math.max(min(), joinDuration({ ...parts(), [unit]: value })),
    );
  }

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
      popoverClass="w-60"
      popoverRef={(el) => (popoverRef = el)}
      onOpenChange={handleOpenChange}
    >
      <fieldset aria-label={props.label} class="flex items-center gap-1">
        <For each={props.units}>
          {(unit) => (
            <>
              <WheelPicker
                label={durationUnits[unit].label}
                values={wheelValues[unit]}
                value={parts()[unit] ?? 0}
                onChange={(value) => setPart(unit, value)}
                format={formatTwoDigits}
              />
              <span class="w-8 text-gray-500 text-sm">
                {durationUnits[unit].narrow}
              </span>
            </>
          )}
        </For>
      </fieldset>
    </PopoverField>
  );
}
