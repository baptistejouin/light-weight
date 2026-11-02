import type { JSX } from "solid-js";

export function ChevronDownIcon(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="inline"
      {...props}
    >
      <title>Chevron Down Icon</title>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
