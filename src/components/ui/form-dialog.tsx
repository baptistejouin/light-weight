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
  let formRef: HTMLFormElement | undefined;

  function handleClose() {
    submit.reset();
    formRef?.reset();
    props.onClose();
  }

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (formRef) submit.run(new FormData(formRef));
  }

  return (
    <Dialog open={props.open} onClose={handleClose} aria-labelledby={titleId}>
      <form ref={formRef} onSubmit={handleSubmit}>
        <DialogHeader id={titleId} onClose={handleClose}>
          {props.title}
        </DialogHeader>
        <DialogContent class="flex flex-col gap-3">
          {props.children}
          <Show when={submit.error()}>
            {(err) => <ErrorMessage>{err().message}</ErrorMessage>}
          </Show>
        </DialogContent>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submit.pending()}>
            {submit.pending() ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
