import { createAsync, type RouteDefinition, useAction } from "@solidjs/router";
import { createSignal, ErrorBoundary } from "solid-js";
import { getExercises, getRecords, getUser, getWorkouts, logout } from "@/api";
import { Calendar } from "@/components/pages/index/calendar";
import { HeaderSummary } from "@/components/pages/index/header-summary";
import { NewRecordDialog } from "@/components/pages/index/new-record-dialog";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { toPlainDate } from "@/lib/date";

export const route = {
  preload() {
    getUser();
    getExercises();
    getWorkouts();
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
  const [dialogOpen, setDialogOpen] = createSignal(false);

  const exercises = createAsync(() => getExercises(), { initialValue: [] });
  const workouts = createAsync(() => getWorkouts(), { initialValue: [] });
  const records = createAsync(() => getRecords(), { initialValue: [] });

  const activityHistory = () =>
    records().map((r) => toPlainDate(new Date(r.performedAt)));

  const doLogout = useAction(logout);

  return (
    <div class="mb-12 flex flex-1 flex-col gap-6">
      <div class="flex flex-col gap-2">
        <h2 class="pb-2 font-bold text-5xl capitalize">Activities</h2>
        <SegmentedControl
          items={timeScaleValues}
          value={timeScale()}
          onChange={setTimeScale}
        />
        <HeaderSummary />
        <Calendar activityHistory={activityHistory()} />
      </div>
      <div class="flex flex-1 flex-col justify-end gap-2">
        <Button
          class="w-full"
          type="button"
          onClick={() => setDialogOpen(true)}
        >
          New Record
        </Button>
        <ErrorBoundary fallback={<p>Could not load options.</p>}>
          <NewRecordDialog
            open={dialogOpen()}
            onClose={() => setDialogOpen(false)}
            exercises={exercises()}
            workouts={workouts()}
          />
        </ErrorBoundary>
        <Button
          class="w-full"
          name="logout"
          type="button"
          variant="secondary"
          onClick={() => doLogout()}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
