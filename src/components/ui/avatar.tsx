import { cn } from "@/lib/utils";

interface AvatarProps {
  name?: string;
  class?: string;
}

export function Avatar(props: AvatarProps) {
  return (
    <div
      role="img"
      aria-label={props.name ?? "User"}
      class={cn(
        "flex size-10 items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-500 uppercase",
        props.class,
      )}
    >
      {props.name?.charAt(0)}
    </div>
  );
}
