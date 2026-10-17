import type { ComponentProps } from "solid-js";
import { useNewRecord } from "@/components/new-record/context";
import { Menu } from "@/components/ui/menu";
import { type RecordKind, recordKindLabel } from "@/lib/record-kind";

type NewRecordMenuProps = Omit<ComponentProps<typeof Menu>, "items">;

const kinds: RecordKind[] = ["activity", "workout"];

export function NewRecordMenu(props: NewRecordMenuProps) {
  const newRecord = useNewRecord();

  return (
    <Menu
      {...props}
      items={kinds.map((kind) => ({
        label: recordKindLabel[kind],
        onSelect: () => newRecord.open(kind),
      }))}
    />
  );
}
