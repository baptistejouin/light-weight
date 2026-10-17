import { createAsync, type RouteDefinition } from "@solidjs/router";
import { createSignal } from "solid-js";
import { getRecords, getUser } from "@/api";
import { NewRecordMenu } from "@/components/new-record/new-record-menu";
import { Calendar } from "@/components/pages/index/calendar";
import { HeaderSummary } from "@/components/pages/index/header-summary";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { toPlainDate } from "@/lib/date";

export const route = {
  preload() {
    getUser();
    getRecords();
  },
} satisfies RouteDefinition;

const timeScaleValues = [
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
  { label: "All", value: "all" },
];

export default function Home() {
  const [timeScale, setTimeScale] = createSignal("month");

  // undefined when getRecords redirects (no valid session)
  const records = createAsync(() => getRecords());

  const activityHistory = () => {
    const list = records();
    if (!list) return [];
    return list.map((r) => toPlainDate(new Date(r.performedAt)));
  };

  const lastRecord = () => {
    const list = records();
    if (!list) return undefined;
    return list[0];
  };

  return (
    <div class="mb-6 flex flex-1 flex-col gap-2">
      <PageHeader title="Activities" class="pb-2" />
      <SegmentedControl
        items={timeScaleValues}
        value={timeScale()}
        onChange={setTimeScale}
      />
      <HeaderSummary lastRecord={lastRecord()} />
      <Calendar activityHistory={activityHistory()} />
      <NewRecordMenu
        class="mt-4"
        placement="top"
        trigger={(props) => (
          <Button {...props} class="w-full">
            New Record
          </Button>
        )}
      />
    </div>
  );
}
