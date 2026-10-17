import { createAsync, type RouteDefinition } from "@solidjs/router";
import { createSignal } from "solid-js";
import { getRecords, getUser } from "@/api";
import { Calendar } from "@/components/pages/index/calendar";
import { HeaderSummary } from "@/components/pages/index/header-summary";
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
    <div class="flex flex-1 flex-col gap-6">
      <div class="flex flex-col gap-4">
        <PageHeader title="Activities" />
        <SegmentedControl
          items={timeScaleValues}
          value={timeScale()}
          onChange={setTimeScale}
        />
      </div>
      <HeaderSummary lastRecord={lastRecord()} />
      <Calendar activityHistory={activityHistory()} />
    </div>
  );
}
