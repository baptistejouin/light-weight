import { type JSX, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { cn } from "@/lib/utils";

interface CardProps {
  as?: "div" | "li";
  class?: string;
  children: JSX.Element;
}

export function Card(props: CardProps) {
  return (
    <Dynamic
      component={props.as ?? "div"}
      class={cn("rounded-2xl border border-primary/20 p-4", props.class)}
    >
      {props.children}
    </Dynamic>
  );
}

interface CardHeaderProps {
  title: JSX.Element;
  badge?: JSX.Element;
}

export function CardHeader(props: CardHeaderProps) {
  return (
    <div class="flex items-center justify-between">
      <p class="font-semibold">{props.title}</p>
      <Show when={props.badge}>
        <span class="text-primary text-xs capitalize">{props.badge}</span>
      </Show>
    </div>
  );
}
