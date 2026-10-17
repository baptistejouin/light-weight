import path from "node:path";
import { fileURLToPath } from "node:url";
import { solidStart } from "@solidjs/start/config";
import { nitroV2Plugin as nitro } from "@solidjs/vite-plugin-nitro-2";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Server-only vars (e.g. SESSION_SECRET) aren't prefixed with VITE_, so Vite
  // won't expose them via import.meta.env or process.env on its own.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return {
    plugins: [solidStart(), nitro(), tailwindcss()],
    ssr: { external: ["drizzle-orm"] },
    resolve: {
      alias: {
        "@": path.resolve(
          path.dirname(fileURLToPath(import.meta.url)),
          "./src",
        ),
        "@drizzle": path.resolve(
          path.dirname(fileURLToPath(import.meta.url)),
          "./drizzle",
        ),
      },
    },
  };
});
