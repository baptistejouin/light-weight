import { createAsync, type RouteDefinition } from "@solidjs/router";
import { For } from "solid-js";
import { getRecords, getUser } from "@/api";
import { RecordCard } from "@/components/pages/history/record-card";
import { QueryBoundary } from "@/components/ui/error-message";
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
      <QueryBoundary>
        <ul class="flex flex-col gap-2">
          <For each={records()} fallback={<p>No records yet.</p>}>
            {(record) => <RecordCard record={record} />}
          </For>
        </ul>
      </QueryBoundary>
    </div>
  );
}
