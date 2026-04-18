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
        "capitalize cursor-pointer px-6 inline py-3 rounded-full",
        local.variant === "secondary"
          ? "bg-white border border-primary text-primary"
          : "bg-primary text-white",
        local.class,
      )}
    >
      {local.children}
    </button>
  );
}
