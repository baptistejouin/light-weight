import { type RouteDefinition, useSearchParams } from "@solidjs/router";
import { Match, Switch } from "solid-js";
import {
  getExercises,
  getOrCreateRestExercise,
  getUser,
  getWorkouts,
} from "@/api";
import { ExercisesTab } from "@/components/pages/library/exercises-tab";
import { WorkoutsTab } from "@/components/pages/library/workouts-tab";
import { PageHeader } from "@/components/ui/page-header";
import { SegmentedControl } from "@/components/ui/segmented-control";

export const route = {
  preload() {
    getUser();
    getWorkouts();
    getExercises();
    getOrCreateRestExercise();
  },
} satisfies RouteDefinition;

type LibraryTab = "workouts" | "exercises";

const tabs: { label: string; value: LibraryTab }[] = [
  { label: "Workouts", value: "workouts" },
  { label: "Exercises", value: "exercises" },
];

export default function LibraryPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const tab = (): LibraryTab =>
    searchParams.tab === "exercises" ? "exercises" : "workouts";

  const handleTabChange = (value: LibraryTab) =>
    setSearchParams({ tab: value }, { replace: true });

  return (
    <div class="flex flex-1 flex-col gap-4">
      <PageHeader title="Library" />
      <SegmentedControl items={tabs} value={tab()} onChange={handleTabChange} />
      <Switch>
        <Match when={tab() === "workouts"}>
          <WorkoutsTab />
        </Match>
        <Match when={tab() === "exercises"}>
          <ExercisesTab />
        </Match>
      </Switch>
    </div>
  );
}
