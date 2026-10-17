import {
  createContext,
  createSignal,
  type JSX,
  Show,
  useContext,
} from "solid-js";
import { NewRecordDialog } from "@/components/new-record/new-record-dialog";
import { QueryBoundary } from "@/components/ui/error-message";
import type { RecordKind } from "@/lib/record-kind";

interface NewRecordContextValue {
  open: (kind: RecordKind) => void;
}

const NewRecordContext = createContext<NewRecordContextValue>();

export function NewRecordProvider(props: { children: JSX.Element }) {
  const [kind, setKind] = createSignal<RecordKind | null>(null);

  return (
    <NewRecordContext.Provider value={{ open: setKind }}>
      {props.children}
      <Show when={kind()}>
        {(kind) => (
          <QueryBoundary>
            <NewRecordDialog open kind={kind()} onClose={() => setKind(null)} />
          </QueryBoundary>
        )}
      </Show>
    </NewRecordContext.Provider>
  );
}

export function useNewRecord() {
  const context = useContext(NewRecordContext);
  if (!context)
    throw new Error("useNewRecord must be used in NewRecordProvider");
  return context;
}
