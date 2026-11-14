// @refresh reload
import { Router, useLocation } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import {
  createEffect,
  ErrorBoundary,
  type JSX,
  on,
  Show,
  Suspense,
} from "solid-js";
import "./app.css";
import AppHeader from "@/components/app-header";
import { Layout } from "@/components/layout";
import Navigation from "@/components/navigation";
import { NewRecordProvider } from "@/components/new-record/context";
import { ErrorMessage } from "@/components/ui/error-message";

export default function App() {
  return (
    <Router root={(props) => <Root>{props.children}</Root>}>
      <FileRoutes />
    </Router>
  );
}

function Root(props: { children?: JSX.Element }) {
  const location = useLocation();
  const isLoginPage = () => location.pathname === "/login";

  return (
    <NewRecordProvider>
      <Layout>
        <Show when={!isLoginPage()}>
          <AppHeader />
        </Show>
        <div class="flex flex-1 flex-col pb-8">
          <ErrorBoundary
            fallback={(error, reset) => (
              <PageError message={error.message} reset={reset} />
            )}
          >
            <Suspense>{props.children}</Suspense>
          </ErrorBoundary>
        </div>
        <Show when={!isLoginPage()}>
          <Navigation />
        </Show>
      </Layout>
    </NewRecordProvider>
  );
}

// ErrorBoundary keeps its fallback until reset, so retry on navigation
function PageError(props: { message: string; reset: () => void }) {
  const location = useLocation();

  createEffect(
    on(
      () => location.pathname + location.search,
      () => props.reset(),
      { defer: true },
    ),
  );

  return <ErrorMessage>{props.message}</ErrorMessage>;
}
