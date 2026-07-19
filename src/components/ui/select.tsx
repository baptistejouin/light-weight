import { For, type JSX, splitProps } from "solid-js";
import { cn } from "@/lib/utils";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends JSX.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  options: SelectOption[];
  defaultValue?: string;
}

export function Select(props: SelectProps) {
  const [local, rest] = splitProps(props, [
    "name",
    "options",
    "defaultValue",
    "class",
  ]);

  return (
    <div class="flex flex-col">
      <label for={`form-${local.name}`}>{local.name}</label>
      <select
        id={`form-${local.name}`}
        name={local.name}
        class={cn(
          "m-0 rounded-full px-3 py-3 outline outline-primary transition-all focus-within:bg-primary/5 focus-within:outline-primary",
          local.class,
        )}
        value={local.defaultValue}
        {...rest}
      >
        <For each={local.options}>
          {(option) => <option value={option.value}>{option.label}</option>}
        </For>
      </select>
    </div>
  );
}
