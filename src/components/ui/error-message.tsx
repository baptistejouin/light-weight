import { ErrorBoundary, type JSX } from "solid-js";

export function ErrorMessage(props: { children: JSX.Element }) {
  return (
    <p class="text-red-400 text-sm" role="alert">
      {props.children}
    </p>
  );
}

export function QueryBoundary(props: { children: JSX.Element }) {
  return (
    <ErrorBoundary
      fallback={(err) => <ErrorMessage>{err.message}</ErrorMessage>}
    >
      {props.children}
    </ErrorBoundary>
  );
}
