// Stroke is inset by half its 1.5px width so it sits fully inside the parent
const rx = "calc(var(--radius-xl) - 0.75px)";

export function DashedOutline() {
  return (
    <svg
      aria-hidden="true"
      class="pointer-events-none absolute top-[0.75px] left-[0.75px] h-[calc(100%-1.5px)] w-[calc(100%-1.5px)] overflow-visible text-gray-300"
    >
      <rect
        width="100%"
        height="100%"
        style={{ rx }}
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-dasharray="6 6"
        stroke-linecap="round"
      />
    </svg>
  );
}
