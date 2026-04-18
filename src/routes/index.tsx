import { Temporal } from "@js-temporal/polyfill";
import type { RouteDefinition } from "@solidjs/router";
import { getUser, logout } from "~/api";
import { CalendarIcon } from "~/components/icons/icon-calendar";
import WeightIcon from "~/components/icons/kilo-icon";
import { Layout } from "~/components/layout";
import { Calendar } from "~/components/pages/index/calendar";
import { Button } from "~/components/ui/button";

export const route = {
  preload() {
    return getUser();
  },
} satisfies RouteDefinition;

export default function Home() {
  const today = Temporal.Now.plainDateISO();
  const activityHistoryFake = [
    today.subtract({ days: 3 }),
    today.subtract({ days: 5 }),
    today.subtract({ days: 5 }),
    today.subtract({ days: 5 }),
  ];

  return (
    <div class="mb-12 flex-1 flex flex-col gap-6">
      <div>
        <h2 class="font-bold text-2xl capitalize border-b pb-2 mb-4 border-gray-200">
          <span
            class="text-5xl
    text-green-500"
          >
            12
          </span>{" "}
          session this Month
        </h2>
        <h3 class="font-bold text-2xl text-gray-400 mb-4">
          The last session was
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
      <div class="justify-end gap-2 flex flex-1 flex-col">
        <Button class="w-full" name="logout" type="submit">
          New Record
        </Button>
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
