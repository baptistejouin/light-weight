import { useAction } from "@solidjs/router";
import { createSignal, For, Show } from "solid-js";
import { deleteRecord } from "@/api";
import type { WorkoutRecord } from "@/api/types";
import { RecordRow } from "@/components/pages/index/record-row";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { recordName } from "@/lib/format";

interface RecordListProps {
  records: WorkoutRecord[];
}

export function RecordList(props: RecordListProps) {
  const removeRecord = useAction(deleteRecord);
  const [recordToDelete, setRecordToDelete] = createSignal<WorkoutRecord>();

  const recordToDeleteName = () => {
    const record = recordToDelete();
    return record ? recordName(record) : "";
  };

  const handleClose = () => setRecordToDelete(undefined);

  function handleConfirmDelete() {
    const record = recordToDelete();
    if (record) return removeRecord(record.id);
  }

  return (
    <>
      <Show when={props.records.length > 0}>
        <ul class="-mx-4 mt-4 divide-y divide-gray-200">
          <For each={props.records}>
            {(record) => (
              <RecordRow record={record} onDelete={setRecordToDelete} />
            )}
          </For>
        </ul>
      </Show>
      <ConfirmDialog
        open={!!recordToDelete()}
        onClose={handleClose}
        title="Delete record?"
        confirmLabel="Delete"
        pendingLabel="Deleting..."
        onConfirm={handleConfirmDelete}
      >
        "{recordToDeleteName()}" will be permanently removed from your history.
      </ConfirmDialog>
    </>
  );
}
