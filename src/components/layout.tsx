import type { JSX } from "solid-js";
import { children } from "solid-js";

interface LayoutProps {
  children: JSX.Element;
}

export function Layout(props: LayoutProps) {
  const resolved = children(() => props.children);
  return <main class="px-4 h-svh flex flex-col max-w-sm mx-auto">{resolved()}</main>;
}
