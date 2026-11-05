import { For } from "solid-js";
import { CheckIcon } from "@/components/icons";
import {
  PopoverField,
  type PopoverFieldVariant,
} from "@/components/ui/popover-field";
import { popoverItemClass } from "@/components/ui/popover-styles";
import { createFieldValue } from "@/lib/create-field-value";
import { cn } from "@/lib/utils";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  name: string;
  label: string;
  options: SelectOption[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  variant?: Exclude<PopoverFieldVariant, "compact">;
  class?: string;
}

export function Select(props: SelectProps) {
  const field = createFieldValue(props, "");
  let trigger: HTMLButtonElement | undefined;
  let listbox: HTMLDivElement | undefined;

  const value = () => field.value() || props.options[0]?.value;
  const selectedOption = () =>
    props.options.find((option) => option.value === value());

  const optionButtons = () =>
    Array.from(
      listbox?.querySelectorAll<HTMLButtonElement>("[role=option]") ?? [],
    );

  function focusOption(index: number) {
    const buttons = optionButtons();
    buttons[(index + buttons.length) % buttons.length]?.focus();
  }

  function choose(option: SelectOption) {
    field.setValue(option.value);
    listbox?.hidePopover();
    trigger?.focus();
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) return;
    const index = props.options.findIndex((o) => o.value === value());
    focusOption(Math.max(index, 0));
  }

  function handleTriggerKeyDown(e: KeyboardEvent) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    listbox?.showPopover();
  }

  function handleListboxKeyDown(e: KeyboardEvent) {
    const current = optionButtons().indexOf(
      document.activeElement as HTMLButtonElement,
    );
    const moves: Record<string, number> = {
      ArrowDown: current + 1,
      ArrowUp: current - 1,
      Home: 0,
      End: -1,
    };
    if (!(e.key in moves)) return;
    e.preventDefault();
    focusOption(moves[e.key]);
  }

  return (
    <PopoverField
      label={props.label}
      value={selectedOption()?.label ?? ""}
      popupRole="listbox"
      variant={props.variant}
      name={props.name}
      formValue={value()}
      class={props.class}
      popoverClass="max-h-64 overflow-y-auto"
      triggerRef={(el) => (trigger = el)}
      popoverRef={(el) => (listbox = el)}
      onOpenChange={handleOpenChange}
      onTriggerKeyDown={handleTriggerKeyDown}
      onReset={field.reset}
    >
      <div
        role="listbox"
        aria-label={props.label}
        onKeyDown={handleListboxKeyDown}
      >
        <For each={props.options}>
          {(option) => (
            <button
              type="button"
              role="option"
              aria-selected={option.value === value()}
              onClick={() => choose(option)}
              class={cn(
                popoverItemClass,
                "flex items-center justify-between gap-2 aria-selected:font-medium",
              )}
            >
              <span class="truncate">{option.label}</span>
              {option.value === value() && (
                <CheckIcon
                  aria-hidden="true"
                  class="size-4 shrink-0 text-primary"
                />
              )}
            </button>
          )}
        </For>
      </div>
    </PopoverField>
  );
}
