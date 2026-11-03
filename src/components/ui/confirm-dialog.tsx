import { createUniqueId, type JSX, Show } from "solid-js";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { ErrorMessage } from "@/components/ui/error-message";
import { createPendingAction } from "@/lib/pending-action";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  confirmLabel: string;
  pendingLabel: string;
  // Return an Error to display it and keep the dialog open
  onConfirm: () => Promise<unknown> | unknown;
  children: JSX.Element;
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  const titleId = createUniqueId();
  const descriptionId = createUniqueId();
  const confirm = createPendingAction(() => props.onConfirm(), handleClose);

  function handleClose() {
    confirm.reset();
    props.onClose();
  }

  const handleConfirm = () => confirm.run();

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <DialogHeader id={titleId} onClose={handleClose}>
        {props.title}
      </DialogHeader>
      <DialogContent class="flex flex-col gap-3">
        <p id={descriptionId}>{props.children}</p>
        <Show when={confirm.error()}>
          {(err) => <ErrorMessage>{err().message}</ErrorMessage>}
        </Show>
      </DialogContent>
      <DialogFooter>
        <Button type="button" variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="danger"
          disabled={confirm.pending()}
          onClick={handleConfirm}
        >
          {confirm.pending() ? props.pendingLabel : props.confirmLabel}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
