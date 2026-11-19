import type { JSX } from "solid-js";

export function SearchIcon(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      class="inline"
      {...props}
    >
      <title>Search Icon</title>
      <path
        fill="currentColor"
        d="M6 2h8v2H6zM4 4h2v2H4zM2 6h2v8H2zm2 8h2v2H4zm2 2h8v2H6zm8-2h2v2h-2zm2-8h2v8h-2zm-2-2h2v2h-2zm2 12h2v2h-2zm2 2h2v2h-2zm2 2h2v2h-2z"
      />
    </svg>
  );
}
