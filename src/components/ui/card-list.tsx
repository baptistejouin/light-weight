import { For, type JSX, Show } from "solid-js";
import { cn } from "@/lib/utils";

interface CardListProps<T> {
  each: T[] | undefined;
  fallback?: JSX.Element;
  children: (item: T) => JSX.Element;
  class?: string;
}

export function CardList<T>(props: CardListProps<T>) {
  return (
    <Show when={props.each?.length !== 0} fallback={props.fallback}>
      <ul class={cn("-mx-4 divide-y divide-gray-200", props.class)}>
        <For each={props.each}>{(item) => props.children(item)}</For>
      </ul>
    </Show>
  );
}
