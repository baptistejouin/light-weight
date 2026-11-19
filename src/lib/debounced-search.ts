import { createSignal, onCleanup, useTransition } from "solid-js";

export function createDebouncedSearch(delayMs = 200) {
  const [query, setQueryValue] = createSignal("");
  const [searchTerm, setSearchTerm] = createSignal("");
  const [, startTransition] = useTransition();

  let timer: ReturnType<typeof setTimeout> | undefined;
  onCleanup(() => clearTimeout(timer));

  function setQuery(value: string) {
    setQueryValue(value);
    clearTimeout(timer);
    timer = setTimeout(
      () => startTransition(() => setSearchTerm(value.trim())),
      delayMs,
    );
  }

  return { query, searchTerm, setQuery };
}

export function filterByName<T extends { name: string }>(
  items: T[] | undefined,
  term: string,
) {
  const search = term.trim().toLowerCase();
  return items?.filter((item) => item.name.toLowerCase().includes(search));
}
