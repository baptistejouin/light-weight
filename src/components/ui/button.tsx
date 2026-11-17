import type { JSX } from "solid-js";
import { Show, splitProps } from "solid-js";
import { DashedOutline } from "@/components/ui/dashed-outline";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "danger" | "dashed" | "ghost";
type ButtonSize = "md" | "sm" | "icon" | "icon-sm";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  children: JSX.Element;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-black text-white enabled:hover:bg-black/85",
  secondary: "bg-gray-100 text-black enabled:hover:bg-gray-200",
  danger: "bg-red-600 text-white enabled:hover:bg-red-700",
  dashed:
    "relative gap-1.5 rounded-xl text-gray-500 enabled:hover:bg-gray-50 enabled:hover:text-black",
  ghost: "enabled:hover:bg-black/5",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "h-10 px-5",
  sm: "h-8 gap-1 px-3",
  icon: "size-10 shrink-0",
  "icon-sm": "size-7 shrink-0 rounded-full",
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
      "inline-flex cursor-pointer items-center justify-center rounded-lg font-medium text-sm capitalize transition-colors disabled:cursor-not-allowed disabled:opacity-50",
      sizeClasses[local.size ?? "md"],
      variantClasses[local.variant ?? "primary"],
      local.class,
    );

  return (
    <button {...rest} class={classes()}>
      {local.children}
      <Show when={local.variant === "dashed"}>
        <DashedOutline />
      </Show>
    </button>
  );
}
