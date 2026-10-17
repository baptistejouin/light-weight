import type { JSX } from "solid-js";
import { children } from "solid-js";

interface LayoutProps {
  children: JSX.Element;
}

export function Layout(props: LayoutProps) {
  const resolved = children(() => props.children);
  return (
    <main class="mx-auto flex min-h-svh max-w-sm flex-col overscroll-none px-4 pt-2">
      {resolved()}
    </main>
  );
}
