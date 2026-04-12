import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { cn } from "~/lib/utils";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  children: JSX.Element;
}

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ["children", "class"]);
  return (
    <button
      {...rest}
      class={cn(
        local.class,
        "cursor-pointer bg-blue-400 hover:cursor-pointer h-8 px-2 py-1 text-black",
      )}
    >
      {local.children}
    </button>
  );
}
