import path from "node:path";
import { fileURLToPath } from "node:url";
import { solidStart } from "@solidjs/start/config";
import { nitroV2Plugin as nitro } from "@solidjs/vite-plugin-nitro-2";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [solidStart(), nitro(), tailwindcss()],
  ssr: { external: ["drizzle-orm"] },
  resolve: {
    alias: {
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src"),
      "@drizzle": path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "./drizzle",
      ),
    },
  },
});
