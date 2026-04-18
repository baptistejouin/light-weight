// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";

const appEl = document.getElementById("app");
if (!appEl) {
  throw new Error("Missing #app element");
}

mount(() => <StartClient />, appEl);
