import { splitProps } from "solid-js";
import { type DialogProps, DialogRoot } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function DrawerDialog(props: DialogProps) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <DialogRoot
      {...rest}
      class={cn(
        "mx-auto mt-auto mb-0 h-[85dvh] max-h-none w-full max-w-lg overflow-hidden p-0 open:flex open:flex-col",
        "rounded-t-3xl bg-white shadow-[0_-8px_30px_rgb(0_0_0/0.12)]",
        "backdrop:bg-black/40 backdrop:backdrop-blur-sm",
        "open:slide-in-from-bottom-full open:animate-in open:duration-500 open:ease-[cubic-bezier(0.32,0.72,0,1)]",
        "backdrop:fade-in backdrop:animate-in backdrop:duration-500",
        "data-closing:slide-out-to-bottom-full data-closing:pointer-events-none data-closing:animate-out data-closing:fill-mode-forwards data-closing:duration-300",
        "data-closing:backdrop:fade-out data-closing:backdrop:animate-out data-closing:backdrop:fill-mode-forwards data-closing:backdrop:duration-300",
        local.class,
      )}
    >
      <div
        aria-hidden="true"
        class="mx-auto mt-3 mb-1 h-1.5 w-10 shrink-0 rounded-full bg-black/15"
      />
      <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)]">
        {local.children}
      </div>
    </DialogRoot>
  );
}
