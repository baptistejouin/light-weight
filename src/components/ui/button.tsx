import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "@/lib/utils";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  children: JSX.Element;
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
}

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, [
    "children",
    "class",
    "variant",
    "size",
  ]);
  return (
    <button
      {...rest}
      class={cn(
        "inline cursor-pointer rounded-full capitalize",
        local.size === "sm"
          ? "flex h-10 items-center gap-1 pr-4 pl-3"
          : "px-6 py-3",
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
