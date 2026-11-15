import { createUniqueId, type JSX, Show } from "solid-js";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { DrawerDialog } from "@/components/ui/drawer-dialog";
import { ErrorMessage } from "@/components/ui/error-message";
import { createPendingAction } from "@/lib/pending-action";

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  // Return an Error to display it and keep the dialog open
  onSubmit: (formData: FormData) => Promise<unknown> | unknown;
  children: JSX.Element;
}

export function FormDialog(props: FormDialogProps) {
  const titleId = createUniqueId();
  const submit = createPendingAction(
    (formData: FormData) => props.onSubmit(formData),
    handleClose,
  );

  function handleClose() {
    if (submit.pending()) return;
    submit.reset();
    props.onClose();
  }

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    submit.run(new FormData(e.currentTarget as HTMLFormElement));
  }

  return (
    <DrawerDialog
      open={props.open}
      onClose={handleClose}
      preventClose={submit.pending()}
      aria-labelledby={titleId}
    >
      <form onSubmit={handleSubmit} class="flex min-h-full flex-col">
        <DialogHeader
          id={titleId}
          onClose={handleClose}
          closeDisabled={submit.pending()}
        >
          {props.title}
        </DialogHeader>
        <DialogContent class="flex flex-1 flex-col gap-3">
          {props.children}
          <Show when={submit.error()}>
            {(err) => <ErrorMessage>{err().message}</ErrorMessage>}
          </Show>
        </DialogContent>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            disabled={submit.pending()}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submit.pending()}>
            {submit.pending() ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </form>
    </DrawerDialog>
  );
}
