import { type JSX, Show } from "solid-js";

interface CardHeaderProps {
  title: JSX.Element;
  badge?: JSX.Element;
  action?: JSX.Element;
}

export function CardHeader(props: CardHeaderProps) {
  return (
    <div class="flex items-center justify-between">
      <p class="font-semibold">{props.title}</p>
      <div class="flex items-center gap-2">
        <Show when={props.badge}>
          <span class="text-primary text-xs capitalize">{props.badge}</span>
        </Show>
        {props.action}
      </div>
    </div>
  );
}
