import type { JSX } from "solid-js";

export function PlusIcon(props: JSX.IntrinsicElements["svg"]) {
  return (
    // Icon from Pixelarticons by Gerrit Halfmann - https://github.com/halfmage/pixelarticons/blob/master/LICENSE
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      class="inline"
      {...props}
    >
      <title>Plus Icon</title>
      <path fill="currentColor" d="M13 11h7v2h-7v7h-2v-7H4v-2h7V4h2z" />
    </svg>
  );
}
