import { createAsync, type RouteDefinition } from "@solidjs/router";
import { getRecords, getUser } from "@/api";
import { RecordCard } from "@/components/pages/history/record-card";
import { CardList } from "@/components/ui/card-list";
import { PageHeader } from "@/components/ui/page-header";

export const route = {
  preload() {
    getUser();
    getRecords();
  },
} satisfies RouteDefinition;

export default function HistoryPage() {
  const records = createAsync(() => getRecords());

  return (
    <div class="flex flex-1 flex-col gap-4">
      <PageHeader title="History" />
      <CardList each={records()} fallback="No records yet.">
        {(record) => <RecordCard record={record} />}
      </CardList>
    </div>
  );
}
