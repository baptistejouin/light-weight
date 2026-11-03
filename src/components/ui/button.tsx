import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "md" | "sm";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  children: JSX.Element;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white",
  secondary: "border border-primary bg-white text-primary",
  danger: "bg-red-600 text-white",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "px-6 py-3",
  sm: "flex h-10 items-center gap-1 pr-4 pl-3",
};

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, [
    "children",
    "class",
    "variant",
    "size",
  ]);

  const classes = () =>
    cn(
      "inline cursor-pointer rounded-full capitalize",
      sizeClasses[local.size ?? "md"],
      variantClasses[local.variant ?? "primary"],
      local.class,
    );

  return (
    <button {...rest} class={classes()}>
      {local.children}
    </button>
  );
}
