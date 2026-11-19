import { type JSX, Show, splitProps } from "solid-js";
import { CloseIcon, SearchIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchFieldProps
  extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "value"> {
  value: string;
  onValueChange: (value: string) => void;
  label: string;
}

export function SearchField(props: SearchFieldProps) {
  const [local, rest] = splitProps(props, [
    "value",
    "onValueChange",
    "label",
    "class",
  ]);
  let inputRef!: HTMLInputElement;

  const handleInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) =>
    local.onValueChange(e.currentTarget.value);

  function handleClear() {
    local.onValueChange("");
    inputRef.focus();
  }

  return (
    <div class={cn("relative flex-1", local.class)}>
      <SearchIcon
        aria-hidden="true"
        class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400"
      />
      <Input
        ref={inputRef}
        type="search"
        name="search"
        label={local.label}
        hideLabel
        value={local.value}
        onInput={handleInput}
        class="w-full pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden"
        {...rest}
      />
      <Show when={local.value}>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Clear search"
          onClick={handleClear}
          class="absolute top-1/2 right-1.5 -translate-y-1/2 text-gray-400 enabled:hover:text-gray-600"
        >
          <CloseIcon aria-hidden="true" class="size-4" />
        </Button>
      </Show>
    </div>
  );
}
