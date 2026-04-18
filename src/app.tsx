// @refresh reload
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import { Layout } from "~/components/layout";
import Navigation from "~/components/navigation";

export default function App() {
  return (
    <Router
      root={(props) => (
        <Layout>
          <Navigation />
          <Suspense>{props.children}</Suspense>
        </Layout>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
