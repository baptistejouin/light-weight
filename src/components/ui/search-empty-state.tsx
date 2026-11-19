import { Show } from "solid-js";
import { SearchIcon } from "@/components/icons";

interface SearchEmptyStateProps {
  searchTerm: string;
  emptyLabel: string;
}

export function SearchEmptyState(props: SearchEmptyStateProps) {
  return (
    <div class="flex flex-col items-center gap-2 py-12 text-center text-black/60">
      <SearchIcon aria-hidden="true" class="size-8 text-black/30" />
      <Show when={props.searchTerm} fallback={<p>{props.emptyLabel}</p>}>
        <p class="font-medium text-black">
          No results for "{props.searchTerm}"
        </p>
        <p class="text-sm">Try a different name.</p>
      </Show>
    </div>
  );
}
