import { createContext, createSignal, type JSX, useContext } from "solid-js";
import { NewRecordDialog } from "@/components/new-record/new-record-dialog";
import type { RecordKind } from "@/lib/record-kind";

interface NewRecordContextValue {
  open: (kind: RecordKind) => void;
}

const NewRecordContext = createContext<NewRecordContextValue>();

export function NewRecordProvider(props: { children: JSX.Element }) {
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [kind, setKind] = createSignal<RecordKind>("activity");

  function openDialog(nextKind: RecordKind) {
    setKind(nextKind);
    setDialogOpen(true);
  }

  const handleClose = () => setDialogOpen(false);

  return (
    <NewRecordContext.Provider value={{ open: openDialog }}>
      {props.children}
      <NewRecordDialog
        open={dialogOpen()}
        kind={kind()}
        onClose={handleClose}
      />
    </NewRecordContext.Provider>
  );
}

export function useNewRecord() {
  const context = useContext(NewRecordContext);
  if (!context)
    throw new Error("useNewRecord must be used in NewRecordProvider");
  return context;
}
