import { For, type JSX } from "solid-js";
import { QueryBoundary } from "@/components/ui/error-message";
import { cn } from "@/lib/utils";

interface CardListProps<T> {
  each: T[] | undefined;
  fallback: string;
  children: (item: T) => JSX.Element;
  class?: string;
}

export function CardList<T>(props: CardListProps<T>) {
  return (
    <QueryBoundary>
      <ul class={cn("flex flex-col gap-2", props.class)}>
        <For each={props.each} fallback={<p>{props.fallback}</p>}>
          {(item) => props.children(item)}
        </For>
      </ul>
    </QueryBoundary>
  );
}
