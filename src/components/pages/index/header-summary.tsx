import { CalendarIcon, WeightIcon } from "@/components/icons";
export function HeaderSummary() {
  return (
    <div>
      {" "}
      <h3 class="mt-6 font-bold text-2xl">
        <span class="text-gray-400">Your last workout was </span>
        <span class="text-black">
          <WeightIcon /> Leg day
        </span>
        <span class="text-gray-400">, and it was </span>
        <span class="text-black">
          <CalendarIcon /> 3 days ago
        </span>
      </h3>
    </div>
  );
}
