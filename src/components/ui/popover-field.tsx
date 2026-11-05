import {
  createSignal,
  createUniqueId,
  type JSX,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import { ChevronDownIcon } from "@/components/icons";
import { popoverSurfaceClass } from "@/components/ui/popover-styles";
import { cn } from "@/lib/utils";

export type PopoverFieldVariant = "outline" | "inline" | "compact";

const variantClasses: Record<
  PopoverFieldVariant,
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
  compact: {
    root: "inline-flex",
    label: "sr-only",
    trigger: "gap-1 rounded-full px-2 py-1 text-xs outline outline-primary/50",
    open: "bg-primary/5",
  },
};

interface PopoverFieldProps {
  label: string;
  value: string;
  popupRole: "listbox" | "dialog";
  variant?: PopoverFieldVariant;
  name?: string;
  formValue?: string | number;
  lazy?: boolean;
  class?: string;
  popoverClass?: string;
  triggerRef?: (el: HTMLButtonElement) => void;
  popoverRef?: (el: HTMLDivElement) => void;
  onOpenChange?: (open: boolean) => void;
  onTriggerKeyDown?: (e: KeyboardEvent) => void;
  onReset?: () => void;
  children: JSX.Element;
}

export function PopoverField(props: PopoverFieldProps) {
  const labelId = createUniqueId();
  const triggerId = createUniqueId();
  const valueId = createUniqueId();
  const popoverId = createUniqueId();
  const anchorName = `--popover-field-${popoverId}`;
  const [open, setOpen] = createSignal(false);
  let root: HTMLDivElement | undefined;
  let popover: HTMLDivElement | undefined;

  const classes = () => variantClasses[props.variant ?? "outline"];
  const showContent = () => !props.lazy || open();

  function setPopover(el: HTMLDivElement) {
    popover = el;
    props.popoverRef?.(el);
  }

  function handleToggle(e: ToggleEvent) {
    const isOpen = e.newState === "open";
    setOpen(isOpen);
    props.onOpenChange?.(isOpen);
  }

  onMount(() => {
    const form = root?.closest("form");
    if (!form) return;
    const handleReset = () => {
      props.onReset?.();
      popover?.hidePopover();
    };
    form.addEventListener("reset", handleReset);
    onCleanup(() => form.removeEventListener("reset", handleReset));
  });

  const triggerStyle = { "anchor-name": anchorName };
  const popoverStyle = {
    "position-anchor": anchorName,
    top: "anchor(bottom)",
    left: "anchor(left)",
    "min-width": "anchor-size(width)",
    "position-try-fallbacks": "flip-block, flip-inline",
  };

  return (
    <div ref={root} class={classes().root}>
      <label id={labelId} for={triggerId} class={classes().label}>
        {props.label}
      </label>
      <Show when={props.name}>
        {(name) => (
          <input type="hidden" name={name()} value={props.formValue ?? ""} />
        )}
      </Show>
      <button
        ref={props.triggerRef}
        id={triggerId}
        type="button"
        popovertarget={popoverId}
        aria-haspopup={props.popupRole}
        aria-expanded={open()}
        aria-labelledby={`${labelId} ${valueId}`}
        onKeyDown={props.onTriggerKeyDown}
        style={triggerStyle}
        class={cn(
          "m-0 flex cursor-pointer items-center text-left transition-all",
          classes().trigger,
          open() && classes().open,
          props.class,
        )}
      >
        <span id={valueId} class="truncate tabular-nums">
          {props.value}
        </span>
        <ChevronDownIcon
          aria-hidden="true"
          class={cn(
            "size-4 shrink-0 transition-transform duration-200",
            open() && "rotate-180",
          )}
        />
      </button>
      <div
        ref={setPopover}
        id={popoverId}
        popover="auto"
        onToggle={handleToggle}
        style={popoverStyle}
        class={cn(
          "open:fade-in inset-auto m-0 mt-2 open:animate-in",
          popoverSurfaceClass,
          props.popoverClass,
        )}
      >
        <Show when={showContent()}>{props.children}</Show>
      </div>
    </div>
  );
}
