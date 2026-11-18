import type { JSX } from "solid-js";
import { SwipeActions } from "@/components/ui/swipe-actions";

interface SwipeDeleteRowProps {
  onDelete: () => void;
  deleteDisabled?: boolean;
  children: JSX.Element;
}

export function SwipeDeleteRow(props: SwipeDeleteRowProps) {
  const actions = () => [
    {
      label: "Delete",
      variant: "danger" as const,
      onSelect: props.onDelete,
      disabled: props.deleteDisabled,
    },
  ];

  return (
    <li>
      <SwipeActions actions={actions()}>
        <div class="flex flex-col gap-1 px-4 py-4">{props.children}</div>
      </SwipeActions>
    </li>
  );
}
