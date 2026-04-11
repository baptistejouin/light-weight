import { children } from "solid-js";
import type { JSX } from "solid-js";

interface LayoutProps {
  children: JSX.Element;
}

export default function Layout(props: LayoutProps) {
  const resolved = children(() => props.children);
  return <main class="flex flex-col gap-2 p-2 m-4">{resolved()}</main>;
}
