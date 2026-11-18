import { useAction } from "@solidjs/router";
import { createSignal } from "solid-js";
import { deleteRecord } from "@/api";
import type { WorkoutRecord } from "@/api/types";
import { RecordRow } from "@/components/pages/index/record-row";
import { CardList } from "@/components/ui/card-list";
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
      <CardList each={props.records} class="mt-4">
        {(record) => <RecordRow record={record} onDelete={setRecordToDelete} />}
      </CardList>
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
