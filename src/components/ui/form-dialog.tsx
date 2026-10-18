import { createSignal, type JSX, Show } from "solid-js";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { ErrorMessage } from "@/components/ui/error-message";

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  // Return an Error to display it and keep the dialog open
  onSubmit: (formData: FormData) => Promise<unknown> | unknown;
  children: JSX.Element;
}

export function FormDialog(props: FormDialogProps) {
  const [error, setError] = createSignal<Error | null>(null);
  const [pending, setPending] = createSignal(false);
  let formRef: HTMLFormElement | undefined;

  function handleClose() {
    setError(null);
    formRef?.reset();
    props.onClose();
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!formRef) return;

    setPending(true);
    try {
      const result = await props.onSubmit(new FormData(formRef));
      if (result instanceof Error) {
        setError(result);
        return;
      }
    } finally {
      setPending(false);
    }

    handleClose();
  }

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby="dialog-title"
    >
      <form ref={formRef} onSubmit={handleSubmit}>
        <DialogHeader onClose={handleClose}>{props.title}</DialogHeader>
        <DialogContent class="flex flex-col gap-3">
          {props.children}
          <Show when={error()}>
            {(err) => <ErrorMessage>{err().message}</ErrorMessage>}
          </Show>
        </DialogContent>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={pending()}>
            {pending() ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
