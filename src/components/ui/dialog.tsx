import { createEffect, type JSX, splitProps } from "solid-js";
import { cn } from "~/lib/utils";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: JSX.Element;
  class?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

export function Dialog(props: DialogProps) {
  let ref: HTMLDialogElement | undefined;

  createEffect(() => {
    if (props.open) {
      ref?.showModal();
    } else {
      ref?.close();
    }
  });

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === ref) props.onClose();
  }

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: dialog support natively escape
    <dialog
      ref={ref}
      onClose={props.onClose}
      onClick={handleBackdropClick}
      aria-modal="true"
      aria-label={props["aria-label"]}
      aria-labelledby={props["aria-labelledby"]}
      aria-describedby={props["aria-describedby"]}
      class={cn(
        "w-full max-w-sm rounded-2xl p-0 shadow-xl",
        "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        "backdrop:bg-black/40 backdrop:backdrop-blur-sm",
        "open:fade-in open:slide-in-from-bottom-4 open:animate-in",
        props.class,
      )}
    >
      {props.children}
    </dialog>
  );
}

interface DialogHeaderProps {
  children: JSX.Element;
  onClose?: () => void;
  class?: string;
}

export function DialogHeader(props: DialogHeaderProps) {
  const [local, rest] = splitProps(props, ["children", "onClose", "class"]);
  return (
    <div
      {...rest}
      class={cn(
        "flex items-center justify-between px-5 pt-5 pb-3",
        local.class,
      )}
    >
      <h2 id="dialog-title" class="font-semibold text-base">
        {local.children}
      </h2>
      {local.onClose && (
        <button
          type="button"
          onClick={local.onClose}
          aria-label="Close dialog"
          class="-mr-1 cursor-pointer rounded-full p-1 transition-colors hover:bg-black/5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}

interface DialogContentProps {
  children: JSX.Element;
  class?: string;
}

export function DialogContent(props: DialogContentProps) {
  return (
    <div class={cn("px-5 py-2 text-black/70 text-sm", props.class)}>
      {props.children}
    </div>
  );
}

interface DialogFooterProps {
  children: JSX.Element;
  class?: string;
}

export function DialogFooter(props: DialogFooterProps) {
  return (
    <div class={cn("flex justify-end gap-2 px-5 pt-3 pb-5", props.class)}>
      {props.children}
    </div>
  );
}
