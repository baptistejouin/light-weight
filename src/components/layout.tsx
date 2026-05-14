import type { JSX } from "solid-js";
import { children } from "solid-js";

interface LayoutProps {
  children: JSX.Element;
}

export function Layout(props: LayoutProps) {
  const resolved = children(() => props.children);
  return (
    <main class="mx-auto flex h-svh max-w-sm flex-col px-4">{resolved()}</main>
  );
}
