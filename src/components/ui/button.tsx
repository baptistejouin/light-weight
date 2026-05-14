import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "~/lib/utils";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  children: JSX.Element;
  variant?: "primary" | "secondary";
}

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ["children", "class", "variant"]);
  return (
    <button
      {...rest}
      class={cn(
        "inline cursor-pointer rounded-full px-6 py-3 capitalize",
        local.variant === "secondary"
          ? "border border-primary bg-white text-primary"
          : "bg-primary text-white",
        local.class,
      )}
    >
      {local.children}
    </button>
  );
}
