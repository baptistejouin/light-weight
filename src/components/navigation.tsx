import { useLocation } from "@solidjs/router";
import { For } from "solid-js";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home" },
  { href: "/history", label: "History" },
  { href: "/exercise", label: "Exercise" },
  { href: "/workouts", label: "Workouts" },
];

export default function Navigation() {
  const location = useLocation();

  return (
    <nav class="sticky bottom-0 -mx-4 mt-auto border-primary/10 border-t bg-white pb-[env(safe-area-inset-bottom)]">
      <ul class="flex">
        <For each={items}>
          {(item) => (
            <li class="flex-1">
              <a
                href={item.href}
                class={cn(
                  "flex justify-center py-4 text-sm transition-colors",
                  item.href === location.pathname
                    ? "font-semibold text-primary"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                {item.label}
              </a>
            </li>
          )}
        </For>
      </ul>
    </nav>
  );
}
