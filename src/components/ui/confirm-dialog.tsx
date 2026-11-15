import { createUniqueId, type JSX, Show } from "solid-js";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { ErrorMessage } from "@/components/ui/error-message";
import { ModalDialog } from "@/components/ui/modal-dialog";
import { createPendingAction } from "@/lib/pending-action";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  confirmLabel: string;
  pendingLabel: string;
  // Return an Error to display it and keep the dialog open
  onConfirm: () => unknown;
  children: JSX.Element;
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  const titleId = createUniqueId();
  const descriptionId = createUniqueId();
  const confirm = createPendingAction(() => props.onConfirm(), handleClose);

  function handleClose() {
    if (confirm.pending()) return;
    confirm.reset();
    props.onClose();
  }

  const handleConfirm = () => confirm.run();

  return (
    <ModalDialog
      open={props.open}
      onClose={handleClose}
      preventClose={confirm.pending()}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <DialogHeader
        id={titleId}
        onClose={handleClose}
        closeDisabled={confirm.pending()}
      >
        {props.title}
      </DialogHeader>
      <DialogContent class="flex flex-col gap-3">
        <p id={descriptionId}>{props.children}</p>
        <Show when={confirm.error()}>
          {(err) => <ErrorMessage>{err().message}</ErrorMessage>}
        </Show>
      </DialogContent>
      <DialogFooter>
        <Button
          type="button"
          variant="secondary"
          disabled={confirm.pending()}
          onClick={handleClose}
        >
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
    </ModalDialog>
  );
}
