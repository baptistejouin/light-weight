import {
  createEffect,
  createSignal,
  For,
  type JSX,
  onCleanup,
  Show,
} from "solid-js";
import { cn } from "@/lib/utils";

interface MenuItem {
  label: string;
  onSelect: () => void;
}

export interface MenuTriggerProps {
  type: "button";
  "aria-haspopup": "menu";
  "aria-expanded": boolean;
  onClick: () => void;
}

interface MenuProps {
  items: MenuItem[];
  placement?: "bottom-start" | "bottom-end" | "top";
  class?: string;
  trigger: (props: MenuTriggerProps) => JSX.Element;
}

export function Menu(props: MenuProps) {
  const [open, setOpen] = createSignal(false);
  let ref: HTMLDivElement | undefined;

  const triggerProps: MenuTriggerProps = {
    type: "button",
    "aria-haspopup": "menu",
    get "aria-expanded"() {
      return open();
    },
    onClick: () => setOpen((v) => !v),
  };

  createEffect(() => {
    if (!open()) return;

    const onClick = (e: MouseEvent) => {
      if (ref && !ref.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);
    onCleanup(() => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
    });
  });

  return (
    <div ref={ref} class={cn("relative", props.class)}>
      {props.trigger(triggerProps)}
      <Show when={open()}>
        <div
          role="menu"
          class={cn(
            "absolute z-10 min-w-40 rounded-2xl border border-primary/20 bg-white p-1 shadow-lg",
            {
              "right-0 bottom-full left-0 mb-2": props.placement === "top",
              "top-full left-0 mt-2": props.placement === "bottom-start",
              "top-full right-0 mt-2":
                !props.placement || props.placement === "bottom-end",
            },
          )}
        >
          <For each={props.items}>
            {(item) => (
              <button
                type="button"
                role="menuitem"
                class="w-full cursor-pointer rounded-xl px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => {
                  setOpen(false);
                  item.onSelect();
                }}
              >
                {item.label}
              </button>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
