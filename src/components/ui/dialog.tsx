import {
  createEffect,
  createSignal,
  type JSX,
  Show,
  splitProps,
} from "solid-js";
import { CloseIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  preventClose?: boolean;
  children: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

export function DialogRoot(props: DialogProps) {
  let dialogRef!: HTMLDialogElement;
  let closeId = 0;
  const [closing, setClosing] = createSignal(false);
  const mounted = () => props.open || closing();

  createEffect(() => {
    if (props.open) {
      closeId++;
      setClosing(false);
      dialogRef.toggleAttribute("data-closing", false);
      if (!dialogRef.open) dialogRef.showModal();
    } else if (dialogRef.open) {
      animateClose();
    }
  });

  async function animateClose() {
    const id = ++closeId;
    setClosing(true);
    dialogRef.toggleAttribute("data-closing", true);

    const exits = dialogRef
      .getAnimations({ subtree: true })
      .filter((a) => (a.effect as KeyframeEffect | null)?.target === dialogRef);

    await Promise.allSettled(exits.map((a) => a.finished));
    if (id !== closeId) return;

    dialogRef.toggleAttribute("data-closing", false);

    dialogRef.close();
    setClosing(false);
  }

  function handleCancel(e: Event) {
    e.preventDefault();
    if (!props.preventClose) props.onClose();
  }

  // Browsers can skip the cancel event when Esc is pressed repeatedly
  function handleNativeClose() {
    if (!props.open) return;
    if (props.preventClose) dialogRef.showModal();
    else props.onClose();
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === dialogRef && !props.preventClose) props.onClose();
  }

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: dialog support natively escape
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClose={handleNativeClose}
      onClick={handleBackdropClick}
      aria-modal="true"
      aria-label={props["aria-label"]}
      aria-labelledby={props["aria-labelledby"]}
      aria-describedby={props["aria-describedby"]}
      class={props.class}
      style={props.style}
    >
      <Show when={mounted()}>{props.children}</Show>
    </dialog>
  );
}

interface DialogHeaderProps {
  id?: string;
  children: JSX.Element;
  onClose?: () => void;
  closeDisabled?: boolean;
  class?: string;
}

export function DialogHeader(props: DialogHeaderProps) {
  const [local, rest] = splitProps(props, [
    "id",
    "children",
    "onClose",
    "closeDisabled",
    "class",
  ]);
  return (
    <div
      {...rest}
      class={cn(
        "flex items-center justify-between px-5 pt-5 pb-3",
        local.class,
      )}
    >
      <h2 id={local.id} class="font-semibold text-2xl">
        {local.children}
      </h2>
      {local.onClose && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={local.onClose}
          disabled={local.closeDisabled}
          aria-label="Close dialog"
          class="-mr-1"
        >
          <CloseIcon aria-hidden="true" class="size-4.5" />
        </Button>
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
