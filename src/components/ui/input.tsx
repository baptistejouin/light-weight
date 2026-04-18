import { type JSX, splitProps } from "solid-js";
import { cn } from "~/lib/utils";

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  defaultValue?: string | number;
  children?: JSX.Element;
}
export function Input(props: InputProps) {
  const [local, rest] = splitProps(props, [
    "children",
    "name",
    "defaultValue",
    "class",
  ]);
  return (
    <div class="flex flex-col">
      <label for={`form-${local.name}`}>{local.name}</label>
      <input
        id={`form-${local.name}`}
        name={local.name}
        class={cn(
          "rounded-full py-3 px-3 outline outline-primary focus-within:bg-primary/5 m-0 focus-within:outline-primary transition-all",
          local.class,
        )}
        value={local.defaultValue || ""}
        {...rest}
      />
    </div>
  );
}
