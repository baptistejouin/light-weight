import { For, type JSX } from "solid-js";
import { QueryBoundary } from "@/components/ui/error-message";

interface CardListProps<T> {
  each: T[] | undefined;
  fallback: string;
  children: (item: T) => JSX.Element;
}

export function CardList<T>(props: CardListProps<T>) {
  return (
    <QueryBoundary>
      <ul class="flex flex-col gap-2">
        <For each={props.each} fallback={<p>{props.fallback}</p>}>
          {(item) => props.children(item)}
        </For>
      </ul>
    </QueryBoundary>
  );
}
