// @refresh reload
import { Router, useLocation } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { type JSX, Show, Suspense } from "solid-js";
import "./app.css";
import AppHeader from "@/components/app-header";
import { Layout } from "@/components/layout";
import Navigation from "@/components/navigation";
import { NewRecordProvider } from "@/components/new-record/context";

export default function App() {
  return (
    <Router root={(props) => <Root>{props.children}</Root>}>
      <FileRoutes />
    </Router>
  );
}

function Root(props: { children?: JSX.Element }) {
  const location = useLocation();

  return (
    <NewRecordProvider>
      <Layout>
        <Show when={location.pathname !== "/login"}>
          <AppHeader />
        </Show>
        <Suspense>{props.children}</Suspense>
        <Navigation />
      </Layout>
    </NewRecordProvider>
  );
}
