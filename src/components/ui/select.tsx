import { createSignal, For } from "solid-js";
import { CheckIcon, ChevronDownIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

interface SelectOption {
  label: string;
  value: string;
}

type SelectVariant = "outline" | "inline";

const selectVariantClasses: Record<
  SelectVariant,
  { root: string; label?: string; trigger: string; open: string }
> = {
  outline: {
    root: "flex flex-col",
    trigger:
      "justify-between gap-2 rounded-full px-3 py-3 outline outline-primary focus-within:bg-primary/5 focus-within:outline-primary",
    open: "bg-primary/5",
  },
  inline: {
    root: "inline-flex",
    label: "sr-only",
    trigger:
      "-mx-1 gap-0.5 rounded-md px-1 font-semibold text-black outline-none hover:bg-gray-100 focus-visible:bg-gray-100",
    open: "bg-gray-100",
  },
};

interface SelectProps {
  name: string;
  label: string;
  options: SelectOption[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  variant?: SelectVariant;
  class?: string;
}

export function Select(props: SelectProps) {
  const [selected, setSelected] = createSignal(props.defaultValue);
  const [open, setOpen] = createSignal(false);
  let trigger: HTMLButtonElement | undefined;
  let listbox: HTMLDivElement | undefined;

  const variantClasses = () => selectVariantClasses[props.variant ?? "outline"];
  const id = () => `form-${props.name}`;
  const anchorName = () => `--select-${props.name}`;
  const value = () => props.value ?? selected() ?? props.options[0]?.value;
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
    setSelected(option.value);
    props.onChange?.(option.value);
    listbox?.hidePopover();
    trigger?.focus();
  }

  function handleToggle(e: ToggleEvent) {
    const isOpen = e.newState === "open";
    setOpen(isOpen);
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

  const triggerStyle = () => ({ "anchor-name": anchorName() });
  const listboxStyle = () => ({
    "position-anchor": anchorName(),
    top: "anchor(bottom)",
    left: "anchor(left)",
    "min-width": "anchor-size(width)",
    "position-try-fallbacks": "flip-block",
  });

  return (
    <div class={variantClasses().root}>
      <label for={id()} class={variantClasses().label}>
        {props.label}
      </label>
      <input type="hidden" name={props.name} value={value() ?? ""} />
      <button
        ref={trigger}
        id={id()}
        type="button"
        popovertarget={`${id()}-listbox`}
        aria-haspopup="listbox"
        aria-expanded={open()}
        onKeyDown={handleTriggerKeyDown}
        style={triggerStyle()}
        class={cn(
          "m-0 flex cursor-pointer items-center text-left transition-all",
          variantClasses().trigger,
          open() && variantClasses().open,
          props.class,
        )}
      >
        <span class="truncate">{selectedOption()?.label}</span>
        <ChevronDownIcon
          aria-hidden="true"
          class={cn(
            "size-4 shrink-0 transition-transform duration-200",
            open() && "rotate-180",
          )}
        />
      </button>
      <div
        ref={listbox}
        id={`${id()}-listbox`}
        popover="auto"
        role="listbox"
        aria-labelledby={id()}
        onToggle={handleToggle}
        onKeyDown={handleListboxKeyDown}
        style={listboxStyle()}
        class="open:fade-in inset-auto m-0 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-primary/20 bg-white p-1 shadow-lg open:animate-in"
      >
        <For each={props.options}>
          {(option) => (
            <button
              type="button"
              role="option"
              aria-selected={option.value === value()}
              onClick={() => choose(option)}
              class="flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl px-4 py-2 text-left outline-none hover:bg-gray-100 focus-visible:bg-gray-100 aria-selected:font-medium"
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
    </div>
  );
}
