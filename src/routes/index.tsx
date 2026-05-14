import { Temporal } from "@js-temporal/polyfill";
import type { RouteDefinition } from "@solidjs/router";
import { createSignal } from "solid-js";
import { getUser, logout } from "~/api";
import { CalendarIcon } from "~/components/icons/icon-calendar";
import WeightIcon from "~/components/icons/kilo-icon";
import { Calendar } from "~/components/pages/index/calendar";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "~/components/ui/dialog";
import { SegmentedControl } from "~/components/ui/segmented-control";

export const route = {
  preload() {
    return getUser();
  },
} satisfies RouteDefinition;

export default function Home() {
  const timeScaleValues = [
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
    { label: "Year", value: "year" },
    { label: "All", value: "all" },
  ];
  const today = Temporal.Now.plainDateISO();

  const [timeScale, setTimeScale] = createSignal("month");
  const [dialogOpen, setDialogOpen] = createSignal(false);

  const activityHistoryFake = [
    today.subtract({ days: 3 }),
    today.subtract({ days: 5 }),
    today.subtract({ days: 5 }),
    today.subtract({ days: 5 }),
  ];

  return (
    <div class="mb-12 flex flex-1 flex-col gap-6">
      <div class="flex flex-col gap-2">
        <h2 class="pb-2 font-bold text-5xl capitalize">Activities</h2>
        <SegmentedControl
          items={timeScaleValues}
          value={timeScale()}
          onChange={setTimeScale}
        />
        <h3 class="mt-6 font-bold text-2xl text-gray-400">
          Your last workout was
          <span class="text-black">
            {" "}
            <WeightIcon /> Leg day
          </span>
          , and it was
          <span class="text-black">
            {" "}
            <CalendarIcon /> 3 days ago
          </span>
          .
        </h3>
        <Calendar activityHistory={activityHistoryFake} />
      </div>
      <div class="flex flex-1 flex-col justify-end gap-2">
        <Button
          class="w-full"
          type="button"
          onClick={() => setDialogOpen(true)}
        >
          New Record
        </Button>
        <Dialog
          open={dialogOpen()}
          onClose={() => setDialogOpen(false)}
          aria-labelledby="dialog-title"
        >
          <DialogHeader onClose={() => setDialogOpen(false)}>
            New Record
          </DialogHeader>
          <DialogContent>Log a new workout activity for today.</DialogContent>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setDialogOpen(false)}>Save</Button>
          </DialogFooter>
        </Dialog>
        <Button
          class="w-full"
          name="logout"
          type="submit"
          variant="secondary"
          onClick={logout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
